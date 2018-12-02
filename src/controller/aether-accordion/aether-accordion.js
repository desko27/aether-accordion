import {
  throwMissingArgumentError,
  throwArgumentTypeError,
  throwBadArgumentError,
  throwExistingIdError
} from '../../utils/error'
import {validateEntries, validateEntry} from './aether-accordion.validations'
import {validateId} from '../aether-item/aether-item.validations'

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
      !entries.every(entry => typeof entry.id === 'number') &&
      !entries.every(entry => entry.id === undefined)
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

    // actually mark the activeId entry as active if any
    if (activeId !== null) this.getEntry(activeId).activate()

    // trigger init method which updates view
    this.init()
  }

  /**
   * Runs the specified viewUpdaters function only if exists
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
   * Initializing hook for first view rendering
   * @memberof AetherAccordionController
   */
  init() {
    this.updateView('init')
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
    return true
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
    if (entry === undefined) throwMissingArgumentError('entry')
    if (typeof entry !== 'object' || entry === null)
      throwArgumentTypeError('entry', entry, 'object')
    validateId(id)

    if (entry.id === undefined) entry.id = this.getNewId()
    const newEntry = validateEntry(entry)

    if (this.entries.find(e => e.id === entry.id))
      throwExistingIdError(entry.id)

    const targetIndex = this.entries.findIndex(e => e.id === id)
    if (targetIndex === -1) return null

    this.entries.splice(targetIndex, 0, newEntry)
    this.updateView('insertEntryBefore', id, entry)
    return newEntry.getId()
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
    if (entry === undefined) throwMissingArgumentError('entry')
    if (typeof entry !== 'object' || entry === null)
      throwArgumentTypeError('entry', entry, 'object')
    validateId(id)

    if (entry.id === undefined) entry.id = this.getNewId()
    const newEntry = validateEntry(entry)

    if (this.entries.find(e => e.id === entry.id))
      throwExistingIdError(entry.id)

    const targetIndex = this.entries.findIndex(e => e.id === id)
    if (targetIndex === -1) return null

    this.entries.splice(targetIndex + 1, 0, newEntry)
    this.updateView('insertEntryAfter', id, entry)
    return newEntry.getId()
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
    const {id: firstId} = this.entries[0]
    return this.insertEntryBefore(firstId, entry)
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
    const {id: lastId} = this.entries[this.entries.length - 1]
    return this.insertEntryAfter(lastId, entry)
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
    return true
  }
}
