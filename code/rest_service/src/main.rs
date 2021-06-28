mod server;
mod consts;
mod io;
mod cron_job;
mod routes;

use server::{ create_server };
use cron_job::start_refresh_cache_cron_job;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // how to start tokio reactor here ?
    let seconds_per_minute = 60;
    start_refresh_cache_cron_job(seconds_per_minute * 30);
    create_server().await
}