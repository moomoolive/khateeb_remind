use actix_web::{ get, App, HttpResponse, HttpServer, Result };
use serde::{ Deserialize, Serialize };
use actix_cors::Cors;

/// # Main entry point of server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        // allow all CORS policy
        let cors = Cors::permissive();
         
        App::new()
            .wrap(cors)
            .service(hello) 
    })
        .bind("localhost:8000")?
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