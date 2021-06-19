use mongodb::{ 
    Client, 
    options::ClientOptions, 
    Collection,
    options::FindOptions,
    Database,
    Cursor
};
use bson::{ doc, Document, oid::ObjectId };
use tokio::stream::StreamExt;
use serde::{ Deserialize, Serialize };

use std::collections::HashMap;

const TARGET_DATABASE: &'static str = "khateebRemind";
const AUTH_TOKEN_COLLECTION: &'static str = "resttokens";
const LOCATIONS_COLLECTION: &'static str = "locations";
const TIMINGS_COLLECTION: &'static str = "timings";
const USERS_COLLECTION: &'static str = "users";
const JUMMAHS_COLLECTION: &'static str = "jummahpreferences";
const INSTITUTIONS_COLLECTION: &'static str = "institutions";

#[derive(Debug, Clone)]
pub struct DatabaseConfig<'a> {
    pub uri: &'a str,
    pub client_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthTokenEntry {
    id: String,
    institution: String
}

#[derive(Debug, Clone)]
pub struct DatabaseMiddleware {
    client: Client
}

const get_all_documents_in_single_batch: i64 = -5000;

impl DatabaseMiddleware {
    pub async fn new(options: &DatabaseConfig<'_>) -> Self {
        let mut client_options = ClientOptions::parse(options.uri)
            .await
            .expect("Could not connect to database");
        println!("Database socket is open");
        client_options.app_name = Some(options.client_name.clone());
        let client = Client::with_options(client_options).unwrap();
        DatabaseMiddleware { client }
    }

    fn target_collection(&self, collection: &str) -> Collection {
        self.client
            .database(TARGET_DATABASE)
            .collection(collection)
    }

    fn auth_token_collection(&self) -> Collection {
        self.target_collection(AUTH_TOKEN_COLLECTION)
    }

    fn create_query_options_with_projection(&self, p: Document) -> FindOptions {
        let options = FindOptions::builder()
            .projection(p)
            .limit(get_all_documents_in_single_batch)
            .build();
        options
    }

