# Campaign Reports Service

Сервіс для збору та агрегації даних про кампанії з Probation API.

## Технології

- NestJS
- TypeORM
- PostgreSQL
- Docker
- Swagger

## Встановлення та запуск

### Запуск через Docker

1. Склонуйте репозиторій:
```bash
git clone <repository-url>
cd campaign-reports-service
```

2. Запустіть проект через Docker Compose:
```bash
docker-compose up -d
```

Сервіс буде доступний за адресою: http://localhost:3000

### Запуск локально

1. Встановіть залежності:
```bash
npm install
```

2. Створіть файл .env на основі .env.example

3. Запустіть міграції:
```bash
npm run migration:run
```

4. Запустіть проект:
```bash
npm run start:dev
```

## API Документація

Swagger документація доступна за адресою: http://localhost:3000/api/docs

### Основні ендпоінти

- `POST /campaign-reports/fetch` - Ініціює збір даних за вказаний період
- `GET /campaign-reports/aggregate` - Отримання агрегованих даних по кампаніях

## Автоматичний збір даних

Сервіс автоматично збирає дані кожну годину за поточний день.

## Розробка

### Міграції

Створення нової міграції:
```bash
npm run migration:generate src/migrations/MigrationName
```

Застосування міграцій:
```bash
npm run migration:run
```

Відкат останньої міграції:
```bash
npm run migration:revert
``` 