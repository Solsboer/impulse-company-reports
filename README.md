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
2. Створіть файл .env на основі .env.example, вписавши свій API_KEY

3. Запустіть проект через Docker Compose:
```bash
docker-compose up -d
```

Сервіс буде доступний за адресою: http://localhost:3000


## API Документація

Swagger документація доступна за адресою: http://localhost:3000/api/docs
В полі Authorization введіть ваш API_KEY

### Основні ендпоінти

- `POST /campaign-reports/fetch` - Ініціює збір даних за вказаний період з Probation API
- `GET /campaign-reports/aggregate` - Отримання агрегованих даних по кампаніях
- `GET /campaign-reports/reports` - Отримання даних по кампаніях за вказаний період

## Автоматичний збір даних

Сервіс автоматично збирає дані кожну годину за поточний день.

## Структура проекту

```
src/
├── config/                 # Конфігурації (TypeORM, тощо)
├── controllers/           # Контролери API
├── dto/                   # Data Transfer Objects
│   ├── fetch-data.dto.ts        # DTO для отримання даних
│   ├── aggregate-data.dto.ts    # DTO для агрегації
│   └── probation-api.dto.ts     # DTO для Probation API
├── entities/             # Сутності бази даних
│   └── campaign-report.entity.ts
├── migrations/          # Міграції бази даних
├── services/            # Сервіси
│   ├── campaign-report.service.ts  # Основна бізнес-логіка
│   └── probation-api.service.ts    # Взаємодія з Probation API
├── validators/          # Кастомні валідатори
├── app.module.ts        # Головний модуль додатку
└── main.ts             # Точка входу

```