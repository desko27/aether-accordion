import {
  throwMissingArgumentError,
  throwArgumentTypeError,
  throwBadArgumentError,
  throwExistingIdError
} from '../../utils/error'
import {validateEntries, validateEntry} from './aether-accordion.validations'
import {validateId} from '../aether-item/aether-item.validations'
import {LOADING_SYMBOL, AJAX_SYMBOL} from '../../symbols'

/**
 * The controller for an AetherAccordion. An instance of
 * AetherAccordionController keeps the full state of the accordion so it can be
 * tracked and updated in a variety of ways after the initialization.
 * @class AetherAccordionController
 */
export default class AetherAccordionController {
  /**
   * Creates an instance of AetherAccordionController
   * @param {Object} options
   * @param {Array<Object>} options.entries Array of plain objects
   * @param {Integer|null} [options.activeId=null] The id of the entry that
   *                                               should be active from the
   *                                               beginning
   * @param {Object} [options.viewUpdaters={}] A plain object where each
   *                 property is an external function to hook any of the
   *                 internal namesake methods in order to update any change
   *                 of state to the view
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Option entries must be set
   * @throws {ArgumentTypeError} Option entries must be an array and pass
   *                             validation function
   * @throws {BadArgumentError} Option entries must have all of its entries
   *                            with an id property, or any of them
   */
  constructor({entries, activeId = null, viewUpdaters = {}} = {}) {
    // check for missing arguments and argument types
    if (entries === undefined) throwMissingArgumentError('entries')
    if (!Array.isArray(entries))
      throwArgumentTypeError('entries', entries, 'array')

    // check for coherence in the presence of IDs
    // (all entries have it or none of them)
    if (
      !entries.every(entry => entry.id === undefined) &&
      !entries.every(entry => entry.id !== undefined)
    )
      throwBadArgumentError(
        'entries',
        entries,
        'Incoherent presence of IDs. If you want to use IDs please provide ' +
          "them for all your entries. Otherwise, don't set any."
      )

    // validate entries and parse them into actual item controllers
    // ** add ID to each one if it's actually missing
    const entriesWithId = entries.map((entry, index) => {
      if (entry.id === undefined) return {id: index, ...entry}
      return entry
    })
    this.entries = validateEntries(entriesWithId)

    // settle other properties into the instance
    this.activeId = activeId
    this.viewUpdaters = viewUpdaters
    this.eventListeners = {}

    // actually mark the activeId entry as active if any
    if (activeId !== null) this.getEntry(activeId).activate()

    // trigger init method which updates view
    this.init()

    // trigger ajax of entries if needed
    this.entries.map(({id}) => this.triggerEntryAjax(id))
  }

  /**
   * Run the specified viewUpdaters function only if exists
   * @param {Function} funcName The name of the viewUpdaters function to run
   * @param {...Argument} args The arguments for the corresponding viewUpdaters
   *                           function
   * @memberof AetherAccordionController
   */
  updateView(funcName, ...args) {
    if (funcName in this.viewUpdaters)
      this.viewUpdaters[funcName](this, ...args)
  }

  /**
   * Register a new event listener function for a specific eventName, so
   * that function will fire whenever the specified eventName is fired.
   * @param {String} eventName An identifier for the event
   * @param {Function} func The function that's going to be triggered when the
   *                        specified event is fired. The function takes an
   *                        event object as an argument: event => {···}
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument eventName must be set
   * @throws {MissingArgumentError} Argument func must be set
   * @throws {ArgumentTypeError} Argument eventName must be a string
   * @throws {ArgumentTypeError} Argument func must be a function
   */
  on(eventName, func) {
    if (eventName === undefined) throwMissingArgumentError('eventName')
    if (func === undefined) throwMissingArgumentError('func')

    if (typeof eventName !== 'string')
      throwArgumentTypeError('eventName', eventName, 'string')
    if (typeof func !== 'function')
      throwArgumentTypeError('func', func, 'function')

    if (!(eventName in this.eventListeners)) this.eventListeners[eventName] = []
    this.eventListeners[eventName].push(func) // add the new listener
  }

