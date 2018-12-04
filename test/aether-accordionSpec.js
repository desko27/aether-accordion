import './globals'
import AetherAccordionController from '../src/controller/aether-accordion'
import AetherItemController from '../src/controller/aether-item'
import {validateEntry} from '../src/controller/aether-accordion/aether-accordion.validations'
import {AJAX_SYMBOL} from '../src/symbols'

const validArgs = {
  entries: [
    {
      id: 0,
      title: 'Section #1',
      description: 'Section #1 contents...'
    },
    {
      id: 1,
      title: 'Section #2',
      description: 'Section #2 contents...'
    },
    {
      id: 2,
      title: 'Section #3',
      description: 'Section #3 contents...'
    }
  ]
}

const validEntry = {
  id: 3,
  title: 'Section #4',
  description: 'Section #4 contents...'
}

const defaultProperties = {
  activeId: null
}

describe('AetherAccordionController', () => {
  const validAetherAccordion = new AetherAccordionController(validArgs)
  let aetherAccordion

  describe('has a constructor method that', () => {
    describe('sets the following properties when it receives valid arguments:', () => {
      it('entries', () => {
        expect(validAetherAccordion.entries).to.exist
        expect(validAetherAccordion.entries)
          .to.be.an('array')
          .that.deep.equals(
            validArgs.entries.map(entry => new AetherItemController(entry))
          )
      })
      it('entries without ids', () => {
        aetherAccordion = new AetherAccordionController({
          ...validArgs,
          entries: validArgs.entries.map(entry => ({...entry, id: undefined}))
        })
        expect(aetherAccordion.entries).to.exist
        expect(aetherAccordion.entries)
          .to.be.an('array')
          .that.deep.equals(
            validArgs.entries.map(entry => new AetherItemController(entry))
          )
      })
      it('activeId', () => {
        expect(validAetherAccordion.activeId).to.equal(
          defaultProperties.activeId
        )
      })
    })

    describe('throws MissingArgumentError when', () => {
      it('all arguments are missing', () => {
        expect(() => new AetherAccordionController())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it("'entries' argument is missing", () => {
        expect(
          () =>
            new AetherAccordionController({...validArgs, entries: undefined})
        )
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })

    describe('throws ArgumentTypeError when', () => {
      it("'entries' argument receives invalid values", () => {
        const {title, ...entryWithoutTitle} = validEntry
        const {description, ...entryWithoutDescription} = validEntry
        const invalidValues = [
          'a string',
          12,
          -253,
          true,
          false,
          null,
          {},
          [entryWithoutTitle],
          [entryWithoutDescription],
          [{...validEntry, id: 'invalid id'}]
        ]
        invalidValues.forEach(value => {
          expect(
            () => new AetherAccordionController({...validArgs, entries: value})
          )
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })

    describe('throws BadArgumentError when', () => {
      it("'entries' argument has inconsistent occurrences of id", () => {
        const {id, ...entryWithoutId} = validEntry
        const inconsistentEntries = [...validArgs.entries, entryWithoutId]
        expect(
          () =>
            new AetherAccordionController({
              ...validArgs,
              entries: inconsistentEntries
            })
        )
          .to.throw()
          .with.property('name', 'BadArgumentError')
      })
    })

    describe('throws ExistingIdError when', () => {
      it("'entries' argument receives duplicated ids", () => {
        const entries = [...validArgs.entries, {...validEntry, id: 1}]
        expect(() => new AetherAccordionController({...validArgs, entries}))
          .to.throw()
          .with.property('name', 'ExistingIdError')
      })
    })

    describe('throws up any other error when', () => {
      it('an unknown error is caught by the entry validator', () => {
        const AetherItemStub = sinon
          .stub(AetherItemController, 'constructor')
          .throws(new Error('Unknown error'))

        expect(() => validateEntry(validEntry, AetherItemStub)).to.throw(
          'Unknown error'
        )
      })
    })
  })

  describe('has an updateView method that', () => {
    it('runs the specified viewUpdaters function with arguments', () => {
      let viewUpdaterIsDone, controllerResult, arg1Result, arg2Result
      const aetherAccordion = new AetherAccordionController({
        ...validArgs,
        viewUpdaters: {
          myViewUpdater: (controller, arg1, arg2) => {
            viewUpdaterIsDone = true
            controllerResult = controller
            arg1Result = arg1
            arg2Result = arg2
          }
        }
      })
      const itRan = aetherAccordion.updateView(
        'myViewUpdater',
        'first one',
        'second one'
      )
      expect(itRan).to.be.true
      expect(viewUpdaterIsDone).to.be.true
      expect(controllerResult).to.deep.equal(aetherAccordion)
      expect(arg1Result).to.equal('first one')
      expect(arg2Result).to.equal('second one')
    })
    it('does not run the specified viewUpdaters function if missing', () => {
      const aetherAccordion = new AetherAccordionController(validArgs)
      const itRan = aetherAccordion.updateView('undefinedViewUpdater')
      expect(itRan).to.be.false
    })
  })

  describe('has an on method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    describe('throws MissingArgumentError when', () => {
      it('eventName is missing', () => {
        expect(() => aetherAccordion.on())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it('func is missing', () => {
        expect(() => aetherAccordion.on('deactivateEntry'))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })
    describe('throws ArgumentTypeError when', () => {
      it('eventName is invalid', () => {
        expect(() => aetherAccordion.on(15, () => {}))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
      it('func is invalid', () => {
        expect(() => aetherAccordion.on('deactivateEntry', 'invalid func'))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('registers multiple functions for a specific eventName', () => {
      expect(aetherAccordion.eventListeners).to.deep.equal({})
      aetherAccordion.on('activateEntry', () => {})
      aetherAccordion.on('activateEntry', () => {})
      expect(aetherAccordion.eventListeners).to.have.property('activateEntry')
      expect(aetherAccordion.eventListeners.activateEntry).to.have.lengthOf(2)
      expect(typeof aetherAccordion.eventListeners.activateEntry[0]).to.equal(
        'function'
      )
      expect(typeof aetherAccordion.eventListeners.activateEntry[1]).to.equal(
        'function'
      )
    })
  })

  describe('has an emitEvent method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    it('throws MissingArgumentError when eventName is missing', () => {
      expect(() => aetherAccordion.emitEvent())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    describe('throws ArgumentTypeError when', () => {
      it('eventName is invalid', () => {
        expect(() => aetherAccordion.emitEvent(15, {}))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
      it('event is invalid', () => {
        ;['not an object', null].forEach(value => {
          expect(() => aetherAccordion.emitEvent('activateEntry', value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })
    it('runs all the subscribed functions to the specified eventName', () => {
      let firstRan, secondRan
      aetherAccordion.on('activateEntry', () => (firstRan = true))
      aetherAccordion.on('activateEntry', () => (secondRan = true))
      aetherAccordion.emitEvent('activateEntry')
      expect(firstRan).to.be.true
      expect(secondRan).to.be.true
    })
    it('has an event argument that defaults to an empty object if not set', () => {
      let passedEvent
      aetherAccordion.on('activateEntry', event => (passedEvent = event))
      aetherAccordion.emitEvent('activateEntry')
      expect(typeof passedEvent).not.to.be.null
      expect(typeof passedEvent).to.equal('object')
    })
  })

  describe('has an init method that', () => {
    it('runs init view updater function at constructor', () => {
      let itRan
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        viewUpdaters: {
          init: () => (itRan = true)
        }
      })
      expect(itRan).to.be.true
    })
    it('emits init event', () => {
      let itRan
      aetherAccordion = new AetherAccordionController(validArgs)
      aetherAccordion.on('init', () => (itRan = true))
      aetherAccordion.init()
      expect(itRan).to.be.true
    })
  })

  describe('has an triggerEntryAjax method that', () => {
    let clock

    before(() => {
      // mock fetch
      const fakeFetch = () =>
        Promise.resolve({
          text: () => Promise.resolve('test data')
        })
      if (typeof window === 'undefined') global.window = {fetch: fakeFetch}
      else sinon.replace(window, 'fetch', fakeFetch)

      // use sinon clock
      clock = sinon.useFakeTimers()
    })
    after(() => {
      sinon.restore()
      clock.restore()
    })

    it('throws MissingArgumentError when id is missing', () => {
      expect(() => validAetherAccordion.triggerEntryAjax())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when id is invalid', () => {
      expect(() => validAetherAccordion.triggerEntryAjax('invalid id'))
        .to.throw()
        .with.property('name', 'ArgumentTypeError')
    })
    it('does nothing on a non-existing description', () => {
      aetherAccordion = new AetherAccordionController(validArgs)
      expect(aetherAccordion.triggerEntryAjax(10)).to.be.false
    })
    it('does nothing on a non-AJAX description', () => {
      aetherAccordion = new AetherAccordionController(validArgs)
      expect(aetherAccordion.triggerEntryAjax(0)).to.be.false
    })
    it('resolves and sets a new value for an AJAX description', () => {
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        entries: [
          {
            ...validEntry,
            id: 0,
            description: `${AJAX_SYMBOL}http://example.com`
          }
        ]
      })

      // wait for the job queue (resolved promises) to process
      setTimeout(() => {
        expect(aetherAccordion.getEntryDescription(0)).to.equal('test data')
      })
    })
    it('sets an error message as a description when AJAX fails', () => {
      // mock fetch as an error thrower
      window.fetch = () => {
        throw new Error('This is an error')
      }

      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        entries: [
          {
            ...validEntry,
            id: 0,
            description: `${AJAX_SYMBOL}http://example.com`
          }
        ]
      })

      // wait for the job queue (resolved promises) to process
      setTimeout(() => {
        expect(aetherAccordion.getEntryDescription(0).startsWith('Error:')).to
          .be.true
      })
    })
  })

  describe('has a getNewId method that', () => {
    it('returns a new unique and valid id by checking existing ones', () => {
      aetherAccordion = new AetherAccordionController(validArgs)
      expect(aetherAccordion.getNewId()).to.equal(3)
    })
    it('returns the lowest possible new unique id', () => {
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        entries: [...validArgs.entries, {...validEntry, id: 4}]
      })
      expect(aetherAccordion.getNewId()).to.equal(3)
    })
  })

  describe('has a getEntries method that', () => {
    it('returns the entries property', () => {
      expect(validAetherAccordion.getEntries()).to.deep.equals(
        validArgs.entries.map(entry => new AetherItemController(entry))
      )
    })
  })

  describe('has a getActiveId method that', () => {
    it('returns the activeId property', () => {
      expect(validAetherAccordion.getActiveId()).to.equal(
        defaultProperties.activeId
      )
    })
  })

  describe('has a getActive method that', () => {
    it('returns null if no entry is active', () => {
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        activeId: null
      })
      expect(aetherAccordion.getActive()).to.be.null
    })
    it('returns the active entry', () => {
      const targetId = 2
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        activeId: targetId
      })
      const expected = new AetherItemController(
        validArgs.entries.find(entry => entry.id === targetId)
      )
      expected.activate()
      expect(aetherAccordion.getActive()).to.deep.equal(expected)
    })
  })

  describe('has a getEntry method that', () => {
    it('throws MissingArgumentError when id is missing', () => {
      expect(() => validAetherAccordion.getEntry())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when id is invalid', () => {
      const invalidValues = ['not a number', -1, -253, true, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => validAetherAccordion.getEntry(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('returns null if no entry is found with provided id', () =>
      expect(validAetherAccordion.getEntry(15)).to.be.null)
    it('returns the specified entry if exists', () => {
      expect(validAetherAccordion.getEntry(1)).to.deep.equal(
        new AetherItemController(
          validArgs.entries.find(entry => entry.id === 1)
        )
      )
    })
  })

  describe('has a getEntryTitle method that', () => {
    it('throws MissingArgumentError when id is missing', () => {
      expect(() => validAetherAccordion.getEntryTitle())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when id is invalid', () => {
      const invalidValues = ['not a number', -1, -253, true, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => validAetherAccordion.getEntryTitle(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('returns null if no entry is found with provided id', () =>
      expect(validAetherAccordion.getEntryTitle(15)).to.be.null)
    it("returns the specified entry's title if entry exists", () => {
      expect(validAetherAccordion.getEntryTitle(1)).to.equal(
        validArgs.entries.find(entry => entry.id === 1).title
      )
    })
  })

  describe('has a getEntryDescription method that', () => {
    it('throws MissingArgumentError when id is missing', () => {
      expect(() => validAetherAccordion.getEntryDescription())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when id is invalid', () => {
      const invalidValues = ['not a number', -1, -253, true, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => validAetherAccordion.getEntryDescription(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('returns null if no entry is found with provided id', () =>
      expect(validAetherAccordion.getEntryDescription(15)).to.be.null)
    it("returns the specified entry's description if entry exists", () => {
      expect(validAetherAccordion.getEntryDescription(1)).to.equal(
        validArgs.entries.find(entry => entry.id === 1).description
      )
    })
  })

  describe('has a setEntryTitle method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    describe('throws MissingArgumentError when', () => {
      it('all arguments are missing', () => {
        expect(() => aetherAccordion.setEntryTitle())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it('second argument is missing', () => {
        expect(() => aetherAccordion.setEntryTitle(0))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })

    describe('throws ArgumentTypeError when', () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ['not a number', -1, -253, true, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.setEntryTitle(value, 'Valid title'))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'value' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.setEntryTitle(0, value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
          expect(() => aetherAccordion.setEntryTitle(0, () => value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })

    it('returns false if no entry is found with provided id', () =>
      expect(aetherAccordion.setEntryTitle(15, 'Valid title')).to.be.false)
    it('returns true if entry is found and title is successfully updated', () =>
      expect(aetherAccordion.setEntryTitle(0, 'Valid title')).to.be.true)

    it('sets the title of the entry to the specified value', () => {
      const targetId = 1
      const validTitle = 'This title is valid'
      aetherAccordion.setEntryTitle(targetId, validTitle)

      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).title
      ).to.equal(validTitle)
    })
  })

  describe('has a setEntryDescription method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    describe('throws MissingArgumentError when', () => {
      it('all arguments are missing', () => {
        expect(() => aetherAccordion.setEntryDescription())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it('second argument is missing', () => {
        expect(() => aetherAccordion.setEntryDescription(0))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })

    describe('throws ArgumentTypeError when', () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ['not a number', -1, -253, true, null, [], {}]
        invalidValues.forEach(value => {
          expect(() =>
            aetherAccordion.setEntryDescription(value, 'Valid description')
          )
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'value' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.setEntryDescription(0, value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
          expect(() => aetherAccordion.setEntryDescription(0, () => value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })

    it('returns false if no entry is found with provided id', () =>
      expect(aetherAccordion.setEntryDescription(15, 'Valid description')).to.be
        .false)
    it('returns true if entry is found and description is successfully updated', () =>
      expect(aetherAccordion.setEntryDescription(0, 'Valid description')).to.be
        .true)

    it('sets the description of the entry to the specified value', () => {
      const targetId = 1
      const validDescription = 'This description is valid'
      aetherAccordion.setEntryDescription(targetId, validDescription)

      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).description
      ).to.equal(validDescription)
    })
  })

  describe('has an activateEntry method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    it('throws MissingArgumentError when id is missing', () => {
      expect(() => aetherAccordion.activateEntry())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when id is invalid', () => {
      const invalidValues = ['not a number', -1, -253, true, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => aetherAccordion.activateEntry(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('returns false if no entry is found with provided id', () =>
      expect(aetherAccordion.activateEntry(15)).to.be.false)
    it("returns true if entry is found and it's successfully activated", () =>
      expect(aetherAccordion.activateEntry(0)).to.be.true)
    it('activates the specified entry if exists', () => {
      const targetId = 1
      aetherAccordion.activateEntry(targetId)
      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).active
      ).to.be.true
    })
    it('automatically deactivates an already active entry if any', () => {
      const alreadyActiveId = 0
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        activeId: alreadyActiveId
      })
      const targetId = 1
      aetherAccordion.activateEntry(targetId)
      expect(
        aetherAccordion.entries.find(entry => entry.id === alreadyActiveId)
          .active
      ).to.be.false
      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).active
      ).to.be.true
    })
  })

  describe('has a deactivateEntry method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    it('throws MissingArgumentError when id is missing', () => {
      expect(() => aetherAccordion.deactivateEntry())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when id is invalid', () => {
      const invalidValues = ['not a number', -1, -253, true, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => aetherAccordion.deactivateEntry(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('returns false if no entry is found with provided id', () =>
      expect(aetherAccordion.deactivateEntry(15)).to.be.false)
    it("returns true if entry is found and it's successfully deactivated", () =>
      expect(aetherAccordion.deactivateEntry(0)).to.be.true)
    it('deactivates the specified entry if exists', () => {
      const targetId = 1
      aetherAccordion.deactivateEntry(targetId)
      expect(
        aetherAccordion.entries.find(entry => entry.id === targetId).active
      ).to.be.false
    })
  })

  describe('has an insertEntryAt method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    describe('throws MissingArgumentError when', () => {
      it('all arguments are missing', () => {
        expect(() => aetherAccordion.insertEntryAt())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it('second argument is missing', () => {
        expect(() => aetherAccordion.insertEntryAt(0))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })

    describe('throws ArgumentTypeError when', () => {
      it("'index' argument receives invalid values", () => {
        const invalidValues = ['not a number', -1, -253, true, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryAt(value, validEntry))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'entry' argument receives invalid values", () => {
        const {title, ...entryWithoutTitle} = validEntry
        const {description, ...entryWithoutDescription} = validEntry
        const invalidValues = [
          'a string',
          12,
          -253,
          true,
          false,
          null,
          {},
          entryWithoutTitle,
          entryWithoutDescription,
          {...validEntry, id: 'invalid id'}
        ]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryAt(0, value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'position' argument receives invalid values", () => {
        const invalidValues = [{}, [], 15, 'invalid string']
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryAt(0, validEntry, value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })

    describe('throws ExistingIdError when', () => {
      it("'entry' argument receives an existing id", () => {
        expect(() => aetherAccordion.insertEntryAt(0, {...validEntry, id: 1}))
          .to.throw()
          .with.property('name', 'ExistingIdError')
      })
    })

    it('returns null if entry cannot be inserted at the provided index', () =>
      expect(aetherAccordion.insertEntryAt(15, validEntry)).to.be.null)
    it('returns the new id if index is valid and entries are successfully updated', () =>
      expect(aetherAccordion.insertEntryAt(0, validEntry)).to.equal(3))
    it('returns a generated id even if entry was not provided with it', () =>
      expect(
        aetherAccordion.insertEntryAt(0, {...validEntry, id: undefined})
      ).to.equal(3))

    it('inserts an entry into entries array before the specified index', () => {
      const targetIndex = 1
      aetherAccordion.insertEntryAt(targetIndex, validEntry, 'before')

      expect(aetherAccordion.entries[targetIndex]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })
    it('inserts an entry into entries array after the specified index', () => {
      const targetIndex = 1
      aetherAccordion.insertEntryAt(targetIndex, validEntry, 'after')

      expect(aetherAccordion.entries[targetIndex + 1]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })
  })

  describe('has an insertEntryBefore method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    describe('throws MissingArgumentError when', () => {
      it('all arguments are missing', () => {
        expect(() => aetherAccordion.insertEntryBefore())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it('second argument is missing', () => {
        expect(() => aetherAccordion.insertEntryBefore(2))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })

    describe('throws ArgumentTypeError when', () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ['not a number', -1, -253, true, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryBefore(value, validEntry))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'entry' argument receives invalid values", () => {
        const {title, ...entryWithoutTitle} = validEntry
        const {description, ...entryWithoutDescription} = validEntry
        const invalidValues = [
          'a string',
          12,
          -253,
          true,
          false,
          null,
          {},
          entryWithoutTitle,
          entryWithoutDescription,
          {...validEntry, id: 'invalid id'}
        ]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryBefore(1, value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })

    describe('throws ExistingIdError when', () => {
      it("'entry' argument receives an existing id", () => {
        expect(() =>
          aetherAccordion.insertEntryBefore(1, {...validEntry, id: 1})
        )
          .to.throw()
          .with.property('name', 'ExistingIdError')
      })
    })

    it('returns null if no entry is found with provided id', () =>
      expect(aetherAccordion.insertEntryBefore(15, validEntry)).to.be.null)
    it('returns the new id if entry is found and entries are successfully updated', () =>
      expect(aetherAccordion.insertEntryBefore(1, validEntry)).to.equal(3))

    it('inserts an entry into entries array before the specified entry id', () => {
      const targetId = 1
      aetherAccordion.insertEntryBefore(targetId, validEntry)

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === targetId
      )

      expect(aetherAccordion.entries[targetIndex - 1]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })

    it('inserts an entry into entries array before the first entry id', () => {
      const firstId = 0
      aetherAccordion.insertEntryBefore(firstId, validEntry)

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === firstId
      )

      expect(targetIndex - 1).to.equal(0)
      expect(aetherAccordion.entries[targetIndex - 1]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })
  })

  describe('has an insertEntryAfter method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    describe('throws MissingArgumentError when', () => {
      it('all arguments are missing', () => {
        expect(() => aetherAccordion.insertEntryAfter())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it('second argument is missing', () => {
        expect(() => aetherAccordion.insertEntryAfter(2))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })

    describe('throws ArgumentTypeError when', () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ['not a number', -1, -253, true, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryAfter(value, validEntry))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'entry' argument receives invalid values", () => {
        const {title, ...entryWithoutTitle} = validEntry
        const {description, ...entryWithoutDescription} = validEntry
        const invalidValues = [
          'a string',
          12,
          -253,
          true,
          false,
          null,
          {},
          entryWithoutTitle,
          entryWithoutDescription,
          {...validEntry, id: 'invalid id'}
        ]
        invalidValues.forEach(value => {
          expect(() => aetherAccordion.insertEntryAfter(1, value))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })

    describe('throws ExistingIdError when', () => {
      it("'entry' argument receives an existing id", () => {
        expect(() =>
          aetherAccordion.insertEntryAfter(1, {...validEntry, id: 1})
        )
          .to.throw()
          .with.property('name', 'ExistingIdError')
      })
    })

    it('returns null if no entry is found with provided id', () =>
      expect(aetherAccordion.insertEntryAfter(15, validEntry)).to.be.null)
    it('returns the new id if entry is found and entries are successfully updated', () =>
      expect(aetherAccordion.insertEntryAfter(1, validEntry)).to.equal(3))

    it('inserts an entry into entries array after the specified entry id', () => {
      const targetId = 1
      aetherAccordion.insertEntryAfter(targetId, validEntry)

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === targetId
      )

      expect(aetherAccordion.entries[targetIndex + 1]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })

    it('inserts an entry into entries array after the last entry id', () => {
      const {id: lastId} = aetherAccordion.entries[
        aetherAccordion.entries.length - 1
      ]
      aetherAccordion.insertEntryAfter(lastId, validEntry)

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === lastId
      )

      expect(targetIndex + 1).to.equal(aetherAccordion.entries.length - 1)
      expect(aetherAccordion.entries[targetIndex + 1]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })
  })

  describe('has an prependEntry method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    it('inserts an entry into entries array before the first entry id', () => {
      const firstId = 0
      aetherAccordion.prependEntry(validEntry)

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === firstId
      )

      expect(targetIndex - 1).to.equal(0)
      expect(aetherAccordion.entries[targetIndex - 1]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })
  })

  describe('has an appendEntry method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    it('inserts an entry into entries array after the last entry id', () => {
      const {id: lastId} = aetherAccordion.entries[
        aetherAccordion.entries.length - 1
      ]
      aetherAccordion.appendEntry(validEntry)

      const targetIndex = aetherAccordion.entries.findIndex(
        entry => entry.id === lastId
      )

      expect(targetIndex + 1).to.equal(aetherAccordion.entries.length - 1)
      expect(aetherAccordion.entries[targetIndex + 1]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })

    it('inserts an entry into entries array even when entries is empty', () => {
      aetherAccordion = new AetherAccordionController({
        ...validArgs,
        entries: []
      })
      aetherAccordion.appendEntry(validEntry)

      expect(0).to.equal(aetherAccordion.entries.length - 1)
      expect(aetherAccordion.entries[0]).to.deep.equal(
        new AetherItemController(validEntry)
      )
    })
  })

  describe('has an removeEntry method that', () => {
    beforeEach(() => {
      aetherAccordion = new AetherAccordionController(validArgs)
    })

    it('throws MissingArgumentError when id is missing', () => {
      expect(() => aetherAccordion.removeEntry())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when id is invalid', () => {
      const invalidValues = ['not a number', -1, -253, true, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => aetherAccordion.removeEntry(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('returns false if no entry is found with provided id', () =>
      expect(aetherAccordion.removeEntry(15)).to.be.false)
    it("returns true if entry is found and it's successfully removed", () =>
      expect(aetherAccordion.removeEntry(0)).to.be.true)
    it('removes the specified entry if exists', () => {
      const targetId = 1
      const startingLength = aetherAccordion.entries.length
      aetherAccordion.removeEntry(targetId)
      expect(aetherAccordion.entries.length).to.be.equal(startingLength - 1)
      expect(aetherAccordion.entries.find(entry => entry.id === targetId)).to.be
        .undefined
    })
  })
})
