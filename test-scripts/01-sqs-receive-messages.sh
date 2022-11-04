#!/bin/bash

aws --endpoint-url=http://localhost:4566 sqs receive-message --queue-url http://localhost:4566/000000000000/collect-queue.fifo --profile localstack --attribute-names All --message-attribute-names All --max-number-of-messages 10