  /**
   * Trigger an event with the specific eventName, so any registered function
   * for the specified eventName will be immediately fired.
   * @param {String} eventName
   * @param {Object} [event={}]
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument eventName must be set
   * @throws {MissingArgumentError} Argument event must be set
   * @throws {ArgumentTypeError} Argument eventName must be a string
   * @throws {ArgumentTypeError} Argument event must be an object
   */
  emitEvent(eventName, event = {}) {
    if (eventName === undefined) throwMissingArgumentError('eventName')
    if (event === undefined) throwMissingArgumentError('event')

    if (typeof eventName !== 'string')
      throwArgumentTypeError('eventName', eventName, 'string')
    if (typeof event !== 'object' || event === null)
      throwArgumentTypeError('event', event, 'object')

    // add common stuff for all the event objects
    const extendedEvent = {
      source: this,
      ...event
    }

    // run all the registered functions for this event!!
    if (eventName in this.eventListeners)
      this.eventListeners[eventName].forEach(f => f(extendedEvent))
  }

  /**
   * Initializing hook for first view rendering
   * @memberof AetherAccordionController
   */
  init() {
    this.updateView('init')
    this.emitEvent('init')
  }

  triggerEntryAjax(id) {
    const entryDescription = this.getEntryDescription(id)
    if (!entryDescription) return false

    // check for ajax symbol
    if (entryDescription.startsWith(AJAX_SYMBOL)) {
      this.setEntryDescription(id, LOADING_SYMBOL)
      const source = entryDescription.slice(AJAX_SYMBOL.length)

      // enqueue the request in a non-blocking way
      ;(async () => {
        let result
        try {
          result = await (await window.fetch(source)).text()
        } catch (error) {
          this.setEntryDescription(
            id,
            'Error: AJAX content could not be loaded...'
          )
        }
        this.setEntryDescription(id, result)
      })()

      // enqueued
      return true
    }
  }

  /**
   * Generate a unique and valid id by checking existing ones
   * @returns {Integer} A new unique id
   * @memberof AetherAccordionController
   */
  getNewId() {
    const existingIds = this.entries.map(entry => entry.id)
    let autoincrement = 0
    while (existingIds.includes(autoincrement)) autoincrement++
    return autoincrement
  }

  /**
   * Get value of entries property
   * @returns {Array<AetherItemController>}
   * @memberof AetherAccordionController
   */
  getEntries() {
    return this.entries
  }

  /**
   * Get value of activeId property
   * @returns {Integer|null} The id of the currently active entry or null
   *                         if no entry is active
   * @memberof AetherAccordionController
   */
  getActiveId() {
    return this.activeId
  }

  /**
   * Get the instance of active entry
   * @returns {AetherItemController|null} The currently active entry or null
   *                                      if no entry is active
   * @memberof AetherAccordionController
   */
  getActive() {
    if (this.activeId !== null) return this.getEntry(this.activeId)
    return null
  }

  /**
   * Get the instance of the entry with the specified id
   * @param {Integer} id
   * @returns {AetherItemController|null} The entry instance or null when no
   *                                      entry is found with the provided id
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   */
  getEntry(id) {
    if (id === undefined) throwMissingArgumentError('id')
    validateId(id)

    const item = this.entries.find(entry => entry.id === id)
    if (!item) return null
    return item
  }

  /**
   * Get the title of the entry with the specified id
   * @param {Integer} id
   * @returns {String|null} The entry's title or null when no entry is found
   *                        with the provided id
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   */
  getEntryTitle(id) {
    const entry = this.getEntry(id)
    const title = entry && entry.getTitle()
    return title || null
  }

  /**
   * Get the description of the entry with the specified id
   * @param {Integer} id
   * @returns {String|null} The entry's description or null when no entry is
   *                        found with the provided id
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   */
  getEntryDescription(id) {
    const entry = this.getEntry(id)
    const description = entry && entry.getDescription()
    return description || null
  }

