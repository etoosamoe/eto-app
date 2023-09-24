
FROM node:20 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM nginx:1.25.2

COPY --from=build /usr/src/app/build/ /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

LABEL maintainer="Yuriy Semyenkov <yuriy.semyenkov@gmail.com>" \
      version="1.0.0"