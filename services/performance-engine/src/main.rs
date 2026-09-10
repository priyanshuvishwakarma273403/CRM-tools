mod dedup;
mod forecast;

use axum::{
    routing::{get, post},
    Json, Router,
};
use dedup::{find_duplicates_parallel, DedupQuery, DedupResponse};
use forecast::{simulate_monte_carlo, ForecastQuery, ForecastResult};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/dedup/match", post(dedup_handler))
        .route("/math/pipeline-forecast", post(forecast_handler))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 50051));
    println!("High-Performance Rust Native Engine listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "UP",
        "service": "crm-performance-engine-rust",
        "version": "0.1.0"
    }))
}

async fn dedup_handler(Json(payload): Json<DedupQuery>) -> Json<DedupResponse> {
    let res = find_duplicates_parallel(payload);
    Json(res)
}

async fn forecast_handler(Json(payload): Json<ForecastQuery>) -> Json<ForecastResult> {
    let res = simulate_monte_carlo(payload);
    Json(res)
}
