import AetherAccordionController from "../aether-accordion";
import AetherItemController from "../aether-item";
import { validateEntry } from "../aether-accordion/aether-accordion.validations";

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

const validEntry = {
  id: 3,
  title: "Section #4",
  description: "Section #4 contents..."
};

const defaultProperties = {
  activeId: null
};

describe("AetherAccordionController", () => {
  const validAetherAccordion = new AetherAccordionController(validArgs);
  let aetherAccordion;

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
      it("all arguments are missing", () => {
        expect(() => new AetherAccordionController())
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
      it("'entries' argument is missing", () => {
        expect(
          () =>
            new AetherAccordionController({ ...validArgs, entries: undefined })
        )
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
    });

    describe("throws ArgumentTypeError when", () => {
      it("'entries' argument receives invalid values", () => {
        const { title, ...entryWithoutTitle } = validEntry;
        const { description, ...entryWithoutDescription } = validEntry;
        const { id, ...entryWithoutId } = validEntry;
        const invalidValues = [
          "a string",
          12,
          -253,
          true,
          false,
          null,
          {},
          [entryWithoutTitle],
          [entryWithoutDescription],
          [entryWithoutId],
          [{ ...validEntry, id: "invalid id" }]
        ];
        invalidValues.forEach(value => {
          expect(
            () =>
              new AetherAccordionController({ ...validArgs, entries: value })
          )
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
    });

    describe("throws ExistingIdError when", () => {
      it("'entries' argument receives duplicated ids", () => {
        const entries = [...validArgs.entries, { ...validEntry, id: 1 }];
        expect(() => new AetherAccordionController({ ...validArgs, entries }))
          .to.throw()
          .with.property("name", "ExistingIdError");
      });
    });

    describe("throws up any other error when", () => {
      it("an unknown error is caught by the entry validator", () => {
        const AetherItemStub = sinon
          .stub(AetherItemController, "constructor")
          .throws(new Error("Unknown error"));

        expect(() => validateEntry(validEntry, AetherItemStub)).to.throw(
          "Unknown error"
        );
      });
    });
  });

  describe("has a getEntries method that", () => {
    it("returns the entries property", () => {
      expect(validAetherAccordion.getEntries()).to.deep.equals(
        validArgs.entries.map(entry => new AetherItemController(entry))
      );
    });
  });

  describe("has a getActiveId method that", () => {
    it("returns the activeId property", () => {
      expect(validAetherAccordion.getActiveId()).to.equal(
        defaultProperties.activeId
      );
    });
  });

  describe("has a getActive method that", () => {
    it("returns null if no entry is active", () => {
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        activeId: null
      });
      expect(aetherAccordion.getActive()).to.be.null;
    });
    it("returns the active entry", () => {
      const targetId = 2;
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        activeId: targetId
      });
      expect(aetherAccordion.getActive()).to.deep.equal(
        new AetherItemController(
          validArgs.entries.find(entry => entry.id === targetId)
        )
      );
    });
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

  describe("has a setEntryTitle method that", () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs);
    });

    describe("throws MissingArgumentError when", () => {
      it("all arguments are missing", () => {
        expect(() => aetherAccordion.setEntryTitle())
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
      it("second argument is missing", () => {
        expect(() => aetherAccordion.setEntryTitle(0))
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
    });

    describe("throws ArgumentTypeError when", () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ["not a number", -1, -253, true, null, [], {}];
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.setEntryTitle(value, "Valid title"))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
      it("'value' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}];
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.setEntryTitle(0, value))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
          expect(() => aetherAccordion.setEntryTitle(0, () => value))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
    });

    it("returns false if no entry is found with provided id", () =>
      expect(aetherAccordion.setEntryTitle(15, "Valid title")).to.be.false);
    it("returns true if entry is found and title is successfully updated", () =>
      expect(aetherAccordion.setEntryTitle(0, "Valid title")).to.be.true);

    it("sets the title of the entry to the specified value", () => {
      const targetId = 1;
      const validTitle = "This title is valid";
      aetherAccordion.setEntryTitle(targetId, validTitle);

      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).title
      ).to.equal(validTitle);
    });
  });

  describe("has a setEntryDescription method that", () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs);
    });

    describe("throws MissingArgumentError when", () => {
      it("all arguments are missing", () => {
        expect(() => aetherAccordion.setEntryDescription())
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
      it("second argument is missing", () => {
        expect(() => aetherAccordion.setEntryDescription(0))
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
    });

    describe("throws ArgumentTypeError when", () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ["not a number", -1, -253, true, null, [], {}];
        invalidValues.forEach(value => {
          expect(() =>
            aetherAccordion.setEntryDescription(value, "Valid description")
          )
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
      it("'value' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}];
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.setEntryDescription(0, value))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
          expect(() => aetherAccordion.setEntryDescription(0, () => value))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
    });

    it("returns false if no entry is found with provided id", () =>
      expect(aetherAccordion.setEntryDescription(15, "Valid description")).to.be
        .false);
    it("returns true if entry is found and description is successfully updated", () =>
      expect(aetherAccordion.setEntryDescription(0, "Valid description")).to.be
        .true);

    it("sets the description of the entry to the specified value", () => {
      const targetId = 1;
      const validDescription = "This description is valid";
      aetherAccordion.setEntryDescription(targetId, validDescription);

      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).description
      ).to.equal(validDescription);
    });
  });

  describe("has an activateEntry method that", () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs);
    });

    it("throws MissingArgumentError when id is missing", () => {
      expect(() => aetherAccordion.activateEntry())
        .to.throw()
        .with.property("name", "MissingArgumentError");
    });
    it("throws ArgumentTypeError when id is invalid", () => {
      const invalidValues = ["not a number", -1, -253, true, null, [], {}];
      invalidValues.forEach(value => {
        expect(() => aetherAccordion.activateEntry(value))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
    });
    it("returns false if no entry is found with provided id", () =>
      expect(aetherAccordion.activateEntry(15)).to.be.false);
    it("returns true if entry is found and it's successfully activated", () =>
      expect(aetherAccordion.activateEntry(0)).to.be.true);
    it("activates the specified entry if exists", () => {
      const targetId = 1;
      aetherAccordion.activateEntry(targetId);
      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).active
      ).to.be.true;
    });
  });

  describe("has a deactivateEntry method that", () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs);
    });

    it("throws MissingArgumentError when id is missing", () => {
      expect(() => aetherAccordion.deactivateEntry())
        .to.throw()
        .with.property("name", "MissingArgumentError");
    });
    it("throws ArgumentTypeError when id is invalid", () => {
      const invalidValues = ["not a number", -1, -253, true, null, [], {}];
      invalidValues.forEach(value => {
        expect(() => aetherAccordion.deactivateEntry(value))
          .to.throw()
          .with.property("name", "ArgumentTypeError");
      });
    });
    it("returns false if no entry is found with provided id", () =>
      expect(aetherAccordion.deactivateEntry(15)).to.be.false);
    it("returns true if entry is found and it's successfully deactivated", () =>
      expect(aetherAccordion.deactivateEntry(0)).to.be.true);
    it("deactivates the specified entry if exists", () => {
      const targetId = 1;
      aetherAccordion.deactivateEntry(targetId);
      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).active
      ).to.be.false;
    });
  });

  describe("has an insertEntryBefore method that", () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs);
    });

    describe("throws MissingArgumentError when", () => {
      it("all arguments are missing", () => {
        expect(() => aetherAccordion.insertEntryBefore())
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
      it("second argument is missing", () => {
        expect(() => aetherAccordion.insertEntryBefore(2))
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
    });

    describe("throws ArgumentTypeError when", () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ["not a number", -1, -253, true, null, [], {}];
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryBefore(value, validEntry))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
      it("'entry' argument receives invalid values", () => {
        const { title, ...entryWithoutTitle } = validEntry;
        const { description, ...entryWithoutDescription } = validEntry;
        const { id, ...entryWithoutId } = validEntry;
        const invalidValues = [
          "a string",
          12,
          -253,
          true,
          false,
          null,
          {},
          entryWithoutTitle,
          entryWithoutDescription,
          entryWithoutId,
          { ...validEntry, id: "invalid id" }
        ];
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryBefore(1, value))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
    });

    describe("throws ExistingIdError when", () => {
      it("'entry' argument receives an existing id", () => {
        expect(() =>
          aetherAccordion.insertEntryBefore(1, { ...validEntry, id: 1 })
        )
          .to.throw()
          .with.property("name", "ExistingIdError");
      });
    });

    it("returns false if no entry is found with provided id", () =>
      expect(aetherAccordion.insertEntryBefore(15, validEntry)).to.be.false);
    it("returns true if entry is found and entries are successfully updated", () =>
      expect(aetherAccordion.insertEntryBefore(1, validEntry)).to.be.true);

    it("inserts an entry into entries array before the specified entry id", () => {
      const targetId = 1;
      aetherAccordion.insertEntryBefore(targetId, validEntry);

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === targetId
      );

      expect(aetherAccordion.entries[targetIndex - 1]).to.deep.equal(
        new AetherItemController(validEntry)
      );
    });

    it("inserts an entry into entries array before the first entry id", () => {
      const firstId = 0;
      aetherAccordion.insertEntryBefore(firstId, validEntry);

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === firstId
      );

      expect(targetIndex - 1).to.equal(0);
      expect(aetherAccordion.entries[targetIndex - 1]).to.deep.equal(
        new AetherItemController(validEntry)
      );
    });
  });

  describe("has an insertEntryAfter method that", () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs);
    });

    describe("throws MissingArgumentError when", () => {
      it("all arguments are missing", () => {
        expect(() => aetherAccordion.insertEntryAfter())
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
      it("second argument is missing", () => {
        expect(() => aetherAccordion.insertEntryAfter(2))
          .to.throw()
          .with.property("name", "MissingArgumentError");
      });
    });

    describe("throws ArgumentTypeError when", () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ["not a number", -1, -253, true, null, [], {}];
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryAfter(value, validEntry))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
      it("'entry' argument receives invalid values", () => {
        const { title, ...entryWithoutTitle } = validEntry;
        const { description, ...entryWithoutDescription } = validEntry;
        const { id, ...entryWithoutId } = validEntry;
        const invalidValues = [
          "a string",
          12,
          -253,
          true,
          false,
          null,
          {},
          entryWithoutTitle,
          entryWithoutDescription,
          entryWithoutId,
          { ...validEntry, id: "invalid id" }
        ];
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryAfter(1, value))
            .to.throw()
            .with.property("name", "ArgumentTypeError");
        });
      });
    });

    describe("throws ExistingIdError when", () => {
      it("'entry' argument receives an existing id", () => {
        expect(() =>
          aetherAccordion.insertEntryAfter(1, { ...validEntry, id: 1 })
        )
          .to.throw()
          .with.property("name", "ExistingIdError");
      });
    });

    it("returns false if no entry is found with provided id", () =>
      expect(aetherAccordion.insertEntryAfter(15, validEntry)).to.be.false);
    it("returns true if entry is found and entries are successfully updated", () =>
      expect(aetherAccordion.insertEntryAfter(1, validEntry)).to.be.true);

    it("inserts an entry into entries array after the specified entry id", () => {
      const targetId = 1;
      aetherAccordion.insertEntryAfter(targetId, validEntry);

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === targetId
      );

      expect(aetherAccordion.entries[targetIndex + 1]).to.deep.equal(
        new AetherItemController(validEntry)
      );
    });

    it("inserts an entry into entries array after the last entry id", () => {
      const [{ id: lastId }] = [...aetherAccordion.entries].reverse();
      aetherAccordion.insertEntryAfter(lastId, validEntry);

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === lastId
      );

      expect(targetIndex + 1).to.equal(aetherAccordion.entries.length - 1);
      expect(aetherAccordion.entries[targetIndex + 1]).to.deep.equal(
        new AetherItemController(validEntry)
      );
    });
  });
});
