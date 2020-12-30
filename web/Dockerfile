FROM node:14.1.0-alpine3.10

WORKDIR /app 

COPY package*.json ./

# Install everything including dev packages for building
RUN npm install

COPY . .

# Build next.js bundle
RUN npm run build
EXPOSE 3000
CMD npm run server 
