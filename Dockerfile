# Shouldn't create an image larger than 100mb (~90mb)

FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# EXPOSE 4001

CMD ["node", "index.js"]

