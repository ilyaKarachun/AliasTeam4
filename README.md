# Node.js-Based Game "Alias" with Chat and Word Checking

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
  "username": "user123",
  "password": "securepassword123",
}
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "Login successful. Welcome back!"
}
```

Client Error:

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json
{
  "error": "Wrong Email Or Password"
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
  **???**
}
```

Client Error:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "Invalid user id."
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
  "statistics": **???**
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
Request Body:
{
  user_id: "1"
}
```

Success Response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "message": "Game successfully created."
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
[
  {
    "gameID": "1",
    "status": "creating",
    "team1": {
      "participants": ["1", "2"],
      "chatID": "123",
      "words": [],
      "score": []
    },
    "team2": {
      "participants": [],
      "chatID": "124",
      "words": [],
      "score": []
    }
  },
  {
    "gameID": "2",
    "status": "playing",
    "team1": {
      "participants": ["3", "4", "8"],
      "chatID": "856",
      "words": ["potato", "watermelon", "cat"],
      "score": []
    },
    "team2": {
      "participants": ["10", "21", "14"],
      "chatID": "858",
      "words": ["potato", "watermelon", "cat"],
      "score": []
    }
  }
]

```

---

**Get information about the winner in the game.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to fetch. | Yes      |

Request:

```
GET /games/:gameId/winner HTTP/1.1
Authorization: Bearer your_access_token
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Team number ${number} is the winner! Congradulations!!!"
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

Request:

```
PUT /games/:gameId/join HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
Request Body:
{
  userId: "23"
}
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "Player joined to the game successfully."
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
Authorization: Bearer your_access_token
Request Body:
{
  chatId: "23"
}
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

**Add a new word.**

Request:

```
POST /words HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
Request Body:
{
  "word": "newWord"
}
```

Success Response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "message": "A new word was added."
}
```

Client Error:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "Provided word already exists in words scope."
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

---

**Update a word by id.**

Query Parameters:

| Parameter | Type   | Description                  | Required |
| --------- | ------ | ---------------------------- | -------- |
| `wordId`  | number | The id of the word to update | Yes      |

Request:

```
PUT /words/:wordId HTTP/1.1
Content-Type: application/json
Authorization: Bearer your_access_token
Request body:
{
  "word": "potato"
}
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "Your word was updated successfully."
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

**Delete a word.**

Query Parameters:

| Parameter | Type   | Description                  | Required |
| --------- | ------ | ---------------------------- | -------- |
| `wordId`  | number | The id of the word to delete | Yes      |

Request:

```
DELETE /words/:word HTTP/1.1
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

## Database Schema

- **User Model**: Username, password, stats.
- **Game Model**: Players, scores, words.
- **Chat Model**: Messages, timestamps, users.

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
