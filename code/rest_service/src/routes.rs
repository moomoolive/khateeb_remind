use actix_web::{ get, HttpResponse, Result, web };
use serde::{ Deserialize, Serialize };
use bson::{ Document };

use crate::state::AppState;

#[derive(Serialize, Deserialize)]
struct InstitutionDocuments {
    data: Vec<Document>,
    msg: i8
}

#[get("/locations")]
pub async fn locations(data: web::Data<AppState>) -> Result<HttpResponse> {
    let locations = data
        .db
        .find_locations("random_location_id")
        .await;
    let res = InstitutionDocuments { data: locations, msg: 0 };
    Ok(HttpResponse::Ok().json(res))
}

#[get("/timings")]
pub async fn timings(data: web::Data<AppState>) -> Result<HttpResponse> {
    let timings = data
        .db
        .find_timings("random_location_id")
        .await;
    let res = InstitutionDocuments { data: timings, msg: 0 };
    Ok(HttpResponse::Ok().json(res))
}

#[get("/jummahs")]
pub async fn jummahs(_data: web::Data<AppState>) -> Result<HttpResponse> {
    let res = InstitutionDocuments { data: Vec::new(), msg: 0 };
    Ok(HttpResponse::Ok().json(res))
}