import {
  throwArgumentMissingError,
  throwArgumentTypeError
} from "../utils/error";
import AetherItemController from "./aether-item";

export default class AetherAccordionController {
  constructor({ entries } = {}) {
    // check for missing arguments
    if (entries === undefined) throwArgumentMissingError("entries");

    // validate incoming arguments
    if (!Array.isArray(entries))
      throwArgumentTypeError("entries", entries, "array");

    // parse entries' data into actual item controllers
    this.entries = entries.map(entry => new AetherItemController(entry));

    // settle other properties into the instance
    this.activeId = null;
  }
}
