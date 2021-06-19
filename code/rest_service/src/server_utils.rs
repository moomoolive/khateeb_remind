use crate::database::{ DatabaseMiddleware, DatabaseConfig };
use crate::routes::{ authenticate };
use crate::state::{ AppState };

use actix_web::{ App, HttpServer };
use actix_cors::Cors;

use std::env::{ set_var };

pub struct ServerConfig<'a> {
    pub db: DatabaseConfig<'a>,
    pub server_mode: &'static str,
    pub network_port: u32
}

pub async fn create_server(config: &ServerConfig<'_>) -> std::io::Result<()> {
    set_var("RUST_LOG", format!("actix_web={}", config.server_mode));
    let db = DatabaseMiddleware::new(&config.db).await;
    
    HttpServer::new(move || {
        // allow all requests CORS policy
        // cors policy should be configured within
        // proxy pointing to server
        let cors = Cors::permissive();
        let app_state = AppState {
            db: db.clone()
        };
        App::new()
            .wrap(cors)
            .data(app_state)
            .service(authenticate)
    })
    .bind(format!("0.0.0.0:{}", config.network_port))?
    .run()
    .await
}