FROM rust:1.45.0-alpine AS be_builder
RUN apk add alpine-sdk
COPY Cargo.toml Cargo.lock /
COPY src /src
COPY templates /templates
COPY content /content
RUN cargo run --release

FROM node:14.4.0-alpine AS fe_builder
COPY assets /assets
WORKDIR /assets
RUN npm install --production
RUN npx webpack --config webpack.production.config.js

FROM nginx:mainline-alpine
COPY --from=be_builder /output/ /usr/share/nginx/html
COPY --from=fe_builder /output/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf