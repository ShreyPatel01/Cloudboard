FROM node:16-alpine AS Server

ENV NODE_ENV=server

WORKDIR /usr/src/server

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]
