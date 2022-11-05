# Pastes Crawler

## Current Flow

![Current flow](https://tinyurl.com/2afu93hz)<!--[Current flow](./diagrams/current-flow.puml)-->

## Get Started

### Start

1. Install [Docker](https://www.docker.com/)
2. Make sure you have there enough space for extra images & containers
3. Clone the project
4. Open command line(Terminal)

```
cd <root project folder>
chmod +x start.local.sh
./start.local.sh
```

5. [Dynamodb UI](http://localhost:8001)
6. [Redis UI](http://localhost:8002) (can be skipped)

```
# Connection String
redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@redis:6379
```

7. Wait for 2-3 minutes, see new pastes
8. Enjoy :stuck_out_tongue_winking_eye:

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

![Add more crawlers](https://tinyurl.com/28ar2r7l)<!--[Add more crawlers](./diagrams/next-stage.puml)-->

### Steps

1. See the project structure & `serverless.yml` file
2. Add your service (lambda, ec2, ecs, batch)
3. Add additional services according to requirements
4. Add to `env.<env>` file the required params
5. Add new dynamodb table with [serverless framework](https://www.serverless.com/)
6. Make sure that your service has the right role & policy permissions
7. Enjoy :heart:

## TODO

- [ ] Add unit tests, coverage > 95%
- [ ] Fix security vulnerability of the `serverless framework` OR use [Terraform](https://www.terraform.io/)
- [ ] Add right service permissions(role, policy) to `serverless.yml`
- [ ] Add E2E tests [gauge](https://gauge.org/)
- [ ] Fix TODOs in code
- [ ] Add type declaration files to support TS

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