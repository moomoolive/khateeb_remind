const DATABASE_NAME: &str = "khateebRemind";

use mongodb::{ Client as MongoClient, Database };
use redis::{ 
    aio::Connection as RedisConnection, 
    ConnectionInfo, 
    ConnectionAddr, 
    aio::connect_tokio as RedisClient 
};

pub async fn create_database_connection(ip_address: &str, tcp_port: u16) -> Database {
    let database_uri = format!("mongodb://{}:{}", ip_address, tcp_port);
    let client = MongoClient::with_uri_str(&database_uri)
        .await
        .expect("couldn't connect to database");
    client.database(DATABASE_NAME)
}

pub async fn create_cache_layer_connection(cache_ip_address: &str, tcp_port: u16) -> RedisConnection  {
    let address = ConnectionAddr::Tcp(String::from(cache_ip_address), tcp_port);
    let connection = ConnectionInfo {
        addr: Box::new(address),
        db: 0,
        username: None,
        passwd: None
    };
    RedisClient(&connection)
        .await
        .expect("Couldn't connect to cache db")
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

use std::sync::Arc;

#[derive(Clone)]
pub struct CacheMiddleware {
    client: Arc<RedisConnection>
}

impl CacheMiddleware {
    pub async fn new(cache_ip_address: &str, tcp_port: u16) -> Self {
        let client = create_cache_layer_connection(cache_ip_address, tcp_port).await;
        let client = Arc::new(client);
        CacheMiddleware { client }
    }
}