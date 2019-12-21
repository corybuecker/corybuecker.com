FROM node:13.2-alpine AS builder

COPY package.json package-lock.json /build/
WORKDIR /build
RUN npm install
COPY . /build

ENV NODE_ENV=production
RUN npm run export

FROM nginx:mainline-alpine
COPY --from=builder /build/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 