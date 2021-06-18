mod database;

use database::{ ConnectionOptions, DatabaseInterfaces };

use actix_web::{ get, App, HttpResponse, HttpServer, Result, web };
use serde::{ Deserialize, Serialize };
use actix_cors::Cors;

use std::env::{ set_var };

#[derive(Debug)]
struct AppState {
    db: web::Data<DatabaseInterfaces>
}

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
            .service(hello) 
    })
    .bind("0.0.0.0:80")?
    .run()
    .await
}

#[derive(Serialize, Deserialize)]
struct MyObj<T> {
    data: Vec<T>,
    msg: i8
}

#[get("/")]
async fn hello(data: web::Data<AppState>) -> Result<HttpResponse> {
    let tokens = data
        .as_ref()
        .db
        .find_auth_token()
        .await;
    let res = MyObj {
        data: tokens,
        msg: 0
    };
    Ok(HttpResponse::Ok().json(res))
}