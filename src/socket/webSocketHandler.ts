const clients = {};
const channels = {};

const userState = {};
const messageHistory = {};
const teamLimits = {
  team1: 0,
  team2: 0,
};

export const handleWebSocketConnection = (ws, req) => {
  const channel = req.params.channel;
  const userId = req.params.userId;
  const team = req.params.team;
  console.log(userState);
  console.log(
    `"CONNECTION ESTABLISHED for channel ${channel}, user with id = ${userId}, command: ${team}"`,
  );

  if (userState[userId]) {
    console.log(
      `The user with id = ${userId} is already saved. Connecting to the previous state.`,
    );
    ws.send(JSON.stringify(`${userId} reconnected`));

    if (messageHistory[channel]) {
      for (const message of messageHistory[channel]) {
        ws.send(JSON.stringify(message));
      }
    }
  } else {
    if (teamLimits[team] < 3) {
      clients[userId] = ws;
      userState[userId] = {
        ws,
        channel,
        team,
      };

      if (messageHistory[channel]) {
        for (const message of messageHistory[channel]) {
          ws.send(JSON.stringify(message));
        }
      }

      if (!channels[channel]) {
        channels[channel] = [];
      }
      channels[channel].push(ws);
      teamLimits[team]++;
      for (const client of channels[channel]) {
        client.send(JSON.stringify(`${userId} joined`));
      }

      console.log(`${userId} has joined the team ${team}.`);
    } else {
      // decline connection because the command is already filled.
      ws.send(
        JSON.stringify({
          error: 'The team is full. Please choose another team.',
        }),
      );
      ws.close();
      console.log(
        `Connection rejected for user ${userId} to team ${team}. The team is full.`,
      );
    }
  }

  ws.on('message', (msg) => {
    try {
      const { command, payload } = JSON.parse(msg);
      const { username, message, team } = payload;
      switch (command) {
        case 'chatMessage':
          if (!messageHistory[channel]) {
            messageHistory[channel] = [];
          }
          messageHistory[channel].push(`${team}---> ${username} : ${message}`);

          for (const client of channels[channel]) {
            client.send(JSON.stringify(`${team}---> ${username} : ${message}`));
          }
          console.log({ command, payload });
          break;

        default:
          console.log('aaa');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  ws.on('close', () => {
    // Removing a closed connection from the channel and updating the team counter
    if (channels[channel]) {
      const index = channels[channel].indexOf(ws);
      console.log(index, 'index');
      if (index !== -1) {
        channels[channel].splice(index, 1);
      }
    }

    if (userState[userId]) {
      const userTeam = userState[userId].team;
      if (teamLimits[userTeam] > 0) {
        teamLimits[userTeam]--;
      }

      userState[userId].ws = null;
      console.log(`The user with id ${userId} has disconnected.`);
    }
  });
};
