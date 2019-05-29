# UCROP.IT API

## Dependencies instalation

```
$ npm install
```

## Mysql

In the repository there is the configuration for the connection to the database. It is defined in .env.example

To configure and initialize the application:

```
$ cp .env.example .env
```

If necessary, if you want to run the migrations that are queued:

```
$ npm run db:migrate
```

to rollback migrations:

```
$ npm run migrate:undo
```

### Clarification:

The sequelize client must be installed if you want to run the migrations.

```
$ npm i -g sequelize-cli
```

To run in development enviroment

```
$ npm run dev
```