FROM rust:1.77-alpine as builder

RUN apk add --no-cache musl-dev

WORKDIR /app
COPY Cargo.toml .
COPY src ./src

RUN cargo build --release

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/target/release/crm-performance-engine /app/crm-performance-engine

EXPOSE 50051

CMD ["/app/crm-performance-engine"]
