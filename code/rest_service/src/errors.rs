use actix_web::{ dev::HttpResponseBuilder, error, http::StatusCode, HttpResponse };
use derive_more::{ Display, Error };

use crate::routes::ServerResponse;

#[derive(Debug, Display, Error)]
pub enum Errors {
    #[display(fmt = "unauthorized")]
    UnauthorizedError,
    #[display(fmt = "invalid_token")]
    InvalidToken,
    #[display(fmt = "institution_not_found")]
    InstitutionNotFound
}

impl error::ResponseError for Errors {
    fn error_response(&self) -> HttpResponse {

        HttpResponseBuilder::new(self.status_code())
            .json(ServerResponse { 
                data: Vec::new(),
                msg: match *self {
                    Self::UnauthorizedError => "unauthorized",
                    Self::InvalidToken => "invalid token",
                    Self::InstitutionNotFound => "institution not found"
                }
            })
    }

    fn status_code(&self) -> StatusCode {
        StatusCode::UNAUTHORIZED
    }
}