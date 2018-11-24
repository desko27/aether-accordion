import './globals'
import AetherItemController from '../src/controller/aether-item'

const validArgs = {
  id: 7,
  title: 'Look ma!',
  description: 'This is a full featured description.'
}

const defaultProperties = {
  active: false
}

describe('AetherItemController', () => {
  const validAetherItem = new AetherItemController(validArgs)
  let aetherItem

  describe('has a constructor method that', () => {
    describe('sets the following properties when it receives valid arguments:', () => {
      it('id', () => {
        expect(validAetherItem.id).to.exist
        expect(validAetherItem.id)
          .to.be.a('number')
          .that.equals(validArgs.id)
      })
      it('title', () => {
        expect(validAetherItem.title).to.exist
        expect(validAetherItem.title)
          .to.be.a('string')
          .that.equals(validArgs.title)
      })
      it('description', () => {
        expect(validAetherItem.description).to.exist
        expect(validAetherItem.description)
          .to.be.a('string')
          .that.equals(validArgs.description)
      })
      it('active', () => {
        expect(validAetherItem.active).to.exist
        expect(validAetherItem.active)
          .to.be.a('boolean')
          .that.equals(defaultProperties.active)
      })
    })

    describe('throws MissingArgumentError when', () => {
      it('all arguments are missing', () => {
        expect(() => new AetherItemController())
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it("'id' argument is missing", () => {
        expect(() => new AetherItemController({...validArgs, id: undefined}))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it("'title' argument is missing", () => {
        expect(() => new AetherItemController({...validArgs, title: undefined}))
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
      it("'description' argument is missing", () => {
        expect(
          () => new AetherItemController({...validArgs, description: undefined})
        )
          .to.throw()
          .with.property('name', 'MissingArgumentError')
      })
    })

    describe('throws ArgumentTypeError when', () => {
      it("'id' argument receives invalid values", () => {
        const invalidValues = ['not a number', -1, -253, true, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => new AetherItemController({...validArgs, id: value}))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'title' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}]
        invalidValues.forEach(value => {
          expect(() => new AetherItemController({...validArgs, title: value}))
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
      it("'description' argument receives invalid values", () => {
        const invalidValues = [2751, -130, true, false, null, [], {}]
        invalidValues.forEach(value => {
          expect(
            () => new AetherItemController({...validArgs, description: value})
          )
            .to.throw()
            .with.property('name', 'ArgumentTypeError')
        })
      })
    })
  })

  describe('has a getId method that', () => {
    it('returns the id property', () =>
      expect(validAetherItem.getId()).to.equal(validArgs.id))
  })

  describe('has a getTitle method that', () => {
    it('returns the title property', () =>
      expect(validAetherItem.getTitle()).to.equal(validArgs.title))
  })

  describe('has a getDescription method that', () => {
    it('returns the description property', () =>
      expect(validAetherItem.getDescription()).to.equal(validArgs.description))
  })

  describe('has an isActive method that', () => {
    it('returns the active property', () =>
      expect(validAetherItem.isActive()).to.equal(defaultProperties.active))
  })

  describe('has a setTitle method that', () => {
    beforeEach(() => {
      aetherItem = new AetherItemController(validArgs)
    })

    it('throws MissingArgumentError when value is missing', () => {
      expect(() => aetherItem.setTitle())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when value is invalid', () => {
      const invalidValues = [2751, -130, true, false, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => aetherItem.setTitle(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
        expect(() => aetherItem.setTitle(() => value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('sets received value as the title', () => {
      aetherItem.setTitle('Valid title')
      expect(aetherItem.title).to.equal('Valid title')
    })
    it('runs received function to set the returning value as the title', () => {
      aetherItem.setTitle(() => 'Valid title')
      expect(aetherItem.title).to.equal('Valid title')
    })
    it('received function is provided with the current value of title', () => {
      const anAetherItem = new AetherItemController({
        ...validArgs,
        title: 'Valid title'
      })
      anAetherItem.setTitle(currentTitle => `${currentTitle}, of course`)
      expect(anAetherItem.title).to.equal('Valid title, of course')
    })
  })

  describe('has a setDescription method that', () => {
    beforeEach(() => {
      aetherItem = new AetherItemController(validArgs)
    })

    it('throws MissingArgumentError when value is missing', () => {
      expect(() => aetherItem.setDescription())
        .to.throw()
        .with.property('name', 'MissingArgumentError')
    })
    it('throws ArgumentTypeError when value is invalid', () => {
      const invalidValues = [2751, -130, true, false, null, [], {}]
      invalidValues.forEach(value => {
        expect(() => aetherItem.setDescription(value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
        expect(() => aetherItem.setDescription(() => value))
          .to.throw()
          .with.property('name', 'ArgumentTypeError')
      })
    })
    it('sets received value as the description', () => {
      aetherItem.setDescription('Valid description')
      expect(aetherItem.description).to.equal('Valid description')
    })
    it('runs received function to set the returning value as the description', () => {
      aetherItem.setDescription(() => 'Valid description')
      expect(aetherItem.description).to.equal('Valid description')
    })
    it('received function is provided with the current value of description', () => {
      const anAetherItem = new AetherItemController({
        ...validArgs,
        description: 'Valid description'
      })
      anAetherItem.setDescription(
        currentDescription => `${currentDescription}, of course`
      )
      expect(anAetherItem.description).to.equal('Valid description, of course')
    })
  })

  describe('has an activate method that', () => {
    beforeEach(() => {
      aetherItem = new AetherItemController(validArgs)
    })

    it('sets active property to true', () => {
      aetherItem.active = false
      aetherItem.activate()
      expect(aetherItem.active).to.equal(true)
    })
    it('returns true if the property has been changed', () => {
      aetherItem.active = false
      expect(aetherItem.activate()).to.equal(true)
    })
    it('returns false if the property remains the same', () => {
      aetherItem.active = true
      expect(aetherItem.activate()).to.equal(false)
    })
  })

  describe('has a deactivate method that', () => {
    it('sets active property to false', () => {
      aetherItem.active = true
      aetherItem.deactivate()
      expect(aetherItem.active).to.equal(false)
    })
    it('returns true if the property has been changed', () => {
      aetherItem.active = true
      expect(aetherItem.deactivate()).to.equal(true)
    })
    it('returns false if the property remains the same', () => {
      aetherItem.active = false
      expect(aetherItem.deactivate()).to.equal(false)
    })
  })
})
