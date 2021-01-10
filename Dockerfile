FROM alpine:latest
ARG MONGO_URI
ENV MONGO_URI=${MONGO_URI}
RUN apk add --update nodejs npm
WORKDIR /app
COPY . /app
WORKDIR /app/server
RUN npm install
EXPOSE 5000
CMD ["npx", "nodemon"]