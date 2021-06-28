use serde::{ Serialize, Deserialize };
use mongodb::{ Client as MongoClient, Collection };
use redis::{ 
    Client as RedisClient, aio::Connection, RedisResult };
use tokio::stream::StreamExt;

#[derive(Debug, Serialize, Deserialize, PartialEq, PartialOrd)]
pub struct AuthTokenEntry {
    pub id: String,
    pub institution: String
}

/*
pub async fn create_db_connection(uri: &str) {

}*/

/// Create TCP connection with database and return cursor
/// pointing to authentication token collection in a synchronous manner
pub async fn auth_tokens_collection_sync(
    db_uri: &str, 
    db_name: &str, 
    auth_token_collection_name: &str) -> Collection {
    let client = MongoClient::with_uri_str(db_uri)
        .await
        .expect("couldn't connect to database");
    let database = client.database(db_name);
    database.collection(auth_token_collection_name)
}

/// Create TCP connection with cache database
/// in a synchoronous manner
pub async fn cache_db_connection_sync(cache_uri: &str) -> Connection {
    let redis_client = RedisClient::open(cache_uri)
        .expect("Error when setting cache settings");
    redis_client.get_async_connection()
        .await
        .expect("couldn't connect to cache")
}

/// Refresh cache database's authentication token inventory
/// in a synchronous manner.
/// Recommended to be put on seperate thread
pub async fn refresh_cache_sync(collection: &Collection, cache_connection: &mut Connection) {
    let auth_tokens = get_auth_tokens_sync(&collection).await;
    println!("{:#?}", auth_tokens);
    for entry in auth_tokens.iter() {
        println!("{:#?}", entry);
        //let _ = insert_in_cache_sync(cache_connection, &entry.id, &entry.institution).await;
    }
}

async fn insert_in_cache_sync(cache_connection: &mut Connection, key: &str, value: &str) -> RedisResult<()> {
    redis::cmd("SET")
        .arg(&[key, value])
        .query_async(cache_connection)
        .await
}

pub async fn get_auth_tokens_sync(collection: &Collection) -> Vec<AuthTokenEntry> {
    let mut cursor = match collection.find(None, None).await {
        Ok(data) => data,
        Err(e) => {
            eprintln!("{}", e);
            return Vec::new();
        }
    };
    let mut auth_tokens = Vec::new();
    while let Some(doc) = cursor.next().await {
        if let Ok(d) = doc {
            let id = d
                .get_object_id("_id")
                .map(|o_id| o_id.to_hex())
                .unwrap(); 
            // it's known that at this point it's safe to unwrap
            let institution = d
                .get_object_id("institution")
                .unwrap();
            let institution = String::from(institution.to_hex());
            let entry = AuthTokenEntry { id, institution };
            auth_tokens.push(entry);
        }
    }
    auth_tokens
}