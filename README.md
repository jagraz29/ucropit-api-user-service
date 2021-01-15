<div style="text-align: center">
    <h1>UCROP.IT API </h1>
</div>

<p>
  This is the repo of main UCROP.IT api, this are build with <a href="https://nodejs.dev/">NodeJS</a>, <a href="https://www.typescriptlang.org/">TypeScript</a> and <a href="https://www.mongodb.com/">MongoDB </a>.
</p>

## Versions

- NodeJS version 14.8 or more
- Typescript version 3.9.7

## 👨‍💻 Install project Development

1. Clone the repo
2. cp .env.example .env
3. Complete environment variables
4. npm install
5. npm run dev (run server)
6. npm run seed (seed initial data into DataBase)
7. npm run seed -- --reset (Reset DataBase)

## MongoDB in Docker

1. docker-compose up
2. Add url in .env DATABASE_URL=mongodb://root:root@localhost:27018/production?authSource=admin

## API Documentation Development

- [API Documentation in Development environment](http://localhost:3000/api-docs/#/)
