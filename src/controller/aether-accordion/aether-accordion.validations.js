import {throwArgumentTypeError, throwExistingIdError} from '../../utils/error'
import AetherItemController from '../aether-item'

/**
 * Validate plain entry object
 * @param {Object} entry
 * @param {Class} [ItemController=AetherItemController]
 * @throws {ArgumentTypeError} Argument entry must be a plain object which
 *                             doesn't throw error when used at ItemController
 *                             constructor
 */
export const validateEntry = (entry, ItemController = AetherItemController) => {
  try {
    return new ItemController(entry)
  } catch (error) {
    const {name} = error
    if (
      name === 'TypeError' ||
      name === 'ArgumentTypeError' ||
      name === 'MissingArgumentError'
    ) {
      throwArgumentTypeError('entry', entry, 'entry data')
    }
    throw error
  }
}

/**
 * Validate array of plain entry objects
 * @param {Array<Object>} entries
 * @throws {ArgumentTypeError} Argument entries must be an array of plain
 *                             objects which doesn't throw error when used at
 *                             ItemController constructor
 * @throws {ExistingIdError} Argument entries must contain entries with
 *                           unique id
 */
export const validateEntries = entries => {
  const expectedType = 'array of entries'

  if (!Array.isArray(entries))
    throwArgumentTypeError('entries', entries, expectedType)

  // check that all ids are unique
  entries.reduce((checks, entry) => {
    const {id} = entry
    if (checks[id]) throwExistingIdError(id)
    return {
      ...checks,
      [id]: true
    }
  }, {})

  return entries.map(entry => validateEntry(entry))
}
