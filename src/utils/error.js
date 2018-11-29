/**
 * Adds types to errors
 * @param type The string which is going to be used to define the error name.
 * @returns The passed error with the specified type name injected.
 * @example throw withType.call(new Error(message), 'Custom')
 */
export function withType(type) {
  this.name = `${type}Error`
  return this
}

// CUSTOM THROWERS
// ---

export const throwMissingArgumentError = argument => {
  const message = `Argument '${argument}' is missing.`
  throw withType.call(new Error(message), 'MissingArgument')
}

export const throwArgumentTypeError = (argument, value, expectedType) => {
  const message =
    `Argument '${argument}' with value '${value}' is invalid, ` +
    `expected type is '${expectedType}'.`

  throw withType.call(new Error(message), 'ArgumentType')
}

export const throwBadArgumentError = (argument, value, reason) => {
  const message =
    `Argument '${argument}' with value '${value}' is invalid, ` +
    `the reason is '${reason}'.`

  throw withType.call(new Error(message), 'ArgumentType')
}

export const throwExistingIdError = id => {
  const message = `ID '${id}' already exists.`
  throw withType.call(new Error(message), 'ExistingId')
}
