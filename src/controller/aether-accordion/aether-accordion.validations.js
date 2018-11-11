import { throwArgumentTypeError } from "../../utils/error";

// eslint-disable-next-line import/prefer-default-export
export const validateEntries = entries => {
  const expectedType = "array of entries";

  if (!Array.isArray(entries))
    throwArgumentTypeError("entries", entries, expectedType);

  // check for missing keys of each array item
  const allItemsOk = entries.every(
    entry => "id" in entry && "title" in entry && "description" in entry
  );

  if (!allItemsOk) throwArgumentTypeError("entries", entries, expectedType);
};
