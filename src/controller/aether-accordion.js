import {
  throwMissingArgumentError,
  throwArgumentTypeError
} from "../utils/error";
import AetherItemController from "./aether-item";

export default class AetherAccordionController {
  constructor({ entries } = {}) {
    // check for missing arguments
    if (entries === undefined) throwMissingArgumentError("entries");

    // validate incoming arguments
    if (!Array.isArray(entries))
      throwArgumentTypeError("entries", entries, "array");

    // parse entries' data into actual item controllers
    this.entries = entries.map(entry => new AetherItemController(entry));

    // settle other properties into the instance
    this.activeId = null;
  }

  getActiveId() {
    return this.activeId;
  }

  getEntry(id) {
    if (id === undefined) throwMissingArgumentError("id");
    if (!Number.isInteger(id) || (Number.isInteger(id) && id < 0))
      throwArgumentTypeError("id", id, "positive integer");

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
}
