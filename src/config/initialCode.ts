const motoko = `
// A simple Motoko smart contract.

actor Main {
  public query func hello() : async Text {
    "Hello, world!"
  };
};

// await Main.hello();
`.trim();

const kusanagi = `
/* A community-created Motoko dialect:
  (https://github.com/DanielXMoore/kusanagi) */

actor Main
  public query func hello() : async Text
    "Hello, world!"

// await Main.hello()
`.trim();

const initialCode = {
  motoko,
  kusanagi,
};

export default initialCode;
