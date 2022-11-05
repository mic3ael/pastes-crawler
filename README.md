# Pastes Crawler

## Current Flow

![Current flow](https://tinyurl.com/2bet9utc)<!--[Current flow](./diagrams/current-flow.puml)-->

## Get Started

### Start

1. Install [Docker](https://www.docker.com/) & `docker-compose`
2. Make sure you have there enough space for extra images & containers
3. Clone the project
4. Open command line(Terminal)

```
cd <root project folder>
chmod +x start.local.sh
./start.local.sh
```

5. [Dynamodb UI](http://localhost:8001)
6. [Redis UI](http://localhost:8002/instance/69acda63-093d-4b44-8127-4399396f9805/browser/?db=0&search=%2A) (can be skipped)
7. [LocalStack Health](http://localhost:4566/health) (can be skipped)
8. Wait for 2-3 minutes, see the new pastes in dynamodb
9. Enjoy :stuck_out_tongue_winking_eye:

### Stop

```
cd <root project folder>
chmod +x stop.local.sh
./stop.local.sh
```

### Unit Test

1. Install [yarn](https://yarnpkg.com/)
2.

```
cd <project root folder>
yarn test
```

## Add more crawlers

![Add more crawlers](https://tinyurl.com/2y42ejxu)<!--[Add more crawlers](./diagrams/add-new-crawlers.puml)-->

### Steps

1. See the project structure & `serverless.yml` file
2. Add your service (lambda, ec2, ecs, batch)
3. Add additional services according to your requirements (S3, Redis..)
4. Add to `env.<env>` file the required params
5. Add a new dynamodb table with [serverless framework](https://www.serverless.com/)
6. Make sure that your service has the right role & policy permissions in the `serverless.yml`
7. Enjoy :heart:

## TODO

- [ ] Add unit tests, coverage > 95%
- [ ] Fix security vulnerability of the `serverless framework` OR use [Terraform](https://www.terraform.io/)
- [x] Add right service permissions(role, policy) to `serverless.yml`
- [ ] Add E2E tests [gauge](https://gauge.org/)
- [ ] Fix TODOs in the code
- [ ] Add type declaration files to support TS
- [ ] Store passwords/secrets in [secrets-manager](https://aws.amazon.com/secrets-manager/)

## Tools

- [Localstack](https://localstack.cloud)
- [Serverless Framework](https://www.serverless.com)
- [NodeJS](https://nodejs.org/en)
- [Redis](https://redis.io)
- [Redis Insight](https://redis.com/redis-enterprise/redis-insight)
- [Dynamodb Admin](https://www.npmjs.com/package/dynamodb-admin)
- [AWS](https://aws.amazon.com)
- [Docker](https://www.docker.com)

## Contacts

[![Linkedin](https://i.stack.imgur.com/gVE0j.png) LinkedIn](https://www.linkedin.com/in/michael-horojanski-23b9a493/)
