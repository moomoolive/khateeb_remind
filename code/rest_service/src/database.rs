use mongodb::{ 
    Client, 
    options::ClientOptions, 
    Collection,
    options::FindOptions
};
use bson::{ doc, Document };
use tokio::stream::StreamExt;

const TARGET_DATABASE: &'static str = "khateebRemind";
const AUTH_TOKEN_COLLECTION: &'static str = "resttokens";

#[derive(Debug, Clone)]
pub struct DatabaseConfig<'a> {
    pub uri: &'a str,
    pub client_name: String,
}

#[derive(Debug, Clone)]
pub struct DatabaseMiddleware {
    client: Client
}

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

    pub async fn find_auth_tokens(&self) -> Vec<Document> {
        let collection = self.auth_token_collection();
        let get_all_documents = doc!{};
        let query_options = FindOptions::builder()
            .projection(doc!{ "_id": 1, "institution": 1 })
            .build();
        let query = collection.find(get_all_documents, query_options);
        let mut cursor = match query.await {
            Ok(data) => data,
            Err(e) => {
                eprintln!("error occured when fetching auth tokens {}", e);
                return Vec::new();
            }
        };
        let mut auth_tokens = Vec::new();
        while let Some(doc) = cursor.next().await {
            if let Ok(d) = doc {
                auth_tokens.push(d);
            }
        }
        auth_tokens
    }
}