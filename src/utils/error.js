/**
 * Adds types to errors
 * @param {String} type What is going to be used to define the error name
 * @returns {Error} The passed error with the specified type name injected
 * @example throw withType.call(new Error(message), 'Custom')
 */
export function withType(type) {
  this.name = `${type}Error`
  return this
}

// CUSTOM THROWERS
// ---

/**
 * Throws MissingArgumentError with an error message which tells what argument
 * is actually missing
 * @param {String} argument Name of the argument
 * @throws {MissingArgumentError}
 */
export const throwMissingArgumentError = argument => {
  const message = `Argument '${argument}' is missing.`
  throw withType.call(new Error(message), 'MissingArgument')
}

/**
 * Throws ArgumentTypeError with an error message which tells what argument
 * with what value is actually an invalid type, and what's the expected one
 * @param {String} argument Name of the argument
 * @param {String} value Value of the argument
 * @param {String} expectedType
 * @throws {ArgumentTypeError}
 */
export const throwArgumentTypeError = (argument, value, expectedType) => {
  const message =
    `Argument '${argument}' with value '${value}' is invalid, ` +
    `expected type is '${expectedType}'.`

  throw withType.call(new Error(message), 'ArgumentType')
}

/**
 * Throws BadArgumentError with an error message which tells what argument
 * with what value is actually invalid, and the reason why
 * @param {String} argument Name of the argument
 * @param {String} value Value of the argument
 * @param {String} reason
 * @throws {BadArgumentError}
 */
export const throwBadArgumentError = (argument, value, reason) => {
  const message =
    `Argument '${argument}' with value '${value}' is invalid, ` +
    `the reason is '${reason}'.`

  throw withType.call(new Error(message), 'BadArgument')
}

/**
 * Throws ExistingIdError with an error message which tells what id is actually
 * repeated
 * @param {Integer} id The repeated id
 * @throws {ExistingIdError}
 */
export const throwExistingIdError = id => {
  const message = `ID '${id}' already exists.`
  throw withType.call(new Error(message), 'ExistingId')
}
