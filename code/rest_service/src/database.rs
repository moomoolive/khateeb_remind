use mongodb::{ 
    Client, 
    options::ClientOptions, 
    Collection,
};
use bson::{ doc, Document };
use tokio::stream::StreamExt;

const TARGET_DATABASE: &'static str = "khateebRemind";
const AUTH_TOKEN_COLLECTION: &'static str = "resttokens";

#[derive(Debug, Clone)]
pub struct ConnectionOptions<'a> {
    pub uri: &'a str,
    pub client_name: String,
}

#[derive(Debug, Clone)]
pub struct DatabaseInterfaces {
    client: Client
}

impl DatabaseInterfaces {
    pub async fn new(options: &ConnectionOptions<'_>) -> Self {
        let mut client_options = ClientOptions::parse(options.uri)
            .await
            .unwrap();
        client_options.app_name = Some(options.client_name.clone());
        let client = Client::with_options(client_options).unwrap();
        DatabaseInterfaces { client }
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
        let mut cursor = collection.find(doc!{}, None).await.unwrap();
        let mut auth_tokens = Vec::new();
        while let Some(doc) = cursor.next().await {
            match doc {
                Ok(d) => auth_tokens.push(d),
                _ => panic!("no doc")
            }
        }
        auth_tokens
    }
}