# Node.js-Based Game "Alias" with Chat and Word Checking

## Content:

- [Overview](#overview)
- [Game Description](#game-description)
  - [Objective](#objective)
  - [Turns](#turns)
  - [Scoring](#scoring)
  - [End Game](#end-game)
- [System Requirements](#system-requirements)
- [Setup and Installation](#setup)
- [Core Modules](#core-modules)
- [APIs](#apis)
  - [Endpoint /users](#endpoint-users)
  - [Endpoint /games](#endpoint-games)
  - [Socket connection](#socket-connection)
- [Database Schema](#database-schema)
  - [User Model](#user-model)
  - [Game Model](#game-model)
- [User Authorization](#user-authorization)
  - [JWT Generation](#jwt-generation)
  - [Token Expiration](#token-expiration)
  - [Session Validation](#session-validation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [FAQ](#faq)
- [Conclusion](#conclusion-back-to-content)

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
- **Docker**

## Setup and Installation

**Installation Steps:**

Clone the repository using the following link:

```
git clone https://github.com/ilyaKarachun/AliasTeam4/tree/main
```

Run the following command to install dependencies:

```
npm install
```

Launch Docker using the command:

```
docker-compose -f docker-compose.dev.yaml up -d
```

The application's base URL is:

```
http://localhost:3000/api/v1/
```

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

<details>

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

</details>

### Endpoint /games

<details>

**Create a new game.**

Request:

```
POST /games HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
Request body (optional, default: teamSize - 3, gameLevel - Easy):
{
    "name": "Little Dinosaurs",
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
    "name": "Potatos",
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
    "name": "Jezhozwiezi",
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

    "name": "Jezhozwiezi",
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

**Validate description of the message.**

Request:

```
PUT /games/game/description HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
Request body:
{
   "gameId": "a235a6878408bc81acdd82d84d001f1a",
   "description": "description provided by iser"
}
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
   "status": "success",
   "data":
    {
      "message": "Words had checked",
      "words": [],
      "wrong": false,
   },
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

</details>

### Socket connection

<details>

**Join team chat.**

To interact with the in-game chat, a WebSocket connection is used. To connect to the socket, use the following URL: ws://localhost:3000/api/v1/games/:gameId/chat

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to fetch. | Yes      |

Request:

```
/games/:gameId/chat
Authorization: Bearer your_access_toke
```

Success:

```
Connected to ws://localhost:3000/api/v1/games/f634d94e41daee335b4ace6cc4000999/chat
Welcome to the game! You are team_1 member
```

Error:

```
Disconnected from ws://localhost:3000/api/v1/games/:gameId/chat
```

</details>

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

| Column name    | Data type   | Description                           |
| -------------- | ----------- | ------------------------------------- |
| \_id           | string      | user ID                               |
| type           | "game"      | type for game doc                     |
| status         | string      | 'creating' or 'playing' or 'finished' |
| name           | string      | game's name                           |
| team_size      | number      | amount of participants in team        |
| team1          | arr: string | user's ID of team 1                   |
| team2          | arr: string | user's ID of team 2                   |
| level          | string      | 'Easy' or 'Medium' or 'Hard'          |
| chat_id        | string      | chat ID                               |
| words          | arr: string | words that was played in the gane     |
| score          | object      | score object                          |
| won            | string      | team ID that won                      |
| messageHistory | arr: object | meesages in the game chat             |

**Score object**

| Column name | Data type | Description        |
| ----------- | --------- | ------------------ |
| team_1      | number    | score for the game |
| team_2      | number    | score for the game |

**Messages object**

| Column name | Data type | Description  |
| ----------- | --------- | ------------ |
| timestamp   | string    | timestamp    |
| sender      | string    | user ID      |
| content     | string    | message text |

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

To run tests, execute `npm test`, and for coverage analysis, use `npm test-coverage`.
Ensure Docker is running, with the server container disabled and only the database container enabled. This setup allows tests to interact with the database while maintaining server isolation. These commands integrate seamlessly into your development workflow, ensuring code reliability and overall application quality.

## Deployment

The application has been deployed using AWS infrastructure.

```
http://34.207.240.236:3000/
```

## Future Enhancements

**Suggestions for Additional Features or Improvements:**

- Enhanced Visual Design: Improve the overall aesthetic of the application, with a specific focus on refining the game chat interface for a more user-friendly experience.

- Visible Timer: Introduce a visible timer during gameplay to enhance user awareness of time constraints, providing a more dynamic and engaging gaming environment.

- Role Clarity: Provide clearer communication to players about their assigned roles within the game, ensuring a better understanding of their responsibilities and contributions.

- Database Integration for Game Words: Implement the capability to store game words in a database, allowing for efficient retrieval and management. This feature enhances flexibility and scalability in handling the game's content.

## FAQ

Common questions and troubleshooting tips.

## Conclusion [(Back to content)](#content)

Concluding the Alias game creation journey, every challenge has been a stepping stone in your growth as a developer. Stay curious, be resilient, and keep innovating. Your suggestions for improvement are always welcome, and we look forward to enhancing the gaming experience. Happy coding, and may your gaming adventures be filled with joy!
