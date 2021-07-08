const DATABASE_NAME: &str = "khateebRemind";

use mongodb::{ 
    Client as MongoClient, 
    Database,
    bson::{ Document as MongoDocument, doc, oid::ObjectId },
    options::FindOptions,
    Cursor
};
use redis::{ 
    aio::MultiplexedConnection as RedisConnection,
    RedisResult
};

pub async fn create_database_connection(ip_address: &str, tcp_port: u16) -> Database {
    let database_uri = format!("mongodb://{}:{}", ip_address, tcp_port);
    let client = MongoClient::with_uri_str(&database_uri)
        .await
        .expect("couldn't connect to database");
    client.database(DATABASE_NAME)
}

pub async fn create_cache_layer_connection(cache_ip_address: &str, tcp_port: u16) -> RedisConnection  {
    let cache_address = format!("redis://{}:{}", cache_ip_address, tcp_port);
    let client = redis::Client::open(cache_address).unwrap();
    client.get_multiplexed_tokio_connection().await.unwrap()
}

use tokio::stream::StreamExt as TokioStream; 

#[derive(Clone, Debug)]
pub struct DatabaseMiddleware {
    client: Database
}

const LOCATIONS_COLLECTION: &str = "locations";
const TIMINGS_COLLECTION: &str = "timings";
const JUMMAHS_COLLECTION: &str = "jummahpreferences";
const USERS_COLLECTION: &str = "users";

impl DatabaseMiddleware {
    pub async fn new(database_ip_address: &str, database_tcp_port: u16) -> Self {
        let client = create_database_connection(
            database_ip_address,
            database_tcp_port
        ).await;
        DatabaseMiddleware { client }
    }
 
    pub async fn find_locations(&self, institution_id: &str, doc_limit: Option<i64>) -> Vec<MongoDocument> {
        let collection = self.client.collection(LOCATIONS_COLLECTION);
        let query_options = FindOptions::builder()
            .projection(doc!{ "name": 1, "address": 1 })
            .limit(Self::document_limit(doc_limit))
            .build();
        let query = collection.find(Self::get_all_active_documents(institution_id), query_options);
        let cursor = match query.await {
            Ok(data) => data,
            Err(e) => {
                eprintln!("error occured when fetching locations: {}", e);
                return Vec::new()
            }
        };
        Self::return_data_from_stream(cursor).await
    }

    async fn return_data_from_stream(mut cursor: Cursor) -> Vec<MongoDocument> {
        let mut vec = Vec::new();
        while let Some(document) = TokioStream::next(&mut cursor).await {
            if let Ok(data) = document {
                vec.push(data);
            }
        }
        vec
    }

    fn get_all_active_documents(institution_id: &str) -> MongoDocument {
        let id = ObjectId::with_string(institution_id).unwrap_or(ObjectId::new());
        doc! { "institutionID" : id, "active": true }
    }

    // using -1 with a mongo cursor returns all requested documents
    // in a single stream rather than over multiple streams
    fn document_limit(doc_limit: Option<i64>) -> i64 {
        let get_all_documents_in_a_single_batch = -1;
        match doc_limit {
            Some(l) => l * get_all_documents_in_a_single_batch,
            None => 200 * get_all_documents_in_a_single_batch
        }
    }

    pub async fn find_timings(&self, institution_id: &str, doc_limit: Option<i64>) -> Vec<MongoDocument> {
        let collection = self.client.collection(TIMINGS_COLLECTION);
        let query_options = FindOptions::builder()
            .projection(doc!{ "hour": 1, "minute": 1, "locationID": 1 })
            .limit(Self::document_limit(doc_limit))
            .build();
        let query = collection.find(Self::get_all_active_documents(institution_id), query_options);
        let cursor = match query.await {
            Ok(data) => data,
            Err(e) => {
                eprintln!("error occured when fetching timings: {}", e);
                return Vec::new()
            }
        };
        Self::return_data_from_stream(cursor).await
    }

    pub async fn find_jummahs(&self, institution_id: &str, doc_limit: Option<i64>) -> Vec<MongoDocument> {
        let collection = self.client.collection(JUMMAHS_COLLECTION);
        let id = ObjectId::with_string(institution_id).unwrap_or(ObjectId::new());
        let query = collection.aggregate(vec![
            doc!{ "$match": { "institutionID": id, "khateebID": { "$ne": "none" } } },
            doc!{ "$limit": Self::document_limit(doc_limit) * -1 },
            doc! {
                "$lookup": {
                    "from": USERS_COLLECTION,
                    "let": { "pid": "$khateebID" },
                    // transforms "khateebID" field which is a string into
                    // an ObjectId and then performs a lookup on it
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$eq": [ "$_id", { "$toObjectId": "$$pid" } ]
                                }
                            }
                        }
                    ],
                    "as": "khateeb"
                }
            },
            doc!{ "$unwind": "$khateeb" },
            doc!{
                "$project": {
                    "_id": "$_id",
                    "institutionID": "$institutionID",
                    "timingID": "$timingID",
                    "locationID": "$locationID",
                    "khateebFirstName": "$khateeb.firstName",
                    "khateebLastName": "$khateeb.lastName",
                    "khateebTitle": "$khateeb.title",
                    "date": "$date",
                    "isGivingKhutbah": "$isGivingKhutbah",
                    "isBackup": "$isBackup"
                }
            }
        ], None);
        let cursor = match query.await {
            Ok(data) => data,
            Err(e) => {
                eprintln!("error occurred when fetching jummahs: {}", e);
                return Vec::new()
            }
        };
        Self::return_data_from_stream(cursor).await
    }
}

#[derive(Clone)]
pub struct CacheMiddleware {
    client: RedisConnection
}

impl CacheMiddleware {
    pub async fn new(cache_ip_address: &str, tcp_port: u16) -> Self {
        let client = create_cache_layer_connection(cache_ip_address, tcp_port).await;
        CacheMiddleware { client }
    }

    pub async fn institution_lookup(&mut self, auth_token: &str) -> String {
        let mut con = self.client.clone();
        let val: RedisResult<String> = redis::cmd("GET")
            .arg(auth_token)
            .query_async(&mut con)
            .await;
        match val {
            RedisResult::Ok(v) => v,
            _ => String::from("none")
        }
    }
}