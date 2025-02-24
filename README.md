## Correlation Matrix
![Correlation Matrix of letterboxd variables, based on roughly 15,000 films.] (assets/images/films_correlation_matrix.png)

The correlation matrix will be used to guide development and training of a prediction model that will recommend movies to Letterboxd users based on their account activity. 

## Running the project with Docker (Docker Desktop needs to be running)
```bash
docker-compose up --build
```

## Running migrations
While the server is running on docker, in a separate terminal:
```bash
npm run docker:migration:generate
```
```
docker exec letterboxd-project-api-1 npm run typeorm:migration:run
```
## Creating migrations
While the server is running on docker, in a separate terminal:
```bash
npm run docker:migration:generate ./migrations/<MIGRATION_NAME>
```
```
docker exec letterboxd-project-api-1 npm run typeorm:migration:generate ./migrations/<MIGRATION_NAME>
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


