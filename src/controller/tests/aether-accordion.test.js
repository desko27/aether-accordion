import AetherAccordionController from "../aether-accordion";
import AetherItemController from "../aether-item";

const validArgs = {
  entries: [
    {
      id: 0,
      title: "Section #1",
      description: "Section #1 contents..."
    },
    {
      id: 1,
      title: "Section #2",
      description: "Section #2 contents..."
    },
    {
      id: 2,
      title: "Section #3",
      description: "Section #3 contents..."
    }
  ]
};

const defaultProperties = {
  activeId: null
};

describe("AetherAccordionController", () => {
  const validAetherAccordion = new AetherAccordionController(validArgs);
  // let aetherAccordion;

  describe("has a constructor method that", () => {
    describe("sets the following properties when it receives valid arguments:", () => {
      it("entries", () => {
        expect(validAetherAccordion.entries).to.exist;
        expect(validAetherAccordion.entries)
          .to.be.an("array")
          .that.deep.equals(
            validArgs.entries.map(entry => new AetherItemController(entry))
          );
      });
      it("activeId", () => {
        expect(validAetherAccordion.activeId).to.equal(
          defaultProperties.activeId
        );
      });
    });

    describe("throws MissingArgumentError when", () => {
      it("'entries' argument is missing", () => {
        expect(
          () =>
            new AetherAccordionController({ ...validArgs, entries: undefined })
        )
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
    });
  });

  describe("has a getActiveId method that", () => {
    it("returns the activeId property", () =>
      expect(validAetherAccordion.getActiveId()).to.equal(
        defaultProperties.activeId
      ));
  });

  describe("has a getEntry method that", () => {
    it("throws MissingArgumentError when id is missing", () => {
      expect(() => validAetherAccordion.getEntry())
        .to.throw()
        .with.property("name", "MissingArgumentError");
    });
    it("throws ArgumentTypeError when id is invalid", () => {
      const invalidValues = ["not a number", -1, -253, true, null, [], {}];
      invalidValues.forEach(value => {
        expect(() => validAetherAccordion.getEntry(value))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
    });
    it("returns null if no entry is found with provided id", () =>
      expect(validAetherAccordion.getEntry(15)).to.be.null);
    it("returns the specified entry if exists", () => {
      expect(validAetherAccordion.getEntry(1)).to.deep.equal(
        new AetherItemController(
          validArgs.entries.find(entry => entry.id === 1)
        )
      );
    });
  });

  describe("has a getEntryTitle method that", () => {
    it("throws MissingArgumentError when id is missing", () => {
      expect(() => validAetherAccordion.getEntryTitle())
        .to.throw()
        .with.property("name", "MissingArgumentError");
    });
    it("throws ArgumentTypeError when id is invalid", () => {
      const invalidValues = ["not a number", -1, -253, true, null, [], {}];
      invalidValues.forEach(value => {
        expect(() => validAetherAccordion.getEntryTitle(value))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
    });
    it("returns null if no entry is found with provided id", () =>
      expect(validAetherAccordion.getEntryTitle(15)).to.be.null);
    it("returns the specified entry's title if entry exists", () => {
      expect(validAetherAccordion.getEntryTitle(1)).to.equal(
        validArgs.entries.find(entry => entry.id === 1).title
      );
    });
  });

  describe("has a getEntryDescription method that", () => {
    it("throws MissingArgumentError when id is missing", () => {
      expect(() => validAetherAccordion.getEntryDescription())
        .to.throw()
        .with.property("name", "MissingArgumentError");
    });
    it("throws ArgumentTypeError when id is invalid", () => {
      const invalidValues = ["not a number", -1, -253, true, null, [], {}];
      invalidValues.forEach(value => {
        expect(() => validAetherAccordion.getEntryDescription(value))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
    });
    it("returns null if no entry is found with provided id", () =>
      expect(validAetherAccordion.getEntryDescription(15)).to.be.null);
    it("returns the specified entry's description if entry exists", () => {
      expect(validAetherAccordion.getEntryDescription(1)).to.equal(
        validArgs.entries.find(entry => entry.id === 1).description
      );
    });
  });
});
