# TheBoard

The project show simply implementation of agile scrum board and contains database, backend and frontend.
Build for portfolio purposes.

Project are still in work in progress. Working backend are ended estimated with 85%, frontend about 20%. 

Used stack:
- Postgres database
- Express.js
- Prisma ORM
- React standalone
- React Query
- Tanstack/Form
- Tailwind
- Vite

## Backend features
- JWT Authorization
- REST API
- Pagination
- Redis caching

## Work in progress info

Try to run project in development mode - both docker and 

## Getting started:

Fill .env variables like .env.example blueprint in project. 

I highly recommend to setup docker first of all, it prevent some errors with prisma model generation which runned in postinstall script which needed connecting with db.

## Docker run

Docker container are used for providing postgres database with redis server in project. It required for backend properly run.

### development:

```shell
  docker-compose -f docker-compose.dev.yml up -d  
```

### production:
```shell
  docker-compose -f docker-compose.yml up -d  
```

## Seed database for development purposes:

In root folder with running database in docker:
```shell
  node ./prisma/seed.js
```

This project is created with nx monorepo, first of all run:

```shell
  npm install
```

in root folder.

## Running backend app in development mode

Simply use nx command:
```shell
npx nx run backend:serve
```

## Running frontend app in development mode

Simply use nx command:
```shell
npx nx run frontend:serve
```