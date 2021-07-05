use actix_web::{ 
    get, 
    HttpResponse, 
    Result, 
    web::Query, 
    dev::Payload,
    FromRequest, 
    HttpRequest
};
use serde::{ Deserialize, Serialize };
use mongodb::bson::{ Document };
use futures::future::{ Ready };

use std::fmt;

use crate::errors::Errors as ServerErrors;

#[get("/locations")]
pub async fn locations(auth: Authorized, info: Query<Info>) -> Result<HttpResponse, ServerErrors> {
    println!("{:?}", info);
    println!("{:?}", auth.token);
    Ok(HttpResponse::Ok().json(ServerResponse { data: Vec::new(), msg: "success" }))
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct ServerResponse<'a> {
    pub data: Vec<Document>,
    pub msg: &'a str
}

impl fmt::Display for ServerResponse<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}\n{}", self.data, self.msg)
    }
}

#[derive(Deserialize, Debug, PartialEq, Clone)]
pub struct Info {
    pub document_limit: Option<i32>
}

#[derive(Debug, PartialEq, Clone)]
pub struct Authorized {
    token: String
}

impl FromRequest for Authorized {
    type Error = ServerErrors;
    type Future = Ready<Result<Self, Self::Error>>;
    type Config = ();

    fn from_request<'b>(req: &'b HttpRequest, _: &mut Payload) -> Self::Future {
        let auth_token: Option<&'b actix_web::http::HeaderValue> = req.headers().get("authorization");
        if let Some(token) = auth_token {
            let token = match token.to_str() {
                Ok(x) => x,
                Err(_) => "none"
            };
            futures::future::ok(Authorized { token: String::from(token) })
        } else {
            futures::future::err(ServerErrors::UnauthorizedError)
        }
    }
}