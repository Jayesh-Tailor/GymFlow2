# GymFlow API

This Spring Boot service implements the first member-management API slice. It is intentionally separate from the existing Vite frontend.

## Run

Use Java 21 or newer and Maven. Start PostgreSQL, then set the connection and JWT issuer values:

```sh
export DATABASE_USERNAME="<your-postgres-username>"
export DATABASE_PASSWORD="<your-postgres-password>"
export JWT_ISSUER_URI="<issuer-url-from-your-auth-provider>"
# Optional; defaults to jdbc:postgresql://localhost:5432/gymflow
export DATABASE_URL="jdbc:postgresql://localhost:5432/gymflow"

mvn spring-boot:run
```

Flyway applies schema migrations at startup; Hibernate validates rather than creates the schema. `JWT_ISSUER_URI` must be the trusted issuer that issues the API's bearer tokens. Setting PostgreSQL credentials does not configure JWT authentication. The API requires a signed token containing a UUID `gym_id` claim and takes the gym scope only from that verified claim, never from request data.

The current frontend uses mock data and does not provide an issuer or tokens. Use the issuer from your auth provider or integrate one before calling protected routes.

## API preview

Once the backend starts, open Swagger UI at `http://localhost:8080/swagger-ui/index.html`. The page documents `POST /api/members` and `GET /api/members`. The docs are public, but member operations still require a valid bearer JWT; use Swagger's **Authorize** button with a token from the configured issuer.

## Contracts

Member routes require `Authorization: Bearer <token>`.

### `POST /api/members`

Creates a member in the authenticated gym and returns `201 Created` with a member object.

```json
{
  "name": "Devika Rao",
  "email": "devika.rao@email.com",
  "phone": "+91 98765 00000",
  "plan": "Elite Annual",
  "expiresAt": "2027-10-27"
}
```

Required fields: `name` (nonblank, up to 80 chars), `email` (valid email, up to 120 chars), `phone` (nonblank, up to 24 chars), `plan` (`Flex Monthly`, `Strength Plus`, or `Elite Annual`), and `expiresAt` (today or later, ISO date). Gym ID is not accepted as an authorization input.

### `GET /api/members`

Returns an array of members belonging only to the authenticated gym, ordered by join date descending.

Member responses contain `id` (UUID), `name`, `email`, `phone`, `plan`, `joinedAt`, `expiresAt`, `status` (`Active`, `Expiring soon`, or `Expired`), `initials`, and `color`.

### Errors

Errors use a consistent JSON shape: `timestamp`, `status`, `error`, `message`, and `fieldErrors`. Validation and malformed bodies return `400`; missing/invalid authentication or an absent/invalid `gym_id` returns `401`; access denial returns `403`.

Run tests with `mvn test`.
