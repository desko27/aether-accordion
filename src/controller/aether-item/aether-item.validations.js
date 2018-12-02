import {throwArgumentTypeError} from '../../utils/error'

/**
 * Validate an id
 * @param {Integer} id
 * @throws {ArgumentTypeError} Argument id must be a positive integer
 */
export const validateId = id => {
  if (!Number.isInteger(id) || (Number.isInteger(id) && id < 0))
    throwArgumentTypeError('id', id, 'positive integer')
}

/**
 * Validate a title
 * @param {String} title
 * @throws {ArgumentTypeError} Argument title must be a string
 */
export const validateTitle = title => {
  if (typeof title !== 'string')
    throwArgumentTypeError('title', title, 'string')
}

/**
 * Validate a description
 * @param {String} description
 * @throws {ArgumentTypeError} Argument description must be a string
 */
export const validateDescription = description => {
  if (typeof description !== 'string')
    throwArgumentTypeError('description', description, 'string')
}
