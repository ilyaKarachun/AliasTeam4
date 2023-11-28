# Node.js-Based Game "Alias" with Chat and Word Checking

### Test post and get requests

Please use this command for starting container:

```
docker compose -f docker-compose.dev.yaml up
```

you can create a new document via POSTMAN:

```
POST
http://localhost:5000/api/v1/document/create
```

you can get all documents via POSTMAN:

```
GET
http://localhost:5000/api/v1/document/alldata
```

## Overview

This document outlines the Alias game, a multiplayer game built with Node.js. It includes chat functionality and a feature to check for similar words.

## Game Description

Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and others guess it. The game includes a chat for players to communicate and a system to check for similar words.

### Objective

Teams try to guess as many words as possible from their teammates' descriptions.

### Turns

Each turn is timed. Describers cannot use the word or its derivatives.

### Scoring

Points are awarded for each correct guess. Similar words are checked for validation.

### End Game

The game concludes after a predetermined number of rounds, with the highest-scoring team winning.

## System Requirements

- **Backend**: Node.js
- **Database**: CouchDB
- **Language**: TypeScript

## Setup and Installation

Details on installing Node.js, setting up the database, cloning the repository, and installing dependencies.

## Architecture

Outline of the server setup, API endpoints, and database schema.

## Core Modules

1. **User Authentication**
   - Login and registration
   - Session management
2. **Game Lobby**
   - Room creation and joining
   - Team selection
3. **Game Mechanics**
   - Word generation
   - Turn management
4. **Chat System**
   - Real-time messaging
   - Chat history
5. **Word Checking**
   - Similarity algorithm
   - Word validation

## APIs

### Endpoint /users

**Register a new user account.**

Request:

```
POST /users/register HTTP/1.1
Content-Type: application/json
Request Body:
{
  "username": "user123",
  "email": "thebestuser@email.com",
  "password": "securepassword123",
}
```

Success Response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "message": "User successfully registered."
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

---

**Login an existing user.**

Request:

```
POST /users/login HTTP/1.1
Content-Type: application/json
Request Body:
{
   "email": "user123@mail.com",
   "password": "securepassword123",
}
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "user": {
        "username": "user",
        "email": "user@mail.com",
        "statistic": [],
        "status": "not active",
        "id": "user-user@mail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidXNlcjExIiwiZW1haWwiOiJ1c2VyMTFAbWFpbC5jb20iLCJzdGF0aXN0aWMiOltdLCJzdGF0dXMiOiJub3QgYWN0aXZlIiwiaWQiOiJ1c2VyLXVzZXIxMUBtYWlsLmNvbSJ9LCJpYXQiOjE3MDExNzQ4MjIsImV4cCI6MTcwMTE4MjAyMn0.snuy70AICIEO-97qgQsRnBjVLcFgzcIrzAjNZRUECaA"
}
```

Client Error:

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json
{
   "error": "Password or Email is not correct!"
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

---

**Get a specific user's profile information by user_id.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `userId`  | number | The unique identifier of the user to fetch. | Yes      |

Request:

```
GET /users/:userId HTTP/1.1
Authorization: Bearer your_access_token
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "username": "user",
    "email": "user@mail.com",
    "statistic": [],
    "status": "not active",
    "id": "user-user@mail.com"
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

---

**Change user's statistics.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `userId`  | number | The unique identifier of the user to fetch. | Yes      |

Request:

```
PUT /users/:userId HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
Request Body:
{
   "statistics": "f634d94e41daee335b4ace6cc4000999"
}
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
   "message": "User statistics was updated successfully."
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

---

**Delete a user account.**

Request:

```
DELETE /users/:userId HTTP/1.1
Authorization: Bearer your_access_token
```

Success Response:

```
HTTP/1.1 204 No Content
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

### Endpoint /games

**Create a new game.**

Request:

```
POST /games HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
Request body (optional, default: teamSize - 3, gameLevel - Easy):
{
    "teamSize": 2,
    "gameLevel": "Medium"
}
```

Success Response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
   "gameID": "32e19d83ef4ebc938c8249ac05000c02"
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

---

**Get information about all games.**

Request:

```
GET /games HTTP/1.1
Authorization: Bearer your_access_token
```

Success Response:
HTTP/1.1 400 OK

```
{
  "0": {
    "id": "3bf63399c59e0f092ecc814ddb000f63",
    "status": "creating",
    "team_size": 4,
    "team_1": ["user-alesya@mail.com"],
    "team_2": [],
    "level": "Easy",
    "chat_id": "",
    "words": [],
    "score": [
      {
        "team1": 0,
        "team2": 0
      }
    ]
  },
  "1": {
    "id": "e2490cf5a7d827f058fb577b3f000dbe",
    "status": "creating",
    "team_size": 3,
    "team_1": ["user-user@mail.com"],
    "team_2": [],
    "level": "Medium",
    "chat_id": "",
    "words": [],
    "score": [
      {
        "team1": 0,
        "team2": 0
      }
    ]
  }
}

```

---

**Get information about the game.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to fetch. | Yes      |

Request:

```
GET /games/:gameId
HTTP/1.1
Authorization: Bearer your_access_token
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "game": {
    "id": "a235a6878408bc81acdd82d84d001f1a",
    "status": "creating",
    "team_size":2,
    "team_1": ["user-alesya@mail.com"],
    "team_2": ["user-user@mail.com"],
    "level": "Medium",
    "chat_id": "",
    "words": [],
    "score": [
      {
        "team1": 0,
        "team2": 0
      }
    ]
  },
  "_rev": "2-0621273a6b9fe50be2fc9155e8160589"
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

---

**Join the game.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to fetch. | Yes      |
| `team`    | number | Number of the game to join (can be 1 or 2)  | Yes      |

Request:

```
PUT /games/:gameId/join?team=2 HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
   "message": "User was successfully added to team 2."
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

---

**Go to team chat.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to fetch. | Yes      |

Request:

```
GET /games/:gameId/chat HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_toke
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
"message": "Player in the chat."
}

