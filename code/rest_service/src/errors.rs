use actix_web::{ dev::HttpResponseBuilder, error, http::StatusCode, HttpResponse };
use derive_more::{ Display, Error };

use crate::routes::ServerResponse;

#[derive(Debug, Display, Error)]
pub enum Errors {
    #[display(fmt = "unauthorized")]
    UnauthorizedError
}

impl error::ResponseError for Errors {
    fn error_response(&self) -> HttpResponse {
        HttpResponseBuilder::new(self.status_code())
            .json(ServerResponse { data: Vec::new(), msg: "unauthorized" })
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            Self::UnauthorizedError => StatusCode::UNAUTHORIZED
        }
    }
}