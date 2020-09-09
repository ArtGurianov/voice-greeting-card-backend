## Description

Voicy api is a graphql app for digital gift cards system.

## Installation and Setup

DO steps.

---

dokku apps:create voicy

sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis

dokku postgres:create voicy-production-pg

dokku redis:create voicy-production-redis

dokku postgres:link voicy-production-pg voicy
//DATABASE_URL: postgres://postgres:b99bcf9148950087f4e7eafedf501834@dokku-postgres-voicy-production-pg:5432/voicy_production_pg

dokku redis:link voicy-production-redis voicy
//REDIS_URL: redis://voicy-production-redis:6ea0f6e361cc53190b9829770c83545b15850d89b9413e15325a841e65da8b33@dokku-redis-voicy-production-redis:6379

NEW SSH
ssh-keygen -m pem
// /Users/art/.ssh/voicy-production-circleci-ssh

ADDING SSH TO DOKKU
cat ~/.ssh/voicy-production-circleci-ssh.pub | ssh root@157.230.22.65 «sudo sshcommand acl-add dokku voicy-production-circleci-ssh»
//EXEC RESULT - SHA256:n83y0blH+ORoQRBuJyi6ZegYC5txsAGVtCB+tJf7OnA

ADDING SSH TO CIRCLECI
cat ~/.ssh/voicy-production-circleci-ssh
//using hostname voicy-production

---

MANUAL FIRST DEPLOY TO DOKKU.

Locally:
docker build -t artgurianov/voicy:latest --build-arg NODE_ENV=production -f Dockerfile.production --no-cache .
docker push artgurianov/voicy:latest

On dokku server:
ssh root@157.230.22.65
docker pull artgurianov/voicy:latest
docker tag artgurianov/voicy:latest dokku/voicy:latest
dokku tags:deploy voicy latest
dokku apps:report voicy
dokku logs voicy

---

DOCKER COMPOSE
docker-compose --env-file .env.development up --build -V --force-recreate
docker-compose --env-file .env.development exec postgres psql -U postgres
exec postgres env

DOMAIN SETUP
dokku domains:report voicy
dokku domains:clear-global
dokku domains:set voicy api.voicy.ru
dokku proxy:report voicy #need to change 5000 to whatever port we set
dokku proxy:ports-set voicy http:80:8000

LETSENCRYPT SETUP
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku config:set --no-restart voicy DOKKU_LETSENCRYPT_EMAIL=artgurianov@yandex.ru
dokku letsencrypt voicy
#ports are configured automatically
dokku letsencrypt:cron-job --add

## Stay in touch

- Author - [Art Gurianov](https://github.com/artgurianov)