  /**
   * Set a new value for the title of the specified entry id
   * @param {Integer} id
   * @param {String|Function} value When a function is provided, the current
   *                                value for title will be passed to the
   *                                function as an argument and the returned
   *                                value will be used
   * @returns {Boolean} true if the entry is found and updated, false of no
   *                    entry is found with the provided id so nothing is done
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {MissingArgumentError} Argument value must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   * @throws {ArgumentTypeError} Argument value must be a string or function
   */
  setEntryTitle(id, value) {
    if (value === undefined) throwMissingArgumentError('value')
    const entry = this.getEntry(id)
    if (!entry) return false

    entry.setTitle(value)
    this.updateView('setEntryTitle', id, value)
    this.emitEvent('setEntryTitle', {id, value, entry, result: true})
    return true
  }

  /**
   * Set a new value for the description of the specified entry id
   * @param {Integer} id
   * @param {String|Function} value When a function is provided, the current
   *                                value for description will be passed to the
   *                                function as an argument and the returned
   *                                value will be used
   * @returns {Boolean} true if the entry is found and updated, false of no
   *                    entry is found with the provided id so nothing is done
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {MissingArgumentError} Argument value must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   * @throws {ArgumentTypeError} Argument value must be a string or function
   */
  setEntryDescription(id, value) {
    if (value === undefined) throwMissingArgumentError('value')
    const entry = this.getEntry(id)
    if (!entry) return false

    entry.setDescription(value)
    this.updateView('setEntryDescription', id, value)
    this.emitEvent('setEntryDescription', {id, value, entry, result: true})
    return true
  }

  /**
   * Activates the entry with the specified id. If any other entry is already
   * active, it gets deactivated before the new entry gets activated since
   * only one should be active at once.
   * @param {Integer} id
   * @returns {Boolean} true if the entry is found and updated, false of no
   *                    entry is found with the provided id so nothing is done
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   */
  activateEntry(id) {
    const entry = this.getEntry(id)
    if (!entry) return false

    // deactivate currently active entry if any
    if (this.activeId !== null) this.deactivateEntry(this.activeId)

    entry.activate()
    this.activeId = id
    this.updateView('activateEntry', id)
    this.emitEvent('activateEntry', {id, entry, result: true})
    return true
  }

  /**
   * Deactivates the entry with the specified id
   * @param {Integer} id
   * @returns {Boolean} true if the entry is found and updated, false of no
   *                    entry is found with the provided id so nothing is done
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   */
  deactivateEntry(id) {
    const entry = this.getEntry(id)
    if (!entry) return false

    entry.deactivate()
    this.activeId = null
    this.updateView('deactivateEntry', id)
    this.emitEvent('deactivateEntry', {id, entry, result: true})
    return true
  }

  /**
   * Insert a new entry before/after the specified index
   * @param {Integer} index
   * @param {Object} entry
   * @param {String} position One of ['before', 'after']
   * @param {Integer} [entry.id] A new one will be automatically generated if
   *                             not set
   * @param {String} entry.title
   * @param {String} entry.description
   * @returns {Integer|null} The id of the new entry if successfully inserted,
   *                         null if the provided position and index are an
   *                         impossible reference
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument index must be set
   * @throws {MissingArgumentError} Argument entry must be set
   * @throws {MissingArgumentError} Argument position must be set
   * @throws {ArgumentTypeError} Argument index must be a positive integer
   * @throws {ArgumentTypeError} Argument entry must be a plain object with the
   *                             required entry properties
   * @throws {ArgumentTypeError} Argument position must be a string of
   *                             ['before', 'after']
   * @throws {ExistingIdError} If provided, entry.id should not exist already
   */
  insertEntryAt(index, entry, position = 'before') {
    if (index === undefined) throwMissingArgumentError('index')
    if (entry === undefined) throwMissingArgumentError('entry')
    if (position === undefined) throwMissingArgumentError('position')

    if (!Number.isInteger(index) || (Number.isInteger(index) && index < 0))
      throwArgumentTypeError('index', index, 'positive integer')
    if (typeof entry !== 'object' || entry === null)
      throwArgumentTypeError('entry', entry, 'object')
    if (typeof position !== 'string' || !['before', 'after'].includes(position))
      throwArgumentTypeError('position', position, "one of ['before', 'after']")

    if (entry.id === undefined) entry.id = this.getNewId()
    const newEntry = validateEntry(entry)

    if (this.entries.find(e => e.id === entry.id))
      throwExistingIdError(entry.id)

    const targetIndex = position === 'before' || index === 0 ? index : index + 1
    if (index !== 0 && !this.entries[index]) return null

    this.entries.splice(targetIndex, 0, newEntry)
    this.updateView('insertEntryAt', index, entry)
    this.emitEvent('insertEntryAt', {
      index,
      entry: newEntry,
      position,
      result: newEntry.getId()
    })
    return newEntry.getId()
  }

