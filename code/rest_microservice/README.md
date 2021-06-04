# Khateeb Remind REST Microservice

A REST endpoint for khateeb remind institutions to access their data programmatically.

Built with Actix-web (Rust) so that the service can be as efficent as possible and handle as many requests as possible per server.

*All of these commands take a significant time to execute (on the order of minutes), avoid creating production executable until neccessary.

### Run development server with hot reload
```
cargo watch -x run
```

### Run development server
```
cargo run
```

### Build production executable
```
cargo build --release
```

### Run tests
```
cargo test
```