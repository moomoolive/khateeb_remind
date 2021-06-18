mod database;
mod state;
mod routes;

use state::{ AppState };
use database::{ ConnectionOptions, DatabaseInterfaces };
use routes::{ authenticate };

use actix_web::{ App, HttpServer, web };
use actix_cors::Cors;

use std::env::{ set_var };


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    set_var("RUST_LOG", "actix_web=debug");
    let database_config = ConnectionOptions {
        uri: "mongodb://localhost:27017/",
        client_name: String::from("rest_service")
    };
    let db = DatabaseInterfaces::new(&database_config).await;
    
    HttpServer::new(move || {
        // allow all CORS policy
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .data(AppState {
                db: web::Data::new(db.clone())
            })
            .service(authenticate) 
    })
    .bind("0.0.0.0:80")?
    .run()
    .await
}