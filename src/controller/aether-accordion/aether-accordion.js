import {
  throwMissingArgumentError,
  throwExistingIdError
} from "../../utils/error";
import { validateEntries, validateEntry } from "./aether-accordion.validations";
import { validateId } from "../aether-item/aether-item.validations";

export default class AetherAccordionController {
  constructor({ entries, activeId = null } = {}) {
    // check for missing arguments
    if (entries === undefined) throwMissingArgumentError("entries");

    // validate entries and parse them into actual item controllers
    this.entries = validateEntries(entries);

    // settle other properties into the instance
    this.activeId = activeId;
  }

  getEntries() {
    return this.entries;
  }

  getActiveId() {
    return this.activeId;
  }

  getActive() {
    if (this.activeId) return this.getEntry(this.activeId);
    return null;
  }

  getEntry(id) {
    if (id === undefined) throwMissingArgumentError("id");
    validateId(id);

    const item = this.entries.find(entry => entry.id === id);
    if (!item) return null;
    return item;
  }

  getEntryTitle(id) {
    const title = this.getEntry(id)?.getTitle();
    return title || null;
  }

  getEntryDescription(id) {
    const description = this.getEntry(id)?.getDescription();
    return description || null;
  }

  setEntryTitle(id, value) {
    if (value === undefined) throwMissingArgumentError("value");
    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.setTitle(value);
    return true;
  }

  setEntryDescription(id, value) {
    if (value === undefined) throwMissingArgumentError("value");
    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.setDescription(value);
    return true;
  }

  activateEntry(id) {
    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.activate();
    return true;
  }

  deactivateEntry(id) {
    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.deactivate();
    return true;
  }

  insertEntryBefore(id, entry) {
    if (id === undefined) throwMissingArgumentError("id");
    if (entry === undefined) throwMissingArgumentError("entry");

    validateId(id);
    const newEntry = validateEntry(entry);

    if (this.entries.find(e => e.id === entry.id))
      throwExistingIdError(entry.id);

    const targetIndex = this.entries.findIndex(e => e.id === id);
    if (targetIndex === -1) return false;

    this.entries.splice(targetIndex, 0, newEntry);
    return true;
  }

  insertEntryAfter(id, entry) {
    if (id === undefined) throwMissingArgumentError("id");
    if (entry === undefined) throwMissingArgumentError("entry");

    validateId(id);
    const newEntry = validateEntry(entry);

    if (this.entries.find(e => e.id === entry.id))
      throwExistingIdError(entry.id);

    const targetIndex = this.entries.findIndex(e => e.id === id);
    if (targetIndex === -1) return false;

    this.entries.splice(targetIndex + 1, 0, newEntry);
    return true;
  }

  prependEntry(entry) {
    const firstId = 0;
    return this.insertEntryBefore(firstId, entry);
  }

  appendEntry(entry) {
    const [{ id: lastId }] = [...this.entries].reverse();
    return this.insertEntryAfter(lastId, entry);
  }

  removeEntry(id) {
    if (id === undefined) throwMissingArgumentError("id");
    validateId(id);

    const startingLength = this.entries.length;
    this.entries = this.entries.filter(entry => entry.id !== id);

    if (this.entries.length < startingLength) return true;
    return false;
  }
}
