FROM node:14.1.0-alpine3.10

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 4000

CMD node src/server.js
