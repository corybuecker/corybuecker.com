FROM golang:alpine AS builder

RUN mkdir $HOME/src && \
  cd $HOME/src && \
  apk add git nodejs npm && \
  git clone https://github.com/gohugoio/hugo.git && \
  cd $HOME/src/hugo && \
  git checkout v0.62.1 && \
  go install

COPY . /build

WORKDIR /build

RUN npm install && \
  npx webpack && \
  $GOPATH/bin/hugo --minify 

FROM nginx:mainline-alpine
COPY --from=builder /build/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf