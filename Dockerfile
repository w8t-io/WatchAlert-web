FROM node:18.15.0-alpine3.17 as build

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN yarn config set registry https://registry.npmmirror.com && \
    yarn install

EXPOSE 3000

CMD [ "REACT_APP_BACKEND_IP=backend:9001","yarn", "start" ]
