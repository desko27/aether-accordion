import {
  throwMissingArgumentError,
  throwArgumentTypeError
} from "../../utils/error";

export default class AetherItemController {
  constructor({ id, title, description } = {}) {
    // check for missing arguments
    if (id === undefined) throwMissingArgumentError("id");
    if (title === undefined) throwMissingArgumentError("title");
    if (description === undefined) throwMissingArgumentError("description");

    // validate incoming arguments
    if (!Number.isInteger(id) || (Number.isInteger(id) && id < 0))
      throwArgumentTypeError("id", id, "positive integer");
    if (typeof title !== "string")
      throwArgumentTypeError("title", title, "string");
    if (typeof description !== "string")
      throwArgumentTypeError("description", description, "string");

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
    if (type === "string") this.title = value;
    // assignment through a function
    else this.title = value(this.title);
  }

  setDescription(value) {
    if (value === undefined) throwMissingArgumentError("value");

    const type = typeof value;
    if (type !== "string" && type !== "function")
      throwArgumentTypeError("value", value, "string or function");

    // direct assignment
    if (type === "string") this.description = value;
    // assignment through a function
    else this.description = value(this.description);
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