```

Server Error:

```

HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
"error": "Something Went Wrong"
}

```

---

**Delete a game.**

Query Parameters:

| Parameter | Type   | Description                                  | Required |
| --------- | ------ | -------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to delete. | Yes      |

Request:

```
DELETE /games/:gameId HTTP/1.1
Authorization: Bearer your_access_token
```

Success Response:

```
HTTP/1.1 204 No Content
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
   "error": "Something Went Wrong"
}
```

### Endpoint /words

**Get a random word.**

Request:

```
GET /words/randomWord HTTP/1.1
Authorization: Bearer your_access_token
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
   "word": "potato"
}
```

Server Error:

```

HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
"error": "Something Went Wrong"
}

```

## Database Schema

#### User Model

| Column name | Data type     | Description              |
| ----------- | ------------- | ------------------------ |
| \_id        | string        | user ID                  |
| type        | "user"        | type for user doc        |
| username    | string        | user name                |
| email       | string        | user email               |
| password    | string        | account password         |
| statistic   | array: string | game ID                  |
| status      | string        | 'active' or 'not active' |

</br>

#### Game Model

| Column name | Data type | Description                           |
| ----------- | --------- | ------------------------------------- |
| \_id        | string    | user ID                               |
| type        | "game"    | type for game doc                     |
| status      | string    | 'creating' or 'playing' or 'finished' |
| team1       | string    | team ID                               |
| team2       | string    | team ID                               |
| won         | string    | team ID that won                      |

</br>

#### Team Model

| Column name  | Data type   | Description       |
| ------------ | ----------- | ----------------- |
| \_id         | string      | team ID           |
| type         | "team"      | type for team doc |
| participants | arr: string | users ID          |
| chatId       | string      | chat ID           |
| words        | arr: string | random words      |
| score        | arr: object | guessing progress |

**Score object**
| Column name | Data type | Description |
|------------|------------|------------|
| word | string | hidden word |
| status | string | 'guessed' or 'not guessed' |
| guessed | string | users ID or 'not' |
</br>

#### Chat Model

| Column name | Data type   | Description       |
| ----------- | ----------- | ----------------- |
| \_id        | string      | chat ID           |
| type        | "chat"      | type for chat doc |
| messages    | arr: object | messages          |

**Messages object**
| Column name | Data type | Description |
|------------|------------|------------|
| timestamp | string | timestamp |
| sender | string | user ID |
| type | string | 'description' or 'message' |
| content | string | message text |
</br>

## User Authorization

User authorization in this system is facilitated through the use of JSON Web Tokens (JWT). Upon successful authentication with the provided user credentials, a JWT is generated using a secure secret key. This token serves as a digital credential that encapsulates user identity information and is used for subsequent authorization.

### JWT Generation

The JWT is generated by encoding user-specific data and signing it with a secret key. The encoded information typically includes user identifiers, roles, or any other necessary data for authentication purposes. This process ensures the integrity and authenticity of the token.

### Token Expiration

To enhance security, each JWT has an expiration time of 2 hours. This means that after this period, the token will no longer be valid, and users will need to re-authenticate to obtain a new token.

### Session Validation

Throughout the user's active session, each HTTP request to the server includes the JWT in the request headers. The server then validates the token to ensure its authenticity and checks if it has expired. If the token is valid and within its expiration period, the request is processed; otherwise, the server responds with an authorization error.

This approach provides a secure and efficient means of managing user sessions, enhancing the overall security of the authentication process.

**Note:** It's crucial to keep the secret key used for JWT signing secure, as it plays a vital role in maintaining the integrity of the tokens.

## Testing

Guide on unit and integration testing.

## Deployment

Instructions for deploying the application.

## Future Enhancements

Suggestions for additional features or improvements.

## FAQ

Common questions and troubleshooting tips.

## Conclusion

Final remarks and encouragement for further exploration.

```

```
