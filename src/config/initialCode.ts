const initialCode = {};

initialCode['motoko'] = `
// A simple Motoko smart contract.

actor Main {
  public query func hello() : async Text {
    "Hello, world!"
  };
};

// await Main.hello();
`.trim();

initialCode['kusanagi'] = `
/* A community-created Motoko dialect:
  (https://github.com/DanielXMoore/kusanagi) */

actor Main
  public query func hello() : async Text
    "Hello, world!"

// await Main.hello()
`.trim();

export default initialCode;
