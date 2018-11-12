import {
  throwArgumentTypeError,
  throwExistingIdError
} from "../../utils/error";
import AetherItemController from "../aether-item";

export const validateEntry = (entry, ItemController = AetherItemController) => {
  try {
    return new ItemController(entry);
  } catch (error) {
    const { name } = error;
    if (
      name === "TypeError" ||
      name === "ArgumentTypeError" ||
      name === "MissingArgumentError"
    ) {
      throwArgumentTypeError("entry", entry, "entry data");
    }
    throw error;
  }
};

export const validateEntries = entries => {
  const expectedType = "array of entries";

  if (!Array.isArray(entries))
    throwArgumentTypeError("entries", entries, expectedType);

  // check that all ids are unique
  entries.reduce((checks, entry) => {
    const { id } = entry;
    if (checks[id]) throwExistingIdError(id);
    return {
      ...checks,
      [id]: true
    };
  }, {});

  return entries.map(entry => validateEntry(entry));
};
