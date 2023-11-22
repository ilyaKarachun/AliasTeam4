class GameService {
  //   gameRepository: any;
  //   constructor(gameRepository: any) {
  //     this.gameRepository = gameRepository;
  //   }

  async createGame({ userId }: { userId: string }) {
    let result = { message: 'we happily came to this place' };

    // {type: chat, messages [{}]}
    // const chatId = await chatRepository.createChat()

    // {type: "team", participants: [userId], chatId: chatId, words [], score: []}
    // const await teamRepository.createTeam(userId);

    // {type: "game", status:"creating", team1: teamID, team2: teamID, won: null}
    // const result = await gameRepository.createGame(userId)

    return result; // result = gameId
  }
}

export const gameService = new GameService();
