use actix_web::{ App, HttpServer, middleware };
use actix_cors::Cors;

use crate::routes::{ locations, ServerState, timings, jummahs };
use crate::io::{ DatabaseMiddleware, CacheMiddleware };

pub async fn create_server(config: ServerConfig<'static>) -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", format!("actix_web={}", "DEBUG"));
    let db = DatabaseMiddleware::new(
        config.database_address.ip_address,
        config.database_address.tcp_port
    ).await;
    let cache = CacheMiddleware::new(
        config.cache_database_address.ip_address,
        config.cache_database_address.tcp_port
    ).await;
    HttpServer::new(move || {
        // allow all requests CORS policy
        // cors policy should be configured within
        // proxy pointing to server
        let cors = Cors::permissive();
        let app_data = ServerState::new(db.clone(), cache.clone());
        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .app_data(app_data)
            .service(locations)
            .service(timings)
            .service(jummahs)
    })
    .bind(format!("0.0.0.0:{}", config.server_port))?
    .run()
    .await
}

type Seconds = u64;

#[derive(Clone)]
pub struct ServerConfig<'a> {
    pub database_address: TcpAddress<'a>,
    pub cache_database_address: TcpAddress<'a>,
    pub refresh_cache_rate: Seconds,
    pub server_port: u64
}

#[derive(Clone)]
pub struct TcpAddress<'a>{
    pub ip_address: &'a str,
    pub tcp_port: u16
}

impl<'a> TcpAddress<'a> {
    pub fn new(ip_address: &'a str, tcp_port: u16) -> Self {
        TcpAddress { ip_address, tcp_port }
    }
}