import { throwMissingArgumentError } from "../../utils/error";
import { validateEntries } from "./aether-accordion.validations";
import { validateId } from "../aether-item/aether-item.validations";
import AetherItemController from "../aether-item";

export default class AetherAccordionController {
  constructor({ entries, activeId = null } = {}) {
    // check for missing arguments
    if (entries === undefined) throwMissingArgumentError("entries");

    // validate incoming arguments
    validateEntries(entries);

    // parse entries' data into actual item controllers
    this.entries = entries.map(entry => new AetherItemController(entry));

    // settle other properties into the instance
    this.activeId = activeId;
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
    if (id === undefined) throwMissingArgumentError("id");
    if (value === undefined) throwMissingArgumentError("value");

    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.setTitle(value);
    return true;
  }

  setEntryDescription(id, value) {
    if (id === undefined) throwMissingArgumentError("id");
    if (value === undefined) throwMissingArgumentError("value");

    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.setDescription(value);
    return true;
  }

  activateEntry(id) {
    if (id === undefined) throwMissingArgumentError("id");

    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.activate();
    return true;
  }

  deactivateEntry(id) {
    if (id === undefined) throwMissingArgumentError("id");

    const entry = this.getEntry(id);
    if (!entry) return false;

    entry.deactivate();
    return true;
  }
}
