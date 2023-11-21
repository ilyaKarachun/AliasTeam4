## Endpoint /users

**Register a new user account.**
POST /users/register HTTP/1.1

**Login an existing user.**
POST /users/login HTTP/1.1

**Get user by user_id.**
GET /users/:userId HTTP/1.1

**Change user's statistics.**
PUT /users/:userId HTTP/1.1

**Delete a user account.**
DELETE /users/:userId HTTP/1.1

## Endpoint /games

**Create new game.**
POST /games HTTP/1.1

<!-- as game created - for each team chat is created  -->

**Get information about all games.**
GET /games HTTP/1.1

**Get information about the winner in the game.**
GET /games/:gameId/winner HTTP/1.1

**Join the game.**
GET /games/:gameId/:chatId HTTP/1.1

<!-- when the user joins the game, he appears in the team’s chat  -->

**Get an information about winner in the game.**
GET /games/:gameId/winner HTTP/1.1

**Delete a game.**
DELETE /games/:gameId HTTP/1.1

## Endpoint /words

**Get a random word.**
GET /words/randomWord HTTP/1.1

**Add a new word.**
POST /words HTTP/1.1

**Update a word.**
PUT /words/:wordId HTTP/1.1

**Delete a word.**
DELETE /words/:wordId HTTP/1.1
