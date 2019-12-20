FROM node:13.2-alpine AS builder

COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm install

COPY . /app

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "run", "server"]
