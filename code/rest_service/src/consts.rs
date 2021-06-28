use std::env::{ var };
use lazy_static::lazy_static;

pub const DB_NAME: &str = "khateebRemind";

pub const REST_TOKENS_COLLECTION: &str = "resttokens";

pub const PORT: u32 = 80;

lazy_static! {
    pub static ref DB_URI: String = var("DB_URI").unwrap_or(String::from("mongodb://localhost:27017"));

    pub static ref CACHE_URI: String = var("CACHE_URI").unwrap_or(String::from("redis://localhost:6379/"));
}