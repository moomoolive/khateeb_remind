use crate::database::{ DatabaseInterfaces };

use actix_web::{ web };

#[derive(Debug)]
pub struct AppState {
    pub db: web::Data<DatabaseInterfaces>
}