import {
  throwMissingArgumentError,
  throwExistingIdError
} from '../../utils/error'
import {validateEntries, validateEntry} from './aether-accordion.validations'
import {validateId} from '../aether-item/aether-item.validations'

export default class AetherAccordionController {
  constructor({entries, activeId = null, viewUpdaters = {}} = {}) {
    // check for missing arguments
    if (entries === undefined) throwMissingArgumentError('entries')

    // validate entries and parse them into actual item controllers
    this.entries = validateEntries(entries)

    // settle other properties into the instance
    this.activeId = activeId
    this.viewUpdaters = viewUpdaters

    // trigger init method which updates view
    this.init()
  }

  updateView(funcName, ...args) {
    if (funcName in this.viewUpdaters)
      this.viewUpdaters[funcName](this, ...args)
  }

  init() {
    this.updateView('init')
  }

  getEntries() {
    return this.entries
  }

  getActiveId() {
    return this.activeId
  }

  getActive() {
    if (this.activeId !== null) return this.getEntry(this.activeId)
    return null
  }

  getEntry(id) {
    if (id === undefined) throwMissingArgumentError('id')
    validateId(id)

    const item = this.entries.find(entry => entry.id === id)
    if (!item) return null
    return item
  }

  getEntryTitle(id) {
    const entry = this.getEntry(id)
    const title = entry && entry.getTitle()
    return title || null
  }

  getEntryDescription(id) {
    const entry = this.getEntry(id)
    const description = entry && entry.getDescription()
    return description || null
  }

  setEntryTitle(id, value) {
    if (value === undefined) throwMissingArgumentError('value')
    const entry = this.getEntry(id)
    if (!entry) return false

    entry.setTitle(value)
    this.updateView('setEntryTitle', id, value)
    return true
  }

  setEntryDescription(id, value) {
    if (value === undefined) throwMissingArgumentError('value')
    const entry = this.getEntry(id)
    if (!entry) return false

    entry.setDescription(value)
    this.updateView('setEntryDescription', id, value)
    return true
  }

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

  deactivateEntry(id) {
    const entry = this.getEntry(id)
    if (!entry) return false

    entry.deactivate()
    this.activeId = null
    this.updateView('deactivateEntry', id)
    return true
  }

  insertEntryBefore(id, entry) {
    if (id === undefined) throwMissingArgumentError('id')
    if (entry === undefined) throwMissingArgumentError('entry')

    validateId(id)
    const newEntry = validateEntry(entry)

    if (this.entries.find(e => e.id === entry.id))
      throwExistingIdError(entry.id)

    const targetIndex = this.entries.findIndex(e => e.id === id)
    if (targetIndex === -1) return false

    this.entries.splice(targetIndex, 0, newEntry)
    this.updateView('insertEntryBefore', id, entry)
    return true
  }

  insertEntryAfter(id, entry) {
    if (id === undefined) throwMissingArgumentError('id')
    if (entry === undefined) throwMissingArgumentError('entry')

    validateId(id)
    const newEntry = validateEntry(entry)

    if (this.entries.find(e => e.id === entry.id))
      throwExistingIdError(entry.id)

    const targetIndex = this.entries.findIndex(e => e.id === id)
    if (targetIndex === -1) return false

    this.entries.splice(targetIndex + 1, 0, newEntry)
    this.updateView('insertEntryAfter', id, entry)
    return true
  }

  prependEntry(entry) {
    const firstId = 0
    return this.insertEntryBefore(firstId, entry)
  }

  appendEntry(entry) {
    const {id: lastId} = this.entries[this.entries.length - 1]
    return this.insertEntryAfter(lastId, entry)
  }

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
