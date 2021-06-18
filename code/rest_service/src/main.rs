use actix_web::{ get, App, HttpResponse, HttpServer, Result };
use serde::{ Deserialize, Serialize };
use actix_cors::Cors;

use std::env::{ set_var };

/// # Main entry point of server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    set_var("RUST_LOG", "actix_web=debug");

    HttpServer::new(|| {
        // allow all CORS policy
        let cors = Cors::permissive();
         
        App::new()
            .wrap(cors)
            .service(hello) 
    })
        .bind("0.0.0.0:80")?
        .run()
        .await
}

#[derive(Serialize, Deserialize)]
struct MyObj {
    name: String,
}

#[get("/")]
async fn hello() -> Result<HttpResponse> {
    let res = MyObj { name: String::from("Hello world") };
    Ok(HttpResponse::Ok().json(MyObj {
        name: res.name,
    }))
}