# OAuth2 Setup Guide

Для использования Google OAuth2, выполните следующие шаги:

## 1. Создайте проект в Google Cloud Console

- Перейдите на https://console.cloud.google.com
- Создайте новый проект
- Включите Google+ API

## 2. Создайте OAuth2 credentials

- Перейдите в "APIs & Services" → "Credentials"
- Нажмите "Create Credentials" → "OAuth client ID"
- Выберите "Web application"
- Добавьте Authorized redirect URIs:
  - `http://localhost:3000/api/v1/auth/google/callback` (development)
  - `http://your-domain.com/api/v1/auth/google/callback` (production)

## 3. Скопируйте credentials

- Скопируйте `Client ID` и `Client Secret`
- Добавьте их в `.env` файл backend:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

## 4. Протестируйте

- Нажмите кнопку "Login with Google" на странице логина
- Вы будете перенаправлены на Google
- После авторизации вы вернетесь с JWT токеном

## Переменные окружения (.env)

```env
# обязательные
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
JWT_SECRET=your-jwt-secret-key

# опциональные
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

## Docker

При развертывании в Docker, передавайте переменные окружения:

```bash
docker-compose up -d \
  -e GOOGLE_CLIENT_ID="your-id" \
  -e GOOGLE_CLIENT_SECRET="your-secret"
```
