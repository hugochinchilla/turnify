FROM node:lts-alpine3.17 as builder
WORKDIR /app

COPY package-lock.json package.json /app/
RUN npm install

COPY . /app/
RUN npm run build

FROM node:lts-alpine3.17 as server
WORKDIR /app

RUN npm install -g serve
COPY --from=builder /app/build /app/build

CMD ["serve", "-s", "build", "-l", "4000"]
