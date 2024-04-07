
FROM --platform=linux/amd64 node:20.12.1-bookworm as build

ENV NODE_ENV=production
# Define build-time variables
ARG REACT_APP_FRONT_VERSION
ARG REACT_APP_BACKEND_URL

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --no-audit --maxsockets 1

COPY . .

RUN npm run build

FROM nginx:1.25.2

COPY --from=build /usr/src/app/build/ /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

LABEL maintainer="Yuriy Semyenkov <yuriy.semyenkov@gmail.com>" \
      version="1.0.0"
