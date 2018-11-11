import {
  throwMissingArgumentError,
  throwArgumentTypeError
} from "../../utils/error";
import {
  validateId,
  validateTitle,
  validateDescription
} from "./aether-item.validations";

export default class AetherItemController {
  constructor({ id, title, description } = {}) {
    // check for missing arguments
    if (id === undefined) throwMissingArgumentError("id");
    if (title === undefined) throwMissingArgumentError("title");
    if (description === undefined) throwMissingArgumentError("description");

    // validate incoming arguments
    validateId(id);
    validateTitle(title);
    validateDescription(description);

    // settle properties into the instance
    this.id = id;
    this.title = title;
    this.description = description;
    this.active = false;
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  isActive() {
    return this.active;
  }

  setTitle(value) {
    if (value === undefined) throwMissingArgumentError("value");

    const type = typeof value;
    if (type !== "string" && type !== "function")
      throwArgumentTypeError("value", value, "string or function");

    // direct assignment
    if (type === "string") {
      validateTitle(value);
      this.title = value;
    }
    // assignment through a function
    else {
      const result = value(this.title);
      validateTitle(result);
      this.title = result;
    }
  }

  setDescription(value) {
    if (value === undefined) throwMissingArgumentError("value");

    const type = typeof value;
    if (type !== "string" && type !== "function")
      throwArgumentTypeError("value", value, "string or function");

    // direct assignment
    if (type === "string") {
      validateDescription(value);
      this.description = value;
    }
    // assignment through a function
    else {
      const result = value(this.description);
      validateDescription(result);
      this.description = result;
    }
  }

  activate() {
    const prev = this.active;
    this.active = true;
    return prev !== this.active;
  }

  deactivate() {
    const prev = this.active;
    this.active = false;
    return prev !== this.active;
  }
}
