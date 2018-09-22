FROM node:8-alpine

# Install apk dependencies and Set timezone to Japan time
RUN apk update && apk upgrade
RUN apk --update --no-cache add tzdata && \
  cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && echo "Asia/Tokyo" > /etc/timezone && \
  apk del tzdata 
RUN apk --update --no-cache add binutils make g++
RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/

# Create app directory
WORKDIR /usr/src/app
VOLUME ["/usr/src/app/static"]
COPY . .

# Deploy node app
RUN yarn
RUN yarn build
EXPOSE 8080

CMD yarn start
