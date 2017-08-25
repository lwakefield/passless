from node:8.4.0-alpine

workdir /app
copy package.json /app/
run npm install
copy *.js /app/

cmd node index.js
