/**
 * Adds types to errors
 * @param type The string which is going to be used to define the error name.
 * @returns The passed error with the specified type name injected.
 * @example throw new Error("This is an error")::withType("Custom");
 */
export function withType(type) {
  this.name = `${type}Error`;
  return this;
}

// CUSTOM THROWERS
// ---

export const throwMissingArgumentError = argument => {
  const message = `Argument '${argument}' is missing.`;
  throw new Error(message)::withType("MissingArgument");
};

export const throwArgumentTypeError = (argument, value, expectedType) => {
  const message =
    `Argument '${argument}' with value '${value}' is invalid, ` +
    `expected type is '${expectedType}'.`;

  throw new Error(message)::withType("ArgumentType");
};

export const throwExistingIdError = id => {
  const message = `ID '${id}' already exists.`;
  throw new Error(message)::withType("ExistingId");
};

export const throwIndexOutOfBoundsError = index => {
  const message = `Index ${index} is out of bounds.`;
  throw new Error(message)::withType("IndexOutOfBounds");
};