  /**
   * Insert a new entry before the specified entry id
   * @param {Integer} id
   * @param {Object} entry
   * @param {Integer} [entry.id] A new one will be automatically generated if
   *                             not set
   * @param {String} entry.title
   * @param {String} entry.description
   * @returns {Integer|null} The id of the new entry if successfully inserted,
   *                         null if the provided entry id is not found so
   *                         nothing is done
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {MissingArgumentError} Argument entry must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   * @throws {ArgumentTypeError} Argument entry must be a plain object with the
   *                             required entry properties
   * @throws {ExistingIdError} If provided, entry.id should not exist already
   */
  insertEntryBefore(id, entry) {
    if (id === undefined) throwMissingArgumentError('id')
    validateId(id)

    const targetIndex = this.entries.findIndex(e => e.id === id)
    if (targetIndex === -1) return null

    return this.insertEntryAt(targetIndex, entry, 'before')
  }

  /**
   * Insert a new entry after the specified entry id
   * @param {Integer} id
   * @param {Object} entry
   * @param {Integer} [entry.id] A new one will be automatically generated if
   *                             not set
   * @param {String} entry.title
   * @param {String} entry.description
   * @returns {Integer|null} The id of the new entry if successfully inserted,
   *                         null if the provided entry id is not found so
   *                         nothing is done
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {MissingArgumentError} Argument entry must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   * @throws {ArgumentTypeError} Argument entry must be a plain object with the
   *                             required entry properties
   * @throws {ExistingIdError} If provided, entry.id should not exist already
   */
  insertEntryAfter(id, entry) {
    if (id === undefined) throwMissingArgumentError('id')
    validateId(id)

    const targetIndex = this.entries.findIndex(e => e.id === id)
    if (targetIndex === -1) return null

    return this.insertEntryAt(targetIndex, entry, 'after')
  }

  /**
   * Insert a new entry at the beginning of entries
   * @param {Object} entry
   * @param {Integer} [entry.id] A new one will be automatically generated if
   *                             not set
   * @param {String} entry.title
   * @param {String} entry.description
   * @returns {Integer} The id of the new entry
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument entry must be set
   * @throws {ArgumentTypeError} Argument entry must be a plain object with the
   *                             required entry properties
   * @throws {ExistingIdError} If provided, entry.id should not exist already
   */
  prependEntry(entry) {
    return this.insertEntryAt(0, entry, 'before')
  }

  /**
   * Insert a new entry at the end of entries
   * @param {Object} entry
   * @param {Integer} [entry.id] A new one will be automatically generated if
   *                             not set
   * @param {String} entry.title
   * @param {String} entry.description
   * @returns {Integer} The id of the new entry
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument entry must be set
   * @throws {ArgumentTypeError} Argument entry must be a plain object with the
   *                             required entry properties
   * @throws {ExistingIdError} If provided, entry.id should not exist already
   */
  appendEntry(entry) {
    return this.insertEntryAt(this.entries.length - 1, entry, 'after')
  }

  /**
   * Removes the entry with the specified id.
   * @param {Integer} id
   * @returns {Boolean} true if the entry is found and removed, false of no
   *                    entry is found with the provided id so nothing is done
   * @memberof AetherAccordionController
   * @throws {MissingArgumentError} Argument id must be set
   * @throws {ArgumentTypeError} Argument id must pass validation function
   */
  removeEntry(id) {
    if (id === undefined) throwMissingArgumentError('id')
    validateId(id)

    const startingLength = this.entries.length
    this.entries = this.entries.filter(entry => entry.id !== id)

    if (this.entries.length === startingLength) return false
    this.updateView('removeEntry', id)
    this.emitEvent('removeEntry', {id, result: true})
    return true
  }
}
