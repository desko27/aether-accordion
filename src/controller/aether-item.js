import {
  throwArgumentMissingError,
  throwArgumentTypeError
} from "../utils/error";

export default class AetherItemController {
  constructor({ id, title, description } = {}) {
    // check for missing arguments
    if (id === undefined) throwArgumentMissingError("id");
    if (title === undefined) throwArgumentMissingError("title");
    if (description === undefined) throwArgumentMissingError("description");

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
  }
}
