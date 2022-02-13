FROM node:15.13-alpine

WORKDIR /pastes-server

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]