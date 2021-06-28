use actix_web::{ get, HttpResponse, Result, web::Query };
use serde::{ Deserialize, Serialize };
use mongodb::bson::{ Document };

use std::fmt;

#[derive(Serialize, Deserialize, Debug)]
struct ServerResponse<'a> {
    data: Vec<Document>,
    msg: &'a str
}

impl fmt::Display for ServerResponse<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}\n{}", self.data, self.msg)
    }
}

#[derive(Deserialize, Debug)]
pub struct Info {
    pub document_limit: Option<i32>
}

#[get("/locations")]
pub async fn locations(auth: Authorized, info: Query<Info>) -> Result<HttpResponse> {
    println!("{:?}", info);
    println!("{:?}", auth.token);
    Ok(HttpResponse::Ok().json(ServerResponse { data: Vec::new(), msg: "success" }))
}

use actix_web::dev::Payload;
use actix_web::error::ErrorUnauthorized;
use actix_web::{ Error, FromRequest, HttpRequest };
use futures::future::{ Ready };

pub struct Authorized {
    token: String
}

impl FromRequest for Authorized {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;
    type Config = ();

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        if is_authorized(req) {
            futures::future::ok(Authorized { token: authorization_as_str(req) })
        } else {
            let res = ServerResponse { data: Vec::new(), msg: "unauthorized" };
            futures::future::err(ErrorUnauthorized(res))
        }
    }
}

fn authorization_as_str(req: &HttpRequest) -> String {
    let auth = get_authorization(req);
    if auth.is_none() {
        return String::from("none")
    }
    match auth.unwrap().to_str() {
        Ok(s) => String::from(s),
        _ => String::from("none")
    }
}

fn get_authorization(req: &HttpRequest) -> Option<&actix_web::http::HeaderValue> {
    req.headers().get("authorization") 
}

fn is_authorized(req: &HttpRequest) -> bool {
    if let Some(_) = get_authorization(req) {
        true
    } else {
        false
    }
}