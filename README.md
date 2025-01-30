## Running the project with Docker (Docker Desktop needs to be running)
```bash
docker-compose up --build
```

## Running migrations
```bash
docker-compose exec api npm run typeorm:migration:run
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deploying the app (we currently use Heroku)
```bash
$ git push heroku main
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


