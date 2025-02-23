# Test task

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
- Node.js (optional, for local development without Docker).

## Setup

1. **Copy the environment file**:
   Copy the `.env.example` template to a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration if needed (e.g., ports, database credentials).

   Example `.env`:
   ```
   PORT=5000
   POSTGRES_PORT=5433
   POSTGRES_HOST=postgres
   POSTGRES_DATABASE=test_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   ```

2. **Run the application**:
   Start the backend and PostgreSQL using Docker Compose:
   ```bash
   docker-compose up --build
   ```
   This will:
    - Build the backend image.
    - Start a PostgreSQL container.
    - Run the backend on the port specified in `.env` (default: `5000`).

3. **Access the backend**:
   Use the port specified in `.env` (e.g., `http://localhost:5000`) to interact with the API.

## API Endpoints

All endpoints are prefixed with `/api/v1/treatments/`.

### 1. Get Appeals
- **Method**: `GET`
- **Path**: `/api/v1/treatments/`
- **Query Parameters**:
    - `date`: Filter by a specific date (e.g., `"2025-02-24"`).
    - `startDate` and `endDate`: Filter by a date range (e.g., `"startDate": "2025-02-24"`, `"endDate": "2025-02-24"`).
- **Example**:
  ```
  GET http://localhost:5000/api/v1/treatments/?date=2025-02-24
  GET http://localhost:5000/api/v1/treatments/?startDate=2025-02-24&endDate=2025-02-24
  ```
- **Response**:
  ```json
  [
    {
      "id": "number",
      "subject": "string",
      "text": "string",
      "status": "new",
      "created_at": "2025-02-24T00:00:00.000Z",
      "problem_solving": "string|null",
      "cancellation_reason": "string|null"
    }
  ]
  ```

### 2. Create Appeal
- **Method**: `POST`
- **Path**: `/api/v1/treatments/`
- **Body**: JSON with `text` and `topic` (mapped to `subject` internally).
  ```json
  {
    "text": "string",
    "topic": "string"
  }
  ```
- **Example**:
  ```
  POST http://localhost:5000/api/v1/treatments/
  Content-Type: application/json
  {"text": "Need help", "topic": "Support"}
  ```
- **Response**:
  ```json
  {
    "id": "number",
    "subject": "Support",
    "text": "Need help",
    "status": "new",
    "problem_solving": "string|null",
    "cancellation_reason": "string|null",
    "created_at": "2025-02-24T00:00:00.000Z"
  }
  ```

### 3. Cancel All In-Progress Appeals
- **Method**: `PATCH`
- **Path**: `/api/v1/treatments/cancel-all-in-progress`
- **Description**: Changes the status of all appeals with `inProgress` to `cancelled` and sets a default cancellation reason.
- **Example**:
  ```
  PATCH http://localhost:5000/api/v1/treatments/cancel-all-in-progress
  ```
- **Response**:
  ```json
  {
    "message": "Cancelled 3 appeals"
  }
  ```

### 4. Take Appeal In Progress
- **Method**: `PATCH`
- **Path**: `/api/v1/treatments/:treatment_id/in-progress`
- **Description**: Changes the status of the specified appeal to `inProgress`.
- **Example**:
  ```
  PATCH http://localhost:5000/api/v1/treatments/:treatment_id/in-progress
  ```
- **Response**:
  ```json
  {
    "id": "number",
    "subject": "Support",
    "text": "Need help",
    "status": "inProgress",
    "created_at": "2025-02-24T00:00:00.000Z",
    "problem_solving": "string|null",
    "cancellation_reason": "string|null"
  }
  ```

### 5. Complete Treatment
- **Method**: `PATCH`
- **Path**: `/api/v1/treatments/:treatment_id/completed`
- **Body**: JSON with `problem_solving` (mapped to `resolution`).
  ```json
  {
    "problem_solving": "resolution"
  }
  ```
- **Example**:
  ```
  PATCH http://localhost:5000/api/v1/treatments/:treatment_id/completed
  Content-Type: application/json
  {"problem_solving": "Issue resolved"}
  ```
- **Response**:
  ```json
  {
    "id": "number",
    "subject": "Support",
    "text": "Need help",
    "status": "completed",

    "problem_solving": "string|null",
    "cancellation_reason": "string|null",
    "created_at": "2025-02-24T00:00:00.000Z"
  }
  ```

### 6. Cancel Treatment
- **Method**: `PATCH`
- **Path**: `/api/v1/treatments/:treatment_id/cancel`
- **Body**: JSON with `cancellation_reason`.
  ```json
  {
    "cancellation_reason": "reason"
  }
  ```
- **Example**:
  ```
  PATCH http://localhost:5000/api/v1/treatments/:treatment_id/cancel
  Content-Type: application/json
  {"cancellation_reason": "Not needed anymore"}
  ```
- **Response**:
  ```json
  {
    "id": "number",
    "subject": "Support",
    "text": "Need help",
    "status": "cancelled",
    "problem_solving": "string|null",
    "cancellation_reason": "string|null",
    "created_at": "2025-02-24T00:00:00.000Z"
  }
  ```

## Development

- To run tests:
  ```bash
  npm run test
  ```
- To run locally without Docker:
  ```bash
  npm install
  npm run dev
  ```

## Notes
- The backend uses PostgreSQL as the database, managed via TypeORM.
- Ensure PostgreSQL is running and configured correctly in `.env` before starting the app.

---
