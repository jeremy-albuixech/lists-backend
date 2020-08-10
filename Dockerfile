FROM node:lts

WORKDIR /usr/src/owl-backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm build
