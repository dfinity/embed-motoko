const initialCode = `
// A simple Motoko smart contract.

actor Main {
  public func hello() : async Text {
    "Hello, world!"
  };
};

// await Main.hello();
`;

export default initialCode;
