FROM node:18-alpine

WORKDIR /app

ARG GITHUB_TOKEN
RUN apk add --no-cache git \
    && git clone https://$GITHUB_TOKEN@github.com/diskoze/nodenab.git . \
    && npm install

CMD ["node", "server.js"]
