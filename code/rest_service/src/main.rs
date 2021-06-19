mod database;
mod state;
mod routes;
mod server_utils;

use server_utils::{ create_server, ServerConfig };
use database::{ DatabaseConfig };

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = ServerConfig {
        db: DatabaseConfig {
            uri: "mongodb://localhost:27017/",
            client_name: String::from("rest_service")
        },
        server_mode: "debug",
        network_port: 80
    };
    create_server(&config).await
}