use serde::{Deserialize, Serialize};
use rayon::prelude::*;

#[derive(Debug, Deserialize, Clone)]
pub struct CandidateRecord {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DedupQuery {
    pub target_name: String,
    pub target_email: Option<String>,
    pub target_phone: Option<String>,
    pub candidates: Vec<CandidateRecord>,
    pub threshold: Option<f64>,
}

#[derive(Debug, Serialize)]
pub struct DedupMatch {
    pub candidate_id: String,
    pub name: String,
    pub match_score: f64,
    pub match_reasons: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct DedupResponse {
    pub matches: Vec<DedupMatch>,
    pub processed_count: usize,
    pub execution_time_micros: u128,
}

pub fn jaro_winkler(s1: &str, s2: &str) -> f64 {
    let s1 = s1.to_lowercase();
    let s2 = s2.to_lowercase();
    if s1 == s2 {
        return 1.0;
    }
    let len1 = s1.chars().count();
    let len2 = s2.chars().count();
    if len1 == 0 || len2 == 0 {
        return 0.0;
    }

    let match_distance = (len1.max(len2) / 2).saturating_sub(1);
    let mut s1_matches = vec![false; len1];
    let mut s2_matches = vec![false; len2];

    let chars1: Vec<char> = s1.chars().collect();
    let chars2: Vec<char> = s2.chars().collect();

    let mut matches = 0;
    for i in 0..len1 {
        let start = i.saturating_sub(match_distance);
        let end = (i + match_distance + 1).min(len2);
        for j in start..end {
            if s2_matches[j] || chars1[i] != chars2[j] {
                continue;
            }
            s1_matches[i] = true;
            s2_matches[j] = true;
            matches += 1;
            break;
        }
    }

    if matches == 0 {
        return 0.0;
    }

    let mut transpositions = 0;
    let mut k = 0;
    for i in 0..len1 {
        if !s1_matches[i] {
            continue;
        }
        while !s2_matches[k] {
            k += 1;
        }
        if chars1[i] != chars2[k] {
            transpositions += 1;
        }
        k += 1;
    }

    let m = matches as f64;
    let jaro = ((m / len1 as f64) + (m / len2 as f64) + ((m - (transpositions as f64 / 2.0)) / m)) / 3.0;

    let mut prefix_len = 0;
    for i in 0..len1.min(len2).min(4) {
        if chars1[i] == chars2[i] {
            prefix_len += 1;
        } else {
            break;
        }
    }

    jaro + (prefix_len as f64 * 0.1 * (1.0 - jaro))
}

pub fn find_duplicates_parallel(query: DedupQuery) -> DedupResponse {
    let start = std::time::Instant::now();
    let threshold = query.threshold.unwrap_or(0.80);
    let total = query.candidates.len();

    let matches: Vec<DedupMatch> = query.candidates.par_iter().filter_map(|c| {
        let mut reasons = Vec::new();
        let name_sim = jaro_winkler(&query.target_name, &c.name);

        let mut score = name_sim * 0.7;
        if name_sim >= 0.85 {
            reasons.push(format!("High name similarity ({:.1}%)", name_sim * 100.0));
        }

        if let (Some(t_email), Some(c_email)) = (&query.target_email, &c.email) {
            if t_email.to_lowercase() == c_email.to_lowercase() {
                score += 0.3;
                reasons.push("Identical email address".to_string());
            }
        }

        if score >= threshold {
            Some(DedupMatch {
                candidate_id: c.id.clone(),
                name: c.name.clone(),
                match_score: (score * 100.0).round() / 100.0,
                match_reasons: reasons,
            })
        } else {
            None
        }
    }).collect();

    let elapsed = start.elapsed().as_micros();
    DedupResponse {
        matches,
        processed_count: total,
        execution_time_micros: elapsed,
    }
}
