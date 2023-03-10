FROM node:18.12.0-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

COPY . .

RUN npm ci
