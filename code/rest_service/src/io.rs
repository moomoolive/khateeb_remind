const DATABASE_NAME: &str = "khateebRemind";

use mongodb::{ Client as MongoClient, Database };
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

#[derive(Clone, Debug)]
pub struct DatabaseMiddleware {
    client: Database
}

impl DatabaseMiddleware {
    pub async fn new(database_ip_address: &str, database_tcp_port: u16) -> Self {
        let client = create_database_connection(
            database_ip_address,
            database_tcp_port
        ).await;
        DatabaseMiddleware { client }
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