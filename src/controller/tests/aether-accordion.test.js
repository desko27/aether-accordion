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
});
