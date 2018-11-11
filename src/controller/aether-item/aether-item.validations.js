import { throwArgumentTypeError } from "../../utils/error";

export const validateId = id => {
  if (!Number.isInteger(id) || (Number.isInteger(id) && id < 0))
    throwArgumentTypeError("id", id, "positive integer");
};

export const validateTitle = title => {
  if (typeof title !== "string")
    throwArgumentTypeError("title", title, "string");
};

export const validateDescription = description => {
  if (typeof description !== "string")
    throwArgumentTypeError("description", description, "string");
};
