use crate::consts::{ DB_NAME, REST_TOKENS_COLLECTION, DB_URI, CACHE_URI };
use crate::io::{ 
    auth_tokens_collection_sync, 
    cache_db_connection_sync,
    refresh_cache_sync
};

/*
    tokio::spawn(async {
        loop {
            println!("hi");
            delay_for(tokio::time::Duration::from_secs(1)).await;
        }
    });
//delay_for(tokio::time::Duration::from_secs(seconds)).await;
*/

/// Creates a cron job that refreshes the cache database's
/// authentication token inventory, in an asynchronous manner.
/// Tokio reactor MUST be running or this function will cause
/// the thread it's on to crash.
pub fn start_refresh_cache_cron_job(seconds: u64) {
    tokio::spawn(async move {
        let collection = auth_tokens_collection_sync(&*DB_URI, DB_NAME, REST_TOKENS_COLLECTION).await;
        let mut con = cache_db_connection_sync(&*CACHE_URI).await;
        
        while {
            refresh_cache_sync(&collection, &mut con).await;
            true
        } {}
    });
}