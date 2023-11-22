/*hidden - hidden word for guessing, guess: message content*/

const hiddenWordRecognition = (hidden: string, guess: string) => {
  const hiddenLower = hidden.toLowerCase();
  const guessLower = guess.toLowerCase();

  if (hiddenLower === guessLower) {
    return true;
  } else {
    return false;
  }
};
export default hiddenWordRecognition;
