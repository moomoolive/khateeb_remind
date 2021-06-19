use crate::database::{ DatabaseMiddleware };

#[derive(Debug)]
pub struct AppState {
    pub db: DatabaseMiddleware
}