FROM node:16.18-alpine3.16 as base

WORKDIR /src

COPY package.json ./
COPY yarn.lock ./
RUN yarn global serverless
FROM base as local
ENV NODE_ENV=local
RUN yarn
COPY . /
CMD ["yarn", "start:local"]