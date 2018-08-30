FROM node:8-alpine

RUN apk add --update libc6-compat
# Create app directory
WORKDIR /usr/src/app
COPY . .

RUN yarn
RUN yarn build
EXPOSE 8080

CMD yarn start