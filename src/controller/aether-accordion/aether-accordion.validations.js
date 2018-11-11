import { throwArgumentTypeError } from "../../utils/error";

// eslint-disable-next-line import/prefer-default-export
export const validateEntries = entries => {
  if (!Array.isArray(entries))
    throwArgumentTypeError("entries", entries, "array");
};
