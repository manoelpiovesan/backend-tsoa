### Backend com Typescript

#### Environment Variables

| Variable   | Required | Default       | Description                    |
|------------|----------|---------------|--------------------------------|
| DB_USER    | No       | admin         | Database user                  |
| DB_PASS    | No       | password      | Database password              |
| DB_HOST    | No       | localhost     | Database host                  |
| DB_PORT    | No       | 5432          | Database port                  |
| DB_NAME    | No       | backend_tsoa  | Database name                  |
| DB_KIND    | No       | postgres      | Database type (e.g., postgres) |
| APP_PORT   | No       | 3000          | Application port               |
| JWT_SECRET | No       | my_secret_key | Secret key for sign jwt        |

#### Setting up database with Docker

```shell
 docker compose up -d
```