import {
  throwMissingArgumentError,
  throwArgumentTypeError
} from '../../utils/error'
import {
  validateId,
  validateTitle,
  validateDescription
} from './aether-item.validations'

/**
 * The entry item or child of AetherAccordion
 * @class AetherItemController
 */
export default class AetherItemController {
  /**
   * Creates an instance of AetherItemController
   * @param {Object} entry Required entry data
   * @param {Integer} entry.id Positive integer
   * @param {String} entry.title
   * @param {String} entry.description
   * @memberof AetherItemController
   * @throws {MissingArgumentError} All entry data must be set
   * @throws {ArgumentTypeError} All entry data must pass validation functions
   */
  constructor({id, title, description} = {}) {
    // check for missing arguments
    if (id === undefined) throwMissingArgumentError('id')
    if (title === undefined) throwMissingArgumentError('title')
    if (description === undefined) throwMissingArgumentError('description')

    // validate incoming arguments
    validateId(id)
    validateTitle(title)
    validateDescription(description)

    // settle properties into the instance
    this.id = id
    this.title = title
    this.description = description
    this.active = false
  }

  /**
   * Get value of id property
   * @returns {Integer} The current id
   * @memberof AetherItemController
   */
  getId() {
    return this.id
  }

  /**
   * Get value of title property
   * @returns {String} The current title
   * @memberof AetherItemController
   */
  getTitle() {
    return this.title
  }

  /**
   * Get value of description property
   * @returns {String} The current description
   * @memberof AetherItemController
   */
  getDescription() {
    return this.description
  }

  /**
   * Check if entry is active
   * @returns {Boolean} true or false whether the entry is active or not
   * @memberof AetherItemController
   */
  isActive() {
    return this.active
  }

  /**
   * Set a new value for title property
   * @param {String|Function} value When a function is provided, the current
   *                                value for title will be passed to the
   *                                function as an argument and the returned
   *                                value will be used
   * @memberof AetherItemController
   * @throws {MissingArgumentError} Argument value must be set
   * @throws {ArgumentTypeError} Argument value must be a string or function
   */
  setTitle(value) {
    if (value === undefined) throwMissingArgumentError('value')

    const type = typeof value
    if (type !== 'string' && type !== 'function')
      throwArgumentTypeError('value', value, 'string or function')

    // direct assignment
    if (type === 'string') {
      validateTitle(value)
      this.title = value
    }
    // assignment through a function
    else {
      const result = value(this.title)
      validateTitle(result)
      this.title = result
    }
  }

  /**
   * Set a new value for description property
   * @param {String|Function} value When a function is provided, the current
   *                                value for description will be passed to the
   *                                function as an argument and the returned
   *                                value will be used
   * @memberof AetherItemController
   * @throws {MissingArgumentError} Argument value must be set
   * @throws {ArgumentTypeError} Argument value must be a string or function
   */
  setDescription(value) {
    if (value === undefined) throwMissingArgumentError('value')

    const type = typeof value
    if (type !== 'string' && type !== 'function')
      throwArgumentTypeError('value', value, 'string or function')

    // direct assignment
    if (type === 'string') {
      validateDescription(value)
      this.description = value
    }
    // assignment through a function
    else {
      const result = value(this.description)
      validateDescription(result)
      this.description = result
    }
  }

  /**
   * Activates the entry by setting true the active property
   * @returns {Boolean} true if active property has changed, false if
   *                    remains the same
   * @memberof AetherItemController
   */
  activate() {
    const prev = this.active
    this.active = true
    return prev !== this.active
  }

  /**
   * Deactivates the entry by setting false the active property
   * @returns {Boolean} true if active property has changed, false if
   *                    remains the same
   * @memberof AetherItemController
   */
  deactivate() {
    const prev = this.active
    this.active = false
    return prev !== this.active
  }
}
