FROM node:18.15.0-alpine3.17 as build

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN yarn config set registry https://registry.npmmirror.com && \
    yarn install

EXPOSE 3000

# 如果需要指定后端服务端口号，例如：REACT_APP_BACKEND_PORT=9002 yarn start。
CMD [ "yarn", "start" ]

#FROM node:18.15.0-alpine3.17 as build
#
#RUN mkdir /app
#
#COPY . /app
#
#WORKDIR /app
#
#RUN yarn config set registry https://registry.npmmirror.com && \
#    yarn build
#
#FROM firesh/nginx-lua:alpine-3.18 as release
#
#COPY --from=build /app/build/ /app/
#
#COPY ./w8t.conf /etc/nginx/conf.d
#
#WORKDIR /etc/nginx/
#
#EXPOSE 80
#
#CMD ["nginx","-g","daemon off;"]
