FROM node:18 as build

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN yarn config set registry https://registry.npmmirror.com && \
    yarn install

CMD [ "node", "start.js","80","backend:9001" ]
