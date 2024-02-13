# Pastecrawler - Efficient Paste Crawler and Storage with Serverless Architecture and IaC

## Description:
Pastecrawler is an innovative solution designed to efficiently crawl and capture pastes from various sources, storing paste content in Amazon S3 and associated metadata in DynamoDB. This project is built on an event-driven architecture, employing a serverless approach for scalability, and it utilizes Infrastructure as Code (IaC) principles to manage its infrastructure deployment.

### Key Features:

- **Paste Crawling**: Pastecrawler adeptly scrapes pastes from diverse platforms and sources, ensuring comprehensive coverage.
- **Serverless Architecture**: By leveraging serverless computing, Pastecrawler guarantees automatic scalability, minimizing operational complexities and reducing costs.
- **Infrastructure as Code (IaC)**: The entire infrastructure setup, including AWS resources, event triggers, S3 buckets, and DynamoDB tables, is defined and provisioned using IaC tools such as AWS CloudFormation or Terraform.
- **Amazon S3 Integration**: Captured paste content is securely stored in Amazon S3, allowing easy access, retrieval, and analysis.
- **DynamoDB Metadata**: Metadata linked to each paste, including source information, timestamps, and other relevant details, is structured and stored in DynamoDB for efficient retrieval.
- **Event-Driven System**: The project embraces an event-driven approach, processing paste captures and storage through event triggers, ensuring a highly responsive system.
- **Caching Mechanism**: An intelligent caching mechanism efficiently manages duplicate pastes, optimizing storage and retrieval operations.
- **Scalability and Performance**: Pastecrawler is designed to manage substantial paste volumes while maintaining high performance and responsiveness.
- **Configuration and Customization**: The system offers easy configuration of sources to crawl, storage settings, and event triggers to align with specific requirements.

## Current Flow
![Current flow](https://tinyurl.com/27xgyzws)<!--[Current flow](./diagrams/current-flow.puml)-->

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
5. [Redis UI](http://localhost:8002) (can be skipped)
```
redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@redis:6379 
```
6. [LocalStack Health](http://localhost:4566/health) (can be skipped)
7. Take a :tea: break for 7 minutes, to see the first pastes in [Dynamodb UI](http://localhost:8001)
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
yarn
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
- [x] Apply [least-privilege permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege) in `serverless.yml`
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
- [PlantUML](https://github.com/awslabs/aws-icons-for-plantuml)
- [Puml For Markdown](https://github.com/danielyaa5/puml-for-markdown)

## Nice to know
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [Best practices for working with AWS Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

## Contacts

[![Linkedin](https://i.stack.imgur.com/gVE0j.png) LinkedIn](https://www.linkedin.com/in/michael-horojanski-23b9a493/)