    pub async fn find_auth_tokens(&self) -> Vec<AuthTokenEntry> {
        let collection = self.auth_token_collection();
        let query_options = self.create_query_options_with_projection(
            doc!{ "_id": 1, "institution": 1 }
        );
        let query = collection.find(None, query_options);
        let mut cursor = match query.await {
            Ok(data) => data,
            Err(e) => {
                eprintln!("error occured when fetching auth tokens {}", e);
                return Vec::new()
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

    fn locations_collection(&self) -> Collection {
        self.target_collection(LOCATIONS_COLLECTION)
    }

    fn get_all_active_documents_filter(&self, institution_id: &str) -> Document {
        doc!{ 
            "institutionID": ObjectId::with_string(institution_id),
            "active": true 
        }
    }

    async fn return_all_documents_in_cursor(&self, mut cursor: Cursor) -> Vec<Document> {
        let mut vec = Vec::new();
        while let Some(doc) = cursor.next().await {
            if let Ok(d) = doc {
                vec.push(d);
            }
        }
        vec
    }

    pub async fn find_locations(&self, institution_id: &str) -> Vec<Document> {
        let collection = self.locations_collection();
        let query_options = self.create_query_options_with_projection(
            doc!{ "__v": -1, "active": -1 }
        );
        let query = collection.find(self.get_all_active_documents_filter(institution_id), query_options);
        let mut cursor = match query.await {
            Ok(data) => data,
            Err(e) => {
                eprintln!("error occured when fetching auth tokens {}", e);
                return Vec::new()
            }
        };
        self.return_all_documents_in_cursor(cursor).await
    }

    fn timings_collection(&self) -> Collection {
        self.target_collection(TIMINGS_COLLECTION)
    }

    pub async fn find_timings(&self, institution_id: &str) -> Vec<Document> {
        let collection = self.timings_collection();
        let query_options = self.create_query_options_with_projection(
            doc!{ "__v": -1, "active": -1, "defaultKhateebs": -1 }
        );
        let query = collection.find(self.get_all_active_documents_filter(institution_id), query_options);
        let mut cursor = match query.await {
            Ok(data) => data,
            Err(e) => {
                eprintln!("error occured when fetching auth tokens {}", e);
                return Vec::new()
            }
        };
        self.return_all_documents_in_cursor(cursor)
    }

    // used for testing only
    #[allow(dead_code)]
    pub fn get_database(&self) -> Database {
        self.client.database(TARGET_DATABASE).clone()
    }
}

#[derive(Debug)]
pub struct CacheDatabase {
    // temporary - will be moved to Redis or memcache soon insha'Allah
    cache: HashMap<String, String>
}

impl CacheDatabase {
    pub fn new() -> Self {
        CacheDatabase { cache: HashMap::new() }
    }

    pub fn bulk_insert_auth_tokens(&mut self, tokens: &Vec<AuthTokenEntry>) {
        for token in tokens {
            self.cache.insert(token.id.clone(), token.institution.clone());
        }
    }

    pub fn verify(&self, auth_token_id: &str) -> Option<String> {
        self.cache
            .get_key_value(auth_token_id)
            .map(|(_, v)| v.clone())
    }
}

#[cfg(test)]
mod test {
    use super::{ 
        doc, 
        DatabaseConfig, 
        DatabaseMiddleware,
        AUTH_TOKEN_COLLECTION,
        LOCATIONS_COLLECTION,
        TIMINGS_COLLECTION,
        USERS_COLLECTION,
        JUMMAHS_COLLECTION,
        INSTITUTIONS_COLLECTION,
        Database,
        CacheDatabase 
    };

    use bson::{ Document, oid::ObjectId };
    use mongodb::{ results::InsertManyResult };
    use tokio;
    use chrono::{ Utc };
    use chrono::TimeZone;

    use std::future::{ Future };

    type Ids<'a> = &'a Vec<ObjectId>;

    async fn get_connection() -> Database {
        let db_config = DatabaseConfig {
            uri: "mongodb://localhost:27017/",
            client_name: String::from("rest_service")
        };
        let db = DatabaseMiddleware::new(&db_config).await;
        db.get_database()
    }

    async fn create_database_middleware() -> DatabaseMiddleware {
        let db_config = DatabaseConfig {
            uri: "mongodb://localhost:27017/",
            client_name: String::from("rest_service")
        };
        DatabaseMiddleware::new(&db_config).await
    }

    fn test_auth_tokens(institution_ids: Ids) -> Vec<Document> {
        vec![
            doc!{ "institution": institution_ids[0].clone() },
            doc!{ "institution": institution_ids[1].clone() },
            doc!{ "institution": institution_ids[2].clone() },
            doc!{ "institution": institution_ids[3].clone() },
        ]
    }

    fn test_institutions() -> Vec<Document> {
        vec![doc!{}, doc!{}, doc!{}, doc!{}]
    }

    fn test_locations(institution_ids: Ids) -> Vec<Document> {
        vec![
            doc!{ "institutionID": institution_ids[0].clone(), "name": "rand1", "active": true },
            doc!{ "institutionID": institution_ids[0].clone(), "name": "rand2", "active": false },
            doc!{ "institutionID": institution_ids[1].clone(), "name": "rand3", "active": true },
            doc!{ "institutionID": institution_ids[2].clone(), "name": "rand4", "active": true },
        ]
    }

    fn test_timings(institution_ids: Ids, location_ids: Ids) -> Vec<Document> {
        vec![
            doc!{ 
                "institutionID": institution_ids[0].clone(),
                "locationID": location_ids[0].clone(),
                "name": "rand1",
                "active": true,
                "hour": 12,
                "minute": 30
            },
            doc!{ 
                "institutionID": institution_ids[1].clone(),
                "locationID": location_ids[2].clone(),
                "name": "rand2",
                "active": true,
                "hour": 12,
                "minute": 30
            },
            doc!{ 
                "institutionID": institution_ids[1].clone(),
                "locationID": location_ids[2].clone(),
                "name": "rand4",
                "active": false,
                "hour": 12,
                "minute": 30
            },
            doc!{ 
                "institutionID": institution_ids[2].clone(),
                "locationID": location_ids[3].clone(),
                "name": "rand5",
                "active": true,
                "hour": 12,
                "minute": 30
            },
        ]
    }

    fn test_khateebs() -> Vec<Document> {
        vec![
            doc!{ "firstName": "Mo", "lastName": "jo" },
            doc!{ "firstName": "Mo", "lastName": "ko" },
            doc!{ "firstName": "Mo", "lastName": "yo" },
            doc!{ "firstName": "Mo", "lastName": "lo" },
        ]
    }

    fn test_jummahs(institution_ids: Ids, user_ids: Ids, timings_ids: Ids) -> Vec<Document> {
        let june = 6;
        let date = Utc.ymd(2021, june, 20).and_hms(12, 0, 0);
        vec![
            doc!{ 
                "date": date.clone(),
                "isBackup": true,
                "institutionID": institution_ids[2].clone(),
                "khateebID": user_ids[0].clone(),
                "timingID": timings_ids[0].clone(),
            },
            doc!{ 
                "date": date.clone(),
                "isBackup": false,
                "institutionID": institution_ids[1].clone(),
                "khateebID": user_ids[3].clone(),
                "timingID": timings_ids[2].clone(),
            },
            doc!{ 
                "date": date.clone(),
                "isBackup": true,
                "institutionID": institution_ids[0].clone(),
                "khateebID": user_ids[1].clone(),
                "timingID": timings_ids[3].clone(),
            },
            doc!{ 
                "date": date.clone(),
                "isBackup": true,
                "institutionID": institution_ids[1].clone(),
                "timingID": timings_ids[1].clone()
            },
        ]
    }

    fn insert_results_to_vector_of_ids(res: InsertManyResult) -> Vec<ObjectId> {
        let mut vec = Vec::new();
        for (_, value) in res.inserted_ids {
            let id = value
                .as_object_id()
                .unwrap()
                .clone();
            vec.push(id);
        }
        return vec
    }

    async fn setup() {
        let connection = get_connection().await;
        let inst = connection
            .collection(INSTITUTIONS_COLLECTION)
            .insert_many(test_institutions(), None)
            .await
            .unwrap();
        let institution_ids = insert_results_to_vector_of_ids(inst);
        
        connection
            .collection(AUTH_TOKEN_COLLECTION)
            .insert_many(test_auth_tokens(&institution_ids), None)
            .await
            .unwrap();
        
        let locations = connection
            .collection(LOCATIONS_COLLECTION)
            .insert_many(test_locations(&institution_ids), None)
            .await
            .unwrap();
        let location_ids = insert_results_to_vector_of_ids(locations);

        let timings = connection
            .collection(TIMINGS_COLLECTION)
            .insert_many(test_timings(&institution_ids, &location_ids), None)
            .await
            .unwrap();
        let timings_ids = insert_results_to_vector_of_ids(timings);
        
        let users = connection
            .collection(USERS_COLLECTION)
            .insert_many(test_khateebs(), None)
            .await
            .unwrap();
        let user_ids = insert_results_to_vector_of_ids(users);
        
        connection
            .collection(JUMMAHS_COLLECTION)
            .insert_many(test_jummahs(&institution_ids, &user_ids, &timings_ids), None)
            .await
            .unwrap();
    }

    async fn teardown() {
        let connection = get_connection().await;
        connection.drop(None).await.unwrap();
    }

    async fn run_test<T: Future>(test: T) {
        setup().await;
        test.await;
        teardown().await;
    }
    
    // required to run async tests
    #[tokio::test]
    async fn fetch_tokens_interface_should_correctly_fetch_tokens() {
        run_test(async {
            let db = create_database_middleware().await;
            let entries = db.find_auth_tokens().await;
            assert_eq!(entries.len(), 4);
        }).await
    }

    #[tokio::test]
    async fn fetch_tokens_interface_should_return_empty_array_on_error() {
        run_test(async {
            let db = create_database_middleware().await;
            teardown().await;
            let entries = db.find_auth_tokens().await;
            assert_eq!(entries.len(), 0);
        }).await
    }

    #[tokio::test]
    async fn cache_database_should_verify_existing_tokens_correctly() {
        run_test(async {
            let db = create_database_middleware().await;
            let entries = db.find_auth_tokens().await;
            let mut cache_db = CacheDatabase::new();
            cache_db.bulk_insert_auth_tokens(&entries);
            for token in entries {
                assert_eq!(cache_db.verify(&token.id), Some(token.institution.clone()))
            }
        }).await
    }

    #[test]
    fn cache_database_should_reject_non_existent_key() {
        let cache_db = CacheDatabase::new();
        assert_eq!(cache_db.verify("random key"), None);
        assert_eq!(cache_db.verify("another"), None);
        assert_eq!(cache_db.verify("hackerkey123"), None);
    }
}