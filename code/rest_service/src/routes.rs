use actix_web::{ 
    get, 
    HttpResponse, 
    Result, 
    web::Query, 
    dev::Payload,
    FromRequest, 
    HttpRequest,
    Error as ActixWebError
};
use serde::{ Deserialize, Serialize };
use mongodb::bson::{ Document };
use futures::future::{ Ready };

use std::fmt;

use crate::errors::Errors as ServerErrors;
use crate::io::{ DatabaseMiddleware, CacheMiddleware };

#[derive(Clone)]
pub struct ServerState {
    pub db: DatabaseMiddleware,
    pub cache: CacheMiddleware
}

impl ServerState {
    pub fn new(db: DatabaseMiddleware, cache: CacheMiddleware) -> Self {
        ServerState { db, cache }
    }
}

impl FromRequest for ServerState {
    type Config = ();
    type Error = ActixWebError;
    type Future = Ready<Result<Self, Self::Error>>;
    
    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        // not sure if cloning app data on every request is a good idea
        // from a performance standpoint - but was implemented this way
        // because it was easier to compile --> will probably change in 
        // future (isa)
        let state = req.app_data::<Self>().unwrap().clone();
        futures::future::ok(state)
    }
}

#[get("/locations")]
pub async fn locations(auth: Authorized, info: Query<Info>, mut server_state: ServerState) -> Result<HttpResponse, ServerErrors> {
    let institution_id = server_state.cache
        .institution_lookup(&auth.token)
        .await;
    if institution_id == String::from("none") {
        return Err(ServerErrors::InstitutionNotFound)
    }
    let data = server_state.db
        .find_locations(&institution_id, info.entry_limit)
        .await;
    Ok(HttpResponse::Ok().json(ServerResponse { data, msg: "success" }))
}

#[get("/timings")]
pub async fn timings(auth: Authorized, info: Query<Info>, mut server_state: ServerState) -> Result<HttpResponse, ServerErrors> {
    let institution_id = server_state.cache
        .institution_lookup(&auth.token)
        .await;
    if institution_id == String::from("none") {
        return Err(ServerErrors::InstitutionNotFound)
    }
    let data = server_state.db
        .find_timings(&institution_id, info.entry_limit)
        .await;
    Ok(HttpResponse::Ok().json(ServerResponse { data, msg: "success" }))
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
    pub entry_limit: Option<i64>
}

#[derive(Debug, PartialEq, Clone)]
pub struct Authorized {
    token: String
}

const DATABASE_ID_LENGTH: usize = 24;

impl FromRequest for Authorized {
    type Error = ServerErrors;
    type Future = Ready<Result<Self, Self::Error>>;
    type Config = ();

    fn from_request<'b>(req: &'b HttpRequest, _: &mut Payload) -> Self::Future {
        let auth_token: Option<&'b actix_web::http::HeaderValue> = req.headers().get("authorization");
        if auth_token.is_none() {
            return futures::future::err(ServerErrors::UnauthorizedError)
        }
        let token = auth_token.unwrap().to_str().unwrap_or("none");
        if token.len() != DATABASE_ID_LENGTH {
            return futures::future::err(ServerErrors::InvalidToken)
        }
        futures::future::ok(Authorized { token: String::from(token) })
    }
}