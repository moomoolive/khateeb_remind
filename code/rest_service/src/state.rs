use crate::database::{ DatabaseMiddleware, CacheDatabase };

type Minutes = u8;

#[derive(Debug)]
pub struct AppState {
    pub db: DatabaseMiddleware,
    pub cache_db: CacheDatabase,
    pub refresh_cache_after: Minutes 
}