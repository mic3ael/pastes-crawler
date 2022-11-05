# Pastes Crawler

## Current Flow

![Current flow](https://tinyurl.com/2afu93hz)<!--[Current flow](./diagrams/current-flow.puml)-->


## Get Started
### Start

1. Install docker
2. Make sure you have there enough space
3. Clone the project
4. Open command line
```
cd <project root folder>
chmod +x start.local.sh
./start.local.sh
```
5. [Dynamodb UI](http://localhost:8001)
6. [Redis UI](http://localhost:8002) (can be skipped)
```
# Connection String
redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@redis:6379
```
7. Wait for 2-3 minutes see new pastes
8. Enjoy :stuck_out_tongue_winking_eye:

### Stop
```
cd <project root folder>
chmod +x stop.local.sh
./stop.local.sh
```
### Unit Test
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