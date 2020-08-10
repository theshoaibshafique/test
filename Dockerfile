FROM node:10 as builder
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build:cicd_dev
RUN mv build dev
RUN npm run build:cicd_test
RUN mv build test
RUN npm run build:cicd_uat
RUN mv build uat

FROM node:10-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dev ./dev
COPY --from=builder /app/test ./test
COPY --from=builder /app/uat ./uat
