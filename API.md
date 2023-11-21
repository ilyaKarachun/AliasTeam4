# APIs

~~Documentation for each API endpoint including authentication, game control, and chat functionalities.~~

## Content: <a name="content"></a>

- [Endpoint /users](#endpoint-users)
- [Endpoint /games](#endpoint-games)
- [Endpoint /words](#endpoint-words)
- [Endpoint /chats](#endpoint-chats)
 

## Endpoint /users <a name="endpoints-users"></a>

**Register a new user account.**

Request:

```
POST /users/register HTTP/1.1
Content-Type: application/json
Request Body:
{
  "username": "user123",
  "password": "securepassword123",
  "email": "thebestuser@email.com",
  **??**
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

Client Error:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "Password must be at least 8 characters long and include numbers. "
}
```

Client Error:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "User with such username already exists."
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
  "error": error.message
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
  "error": "Invalid username."
}
```

Client Error:

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json
{
  "error": "Invalid password."
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
  "error": error.message
}
```

---

**Get all users profile information.**

Request:

```
GET /users HTTP/1.1
```

Success Response:
HTTP/1.1 400 OK

```
[
  **???**
]
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
  "error": error.message
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
  "error": error.message
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
  "error": error.message
}
```

## Endpoint /games <a name="endpoints-games"></a>

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
  "error": error.message
}
```

---

**Retrieve all games information.**

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
  "error": error.message
}
```

---

**Change parameter ???.**

Query Parameters:

| Parameter | Type   | Description                                 | Required |
| --------- | ------ | ------------------------------------------- | -------- |
| `gameId`  | number | The unique identifier of the game to fetch. | Yes      |

Request:

```
PUT /games/:gameId HTTP/1.1
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
  "message": "??? Parameter was updated successfully."
}
```

Server Error:

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
{
  "error": error.message
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
  "error": error.message
}
```

## Endpoint /words <a name="endpoints-words"></a>

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
  "error": error.message
}
```

---

**Get all words.**

Request:

```
GET /words HTTP/1.1
```

Success Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
[
  "word1",
  "word2",
  "word3"
]
```

---

**Get a random word.**

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
  "error": error.message
}
```

---

**Delete a word.**

Query Parameters:

| Parameter | Type   | Description         | Required |
| --------- | ------ | ------------------- | -------- |
| `word`    | string | The word to delete. | Yes      |

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
  "error": error.message
}
```

## Endpoint /chats <a name="endpoints-chats"></a>

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
  "error": error.message
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
  "error": error.message
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
  "error": error.message
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
  "error": error.message
}
```
---

[⬆ Go Up ⬆](#content)