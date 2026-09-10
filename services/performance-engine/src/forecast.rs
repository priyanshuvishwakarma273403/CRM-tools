use serde::{Deserialize, Serialize};
use rand::prelude::*;

#[derive(Debug, Deserialize, Clone)]
pub struct DealOpportunity {
    pub id: String,
    pub title: String,
    pub value: f64,
    pub base_probability: f64, // 0.0 to 1.0
}

#[derive(Debug, Deserialize)]
pub struct ForecastQuery {
    pub deals: Vec<DealOpportunity>,
    pub iterations: Option<usize>,
}

#[derive(Debug, Serialize)]
pub struct ForecastResult {
    pub p10_revenue: f64, // Conservative (90% chance of exceeding)
    pub p50_revenue: f64, // Most likely (Median)
    pub p90_revenue: f64, // Aggressive (Top 10% outcome)
    pub mean_revenue: f64,
    pub iterations_run: usize,
    pub execution_time_micros: u128,
}

pub fn simulate_monte_carlo(query: ForecastQuery) -> ForecastResult {
    let start = std::time::Instant::now();
    let n = query.iterations.unwrap_or(10_000);
    let mut results = Vec::with_capacity(n);

    let mut rng = rand::thread_rng();

    for _ in 0..n {
        let mut sim_revenue = 0.0;
        for deal in &query.deals {
            let roll: f64 = rng.gen();
            if roll <= deal.base_probability {
                sim_revenue += deal.value;
            }
        }
        results.push(sim_revenue);
    }

    results.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

    let p10 = results[(n as f64 * 0.10) as usize];
    let p50 = results[(n as f64 * 0.50) as usize];
    let p90 = results[(n as f64 * 0.90) as usize];
    let sum: f64 = results.iter().sum();
    let mean = sum / n as f64;

    let elapsed = start.elapsed().as_micros();

    ForecastResult {
        p10_revenue: (p10 * 100.0).round() / 100.0,
        p50_revenue: (p50 * 100.0).round() / 100.0,
        p90_revenue: (p90 * 100.0).round() / 100.0,
        mean_revenue: (mean * 100.0).round() / 100.0,
        iterations_run: n,
        execution_time_micros: elapsed,
    }
}
