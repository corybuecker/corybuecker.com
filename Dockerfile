FROM elixir:1.10.3-alpine AS be_builder

RUN apk add git openssh-client
ARG mix_env=production
ENV MIX_HOME /
ENV MIX_ENV $mix_env
WORKDIR $MIX_HOME
COPY mix.exs mix.lock $MIX_HOME
RUN mix local.hex --force
RUN mix local.rebar --force
RUN mix deps.get
RUN mix deps.compile
COPY . $MIX_HOME
RUN mix run -e "Builder.build()"

FROM node:14.4.0-alpine AS fe_builder

COPY . /
RUN npm install --production
RUN npx webpack --config webpack.production.config.js

FROM nginx:mainline-alpine

COPY --from=be_builder /output/ /usr/share/nginx/html
COPY --from=fe_builder /output/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf