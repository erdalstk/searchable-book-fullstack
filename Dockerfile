FROM node:8-alpine
# Set timezone to Japan time
RUN apk update && apk upgrade && apk --no-cache add tzdata && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && echo "Asia/Tokyo" > /etc/timezone && apk del tzdata
# Create app directory
WORKDIR /usr/src/app
VOLUME ["/usr/src/app/static"]
COPY . .

RUN yarn
RUN yarn build
EXPOSE 8080

CMD yarn start