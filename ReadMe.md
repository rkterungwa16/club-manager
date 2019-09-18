# Club Manager Rest Api
Club Manager Rest Api Example. Using Node.js, Express, and MongoDb.

[![Maintainability](https://api.codeclimate.com/v1/badges/76f51aadb63297f67f66/maintainability)](https://codeclimate.com/github/rkterungwa16/club-manager/maintainability)


## Requirements

 - [Node v10.15+](https://nodejs.org/en/download/current/)

## Getting Started

Clone the repo:

```bash
git clone https://github.com/rkterungwa16/club-manager.git
cd club-manager
```

Install dependencies:
```bash
npm i
```

Set environment variables:

```bash
cp .env.example .env
```

## Code Formatter

```bash
# format code using prettier
npm run format
```

## Code Lint
```bash
# lint code with TSLint
npm run lint
```
```bash
# try to fix TSLint errors
npm run fix:lint
```

## Running Locally

```bash
npm run start:dev
```

## Running in Production

```bash
npm start
```

## Testing Locally...

### Register a user
```bash
curl -X POST \
http://localhost:3300/api/v1/register \
    -H 'cache-control: no-cache' \
    -H 'content-type: multipart/form-data' \
    -d '{"name": "Terungwa", "password": "123456", "email": "terungwakombol@gmail.com"}'
```

### Login a registered user
```bash
curl -X POST\
http://localhost:3300/api/v1/login \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -d '{"password": "123456", "email": "terungwakombol@gmail.com"}'
```
### Create club
```bash
curl -X POST\
http://localhost:3300/api/v1/create-club \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H "authorization: Bearer $token" \
    -d '{"name": "123456"}'
```

### Send Club invite
```bash
curl -X POST\
http://localhost:3300/api/v1/send-invite \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H "authorization: Bearer $token" \
    -d '{"recieverEmail": "t@k.com", "clubId": ""}'
```

### Add member
```bash
curl -X PATCH\
http://localhost:3300/api/v1/add-member \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H "authorization: Bearer $token" \
    -d '{"inviteToken": "eee"}'
```

### Remove member
```bash
curl -X DELETE\
http://localhost:3300/api/v1/remove-member/5d7d43e6aa30ec34209024b5/5d7d62b30565881ca06b2e00 \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H "authorization: Bearer $token" \
```
