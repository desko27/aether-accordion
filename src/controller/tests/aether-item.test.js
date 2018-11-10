import AetherItemController from "../aether-item";

describe("AetherItemController", () => {
  it("should load just fine", () => {
    const c = new AetherItemController();
    expect(c.title).to.equal("test");
  });
});
