FROM elixir:1.9.4-alpine AS builder
ENV MIX_ENV prod
RUN apk add nodejs npm
COPY mix.exs mix.lock package.json package-lock.json /build/
WORKDIR /build

RUN mix local.hex --force && \
  mix deps.get && \
  mix deps.compile && \
  npm install

COPY . /build

RUN npx webpack && \
  mix run -e "Builder.build"

FROM nginx:mainline-alpine
COPY --from=builder /build/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf