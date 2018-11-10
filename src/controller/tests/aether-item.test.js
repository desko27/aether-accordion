import AetherItemController from "../aether-item";

const validArgs = {
  id: 7,
  title: "Look ma!",
  description: "This is a full featured description."
};

describe("AetherItemController", () => {
  let aetherItem;
  const validAetherItem = new AetherItemController(validArgs);

  describe("has a constructor method that", () => {
    describe("sets the following properties when it receives valid arguments:", () => {
      it("id", () => {
        expect(validAetherItem.id).to.exist;
        expect(validAetherItem.id)
          .to.be.a("number")
          .that.equals(validArgs.id);
      });
      it("title", () => {
        expect(validAetherItem.title).to.exist;
        expect(validAetherItem.title)
          .to.be.a("string")
          .that.equals(validArgs.title);
      });
      it("description", () => {
        expect(validAetherItem.description).to.exist;
        expect(validAetherItem.description)
          .to.be.a("string")
          .that.equals(validArgs.description);
      });
      it("active", () => {
        expect(validAetherItem.active).to.exist;
        expect(validAetherItem.active)
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
      it("'id' argument receives invalid values", () => {
        const invalidValues = ["not a number", -1, -253, true, null, [], {}];
        invalidValues.forEach(value => {
          expect(() => new AetherItemController({ ...validArgs, id: value }))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
      it("'title' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}];
        invalidValues.forEach(value => {
          expect(() => new AetherItemController({ ...validArgs, title: value }))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
      it("'description' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}];
        invalidValues.forEach(value => {
          expect(
            () => new AetherItemController({ ...validArgs, description: value })
          )
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
    });
  });

  describe("has a getId method that", () => {
    before(() => {
      aetherItem = new AetherItemController({ ...validArgs, id: 15 });
    });

    it("returns the id property", () => expect(aetherItem.getId()).equals(15));
  });
});
