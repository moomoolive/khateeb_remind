use actix_web::{ get, HttpResponse, Result, web };
use serde::{ Deserialize, Serialize };

use crate::state::AppState;

#[derive(Serialize, Deserialize)]
struct TokenResponse<T> {
    token: Vec<T>, // soon to be string
    msg: i8
}

#[get("/authenticate")]
pub async fn authenticate(data: web::Data<AppState>) -> Result<HttpResponse> {
    let token = data
        .db
        .find_auth_tokens()
        .await;
    let res = TokenResponse { token: token, msg: 0 };
    Ok(HttpResponse::Ok().json(res))
}