use actix_web::rt::Arbiter as runtime;
use redis::{ RedisResult, aio::MultiplexedConnection as RedisConnection };
use tokio::{ 
    stream::StreamExt as TokioStream, 
    time::Duration, 
    time::delay_for  
};
use serde::{ Serialize, Deserialize };
use mongodb::Database;

use crate::io::{ create_database_connection, create_cache_layer_connection };
use crate::server::ServerConfig;

const REST_TOKEN_COLLECTION: &str = "resttokens";

#[derive(Debug, Serialize, Deserialize, PartialEq, PartialOrd)]
pub struct AuthTokenEntry {
    pub id: String,
    pub institution: String
}

pub fn start_refresh_cache_cron_job(config: ServerConfig<'static>) {
    runtime::spawn(async move {
        let database = create_database_connection(
            config.database_address.ip_address,
            config.database_address.tcp_port
        ).await;
        let mut cache_client = create_cache_layer_connection(
            config.cache_database_address.ip_address,
            config.cache_database_address.tcp_port
        ).await;
        loop {
            refresh_cache_database(&database, &mut cache_client).await;
            delay_for(Duration::from_secs(config.refresh_cache_rate)).await;
        }
    });
}

async fn refresh_cache_database(db_connection: &Database, cache_db_connection: &mut RedisConnection) {
    let collection = db_connection.collection(REST_TOKEN_COLLECTION);
    let mut cursor = match collection.find(None, None).await {
        Ok(data) => data,
        Err(_) => return
    };
    let mut auth_tokens = Vec::new(); 
    while let Some(doc) = TokioStream::next(&mut cursor).await {
        if let Ok(d) = doc {
            let id = d
                .get_object_id("_id")
                .map(|o_id| o_id.to_hex())
                .unwrap(); 
            let institution = d
                .get_object_id("institution")
                .unwrap();
            let institution = String::from(institution.to_hex());
            let entry = AuthTokenEntry { id, institution };
            auth_tokens.push(entry);
        }
    }
    for token in auth_tokens.iter() {
        let _: RedisResult<()> = redis::cmd("SET")
            .arg(&[&token.id, &token.institution])
            .query_async(cache_db_connection)
            .await;
    }
    println!("{} Token(s) successfully loaded into cache", auth_tokens.len());
}