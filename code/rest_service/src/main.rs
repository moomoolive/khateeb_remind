mod server;
mod cron_job;
mod io;
mod routes;
mod errors;

use server::{ create_server, ServerConfig, TcpAddress };
use cron_job::start_refresh_cache_cron_job;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let seconds_per_minute = 60;
    let config: ServerConfig<'static> = ServerConfig {
        database_address: TcpAddress::new("127.0.0.1", 27017),
        cache_database_address: TcpAddress::new("127.0.0.1", 6379),
        refresh_cache_rate: 30 * seconds_per_minute,
        server_port: 80
    };
    start_refresh_cache_cron_job(config.clone());
    create_server(config.clone()).await
}