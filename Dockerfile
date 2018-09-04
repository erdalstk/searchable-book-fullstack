FROM node:8-alpine
# Create app directory
WORKDIR /usr/src/app
VOLUME ["/usr/src/app/static"]
COPY . .

RUN yarn
RUN yarn build
EXPOSE 8080

CMD yarn start