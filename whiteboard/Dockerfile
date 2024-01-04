FROM node:16-alpine AS Whiteboard

ENV NODE_ENV=whiteboard

WORKDIR /usr/src/Whiteboard

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
