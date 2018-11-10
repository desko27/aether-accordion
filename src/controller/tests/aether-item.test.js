import AetherItemController from "../aether-item";

const validArgs = {
  id: 7,
  title: "Look ma!",
  description: "This is a full featured description."
};

const defaultProperties = {
  active: false
};

describe("AetherItemController", () => {
  const validAetherItem = new AetherItemController(validArgs);
  // let aetherItem;

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
          .that.equals(defaultProperties.active);
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
    it("returns the id property", () =>
      expect(validAetherItem.getId()).equals(validArgs.id));
  });

  describe("has a getTitle method that", () => {
    it("returns the title property", () =>
      expect(validAetherItem.getTitle()).equals(validArgs.title));
  });

  describe("has a getDescription method that", () => {
    it("returns the description property", () =>
      expect(validAetherItem.getDescription()).equals(validArgs.description));
  });

  describe("has an isActive method that", () => {
    it("returns the active property", () =>
      expect(validAetherItem.isActive()).equals(defaultProperties.active));
  });

  describe("has a setTitle method that", () => {
    it("throws ArgumentMissingError when value is missing");
    it("throws ArgumentTypeError when value is invalid");
    it("sets received value as the title");
    it("runs received function to set the returning value as the title");
    it("received function is provided with the current value of title");
  });

  describe("has a setDescription method that", () => {
    it("throws ArgumentMissingError when value is missing");
    it("throws ArgumentTypeError when value is invalid");
    it("sets received value as the description");
    it("runs received function to set the returning value as the description");
    it("received function is provided with the current value of description");
  });

  describe("has an activate method that", () => {
    it("sets active property to true");
    it("returns true if the property has been changed");
    it("returns false if the property remains the same");
  });

  describe("has a deactivate method that", () => {
    it("sets active property to false");
    it("returns true if the property has been changed");
    it("returns false if the property remains the same");
  });
});
