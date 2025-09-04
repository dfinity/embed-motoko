const initialCode = `
// A simple Motoko smart contract.

persistent actor Main {
  public query func hello() : async Text {
    "Hello, world!"
  };
};

await Main.hello();
`.trim();

export default initialCode;
