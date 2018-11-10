import AetherItemController from "../aether-item";

const validArgs = {
  id: 7,
  title: "Look ma!",
  description: "This is a full featured description."
};

describe("AetherItemController", () => {
  let aetherItem;

  describe("has a constructor method that", () => {
    describe("sets the following properties when it receives valid arguments:", () => {
      before(() => {
        aetherItem = new AetherItemController(validArgs);
      });

      it("id", () => {
        expect(aetherItem.id).to.exist;
        expect(aetherItem.id)
          .to.be.a("number")
          .that.equals(validArgs.id);
      });
      it("title", () => {
        expect(aetherItem.title).to.exist;
        expect(aetherItem.title)
          .to.be.a("string")
          .that.equals(validArgs.title);
      });
      it("description", () => {
        expect(aetherItem.description).to.exist;
        expect(aetherItem.description)
          .to.be.a("string")
          .that.equals(validArgs.description);
      });
      it("active", () => {
        expect(aetherItem.active).to.exist;
        expect(aetherItem.active)
          .to.be.a("boolean")
          .that.equals(false);
      });
    });

    describe("throws ArgumentMissingError when", () => {
      it("'id' argument is missing", () => {
        expect(() => new AetherItemController({ ...validArgs, id: undefined }))
          .to.throw()
          .with.property("name", "ArgumentMissingError");
      });
      it("'title' argument is missing", () => {
        expect(
          () => new AetherItemController({ ...validArgs, title: undefined })
        )
          .to.throw()
          .with.property("name", "ArgumentMissingError");
      });
      it("'description' argument is missing", () => {
        expect(
          () =>
            new AetherItemController({ ...validArgs, description: undefined })
        )
          .to.throw()
          .with.property("name", "ArgumentMissingError");
      });
    });

    describe("throws ArgumentTypeError when", () => {
      it("'id' argument receives invalid value", () => {
        expect(() => new AetherItemController({ ...validArgs, id: "hola" }))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
        expect(() => new AetherItemController({ ...validArgs, id: -5 }))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
      it("'title' argument receives invalid value", () => {
        expect(() => new AetherItemController({ ...validArgs, title: 5 }))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
        expect(() => new AetherItemController({ ...validArgs, title: [] }))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
      it("'description' argument receives invalid value", () => {
        expect(() => new AetherItemController({ ...validArgs, description: 5 }))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
        expect(
          () => new AetherItemController({ ...validArgs, description: [] })
        )
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
    });
  });
});
