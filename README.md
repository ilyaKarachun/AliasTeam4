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

**Delete a user account.**

Request:

```
DELETE /users/:userId HTTP/1.1
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

### Endpoint /games <a name="endpoints-games"></a>

**Create a new game.**

Request:

```
POST /games HTTP/1.1
Content-Type: application/json
Request Body:
{
  **???**
}
```

Success Response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "game_id": game_id
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

**Retrieve information about all games.**

Request:

```
GET /games HTTP/1.1
```

Success Response:
HTTP/1.1 400 OK

```
[
  **???**
]
```

---

**Get an information about winner in the game.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to fetch. | Yes      |

Request:

```
GET /games/:gameId/winner HTTP/1.1
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "${teamWinner} is the winner! Congradulations!!!"
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
Request Body:
{
  **???**
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

**Delete a game.**

Query Parameters:

| Parameter | Type   | Description                                  | Required |
| --------- | ------ | -------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to delete. | Yes      |

Request:

```
DELETE /games/:gameId HTTP/1.1
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

| Parameter | Type   | Description                   | Required |
| --------- | ------ | ----------------------------- | -------- |
| `wordId`  | number | The id of the word to delete  | Yes      |


Request:

```
GET /words/randomWord HTTP/1.1
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

**Delete a word.**

Query Parameters:



Request:

```
DELETE /words/:word HTTP/1.1
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

### Endpoint /chats <a name="endpoints-chats"></a>

**Create new chat.**

Request:

```
POST /chats HTTP/1.1
Content-Type: application/json
Request Body:
{
  **???**
}
```

Success Response:

```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "chat_id": chat_id
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

**Get a specific chat by chat_id.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `chatId`  | number | The unique identifier of the chat to fetch. | Yes      |

Request:

```
GET /chats/:chatId HTTP/1.1
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[**???**]
```

Client Error:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "Invalid chat id."
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

**Get all messages in a chat**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `chatId`  | number | The unique identifier of the chat to fetch. | Yes      |

Request:

```
GET /chats/:chatId/messages HTTP/1.1
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[**???**]
```

Client Error:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "Invalid chat id."
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

**Delete a chat.**

Query Parameters:

| Parameter | Type   | Description                                  | Required |
| --------- | ------ | -------------------------------------------- | -------- |
| `chatId`  | number | The unique identifier of the chat to delete. | Yes      |

Request:

```
DELETE /chats/:chatId HTTP/1.1
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

## Security
Overview of implemented security measures.

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
