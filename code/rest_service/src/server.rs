use actix_web::{ App, HttpServer, middleware };
use actix_cors::Cors;

use std::env::{ set_var };

use crate::consts::PORT;
use crate::routes::{ locations };

/// Creates an instance of the Khateeb Remind
/// "Rest Service" server
pub async fn create_server() -> std::io::Result<()> {
    set_var("RUST_LOG", format!("actix_web={}", "DEBUG"));
    
    HttpServer::new(move || {
        // allow all requests CORS policy
        // cors policy should be configured within
        // proxy pointing to server
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .service(locations)
    })
    .bind(format!("0.0.0.0:{}", PORT))?
    .run()
    .await
}

