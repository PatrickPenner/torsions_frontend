/**
 * Builder pattern around javascript DOM element creation
 */
class ElementBuilder {
  /**
   * Builder pattern around javascript DOM element creation
   * @param {String} element tag of the element to create
   * @param {String} text inner text of the element
   * @param {Boolean} display whether to display the element
   */
  constructor (element, text = undefined, display = true) {
    this.element = document.createElement(element)
    if (text) {
      this.element.innerHTML = text
    }
    this.element.style.display = display ? '' : 'none'
  }

  /**
   * Add a class to an element
   * @param {String} className name of the class to add
   * @returns {ElementBuilder}
   */
  addClass (className) {
    this.element.classList.add(className)
    return this
  }

  /**
   * Add a listener to an element
   * @param {String} listener event to listen to
   * @param {Function} callback event handling callback function
   * @returns {ElementBuilder}
   */
  addListener (listener, callback) {
    this.element.addEventListener(listener, callback)
    return this
  }

  /**
   * Set an attribute of an element
   * @param {String} attribute name of the attribute
   * @param {String} value value of the attribute
   * @returns {ElementBuilder}
   */
  setAttribute (attribute, value) {
    this.element.setAttribute(attribute, value)
    return this
  }

  /**
   * Append a child to the element
   * @param {ElementBuilder} child ElementBuilder for the child
   * @returns {ElementBuilder}
   */
  appendChild (child) {
    this.element.appendChild(child.element)
    return this
  }

  /**
   * Create child for this element
   * @param {String} element tag of the child element to create
   * @param {String} text inner text of the child element
   * @param {Boolean} display whether to display the child element
   * @returns {ElementBuilder}
   */
  createChild (element, text, display = true) {
    const wrapper = new ElementBuilder(element, text, display)
    this.appendChild(wrapper)
    return this
  }

  /**
   * Generate a DOM element
   * @param {String} element tag of the child element to create
   * @param {String} text inner text of the child element
   * @param {Boolean} display whether to display the child element
   * @returns {ElementBuilder}
   */
  static generate (element, text = undefined, display = true) {
    return new ElementBuilder(element, text, display)
  }
}
