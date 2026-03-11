# 🎬 CineVault API

Welcome to **CineVault API**, a backend application built to manage a movie catalog. This API allows you to register, list, retrieve, and delete movie records in a simple and efficient way.

The project was made for learning about backend development with Express and Prisma.

## 🚀 Features

- 📋 List all movies
- 🔍 Retrieve a movie by ID
- 🆕 Create a new movie
- ❌ Delete an existing movie

## 📄 Documentation

Interactive API documentation is available via Swagger, making it easy to explore and test the endpoints.

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Setup

**1. Clone the repository**

```bash
git clone https://github.com/auri-gabriel/cinevault-api.git
cd cinevault-api
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Copy the example file and adjust the values as needed:

```bash
cp .env.example .env
```

**4. Start the database**

```bash
docker compose up -d
```

**5. Generate the Prisma client**

```bash
npx prisma generate
```

**6. Run database migrations**

```bash
npx prisma migrate deploy
```

**7. Start the server**

```bash
npm run start
```

The API will be available at `http://localhost:3000`.

The interactive Swagger documentation will be available at `http://localhost:3000/api-docs`.
