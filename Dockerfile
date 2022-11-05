FROM node:16.18-alpine3.16

# Create app directory
WORKDIR /usr/src/app
RUN adduser -S app

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN chown -R app /usr/src/app
ENV NODE_ENV=local
USER app
CMD ["yarn", "start:local"]