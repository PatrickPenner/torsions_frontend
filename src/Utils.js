class Utils {
  /**
   * Add a structure to the ngl viewer. The structure
   * model must have the following members:
   *   structure = {
   *     mol_string: string,
   *     file_type: string ('pdb', 'sdf'),
   *     name: string
   *   }
   *
   * @param {Object} stage NGL stage to add structure to
   * @param {Object} structure structure object
   * @param {String} name name of the structure
   * @returns {Promise<Object>} structure promise
   */
  static addStructure (stage, structure, name = undefined) {
    if (name === undefined) {
      name = structure.name
    }
    structure.fileType = structure.fileType.replace('.', '')
    const blob = new Blob([structure.molString], { type: 'text/plain' })
    return stage.loadFile(
      blob,
      {
        ext: structure.fileType,
        name: name
      })
  }

  /**
   * Capitalize a string
   */
  static capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  /**
   * get the lowest and highest y coordinate of an svg path
   * @param {SVGPathElement} path
   * @returns {Array<Number>} lowestY, highestY
   */
  static getYBoundsOfPath (path) {
    const commands = path.getAttribute('d').split('\n')
    let lowestY
    let highestY = 0
    commands.forEach(function (command) {
      const currentY = parseFloat(command.split(' ')[2])
      if (currentY > highestY) {
        highestY = currentY
      } else if (!lowestY || currentY < lowestY) {
        lowestY = currentY
      }
    })
    return [lowestY, highestY]
  }

  /**
   * Make an svg line element
   * @param {String} id
   * @param {Number} x1
   * @param {Number} x2
   * @param {Number} y1
   * @param {Number} y2
   * @param {String} color
   * @param {String} width
   * @returns {SVGLineElement} line
   */
  static makeLine (id, x1, x2, y1, y2, color, width = '2px') {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('id', id)
    line.setAttribute('x1', x1.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('y2', y2.toString())
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', width)
    return line
  }

  /**
   * Get an order priority for a torsion quality
   * @param {String} quality torsion quality
   * @returns {Number} priority
   */
  static getTorsionQualityOrder (quality) {
    if (quality === 'Strained') {
      return 3
    } else if (quality === 'Tolerable') {
      return 2
    } else if (quality === 'Relaxed') {
      return 1
    }
    return 0
  }

  /**
   * Comparison function for torsion quality ordering
   * @param {String} aQuality first torsion quality
   * @param {String} bQuality second torsion quality
   * @returns {Number} order priority
   */
  static compareTorsionQuality (aQuality, bQuality) {
    const aOrder = Utils.getTorsionQualityOrder(aQuality)
    const bOrder = Utils.getTorsionQualityOrder(bQuality)
    if (aOrder === bOrder) {
      return 0
    }
    return aOrder < bOrder ? 1 : -1
  }

  /**
   * Generate a copy button if the Clipboard API is supported by the browser
   * @param {string} text
   * @returns {string} empty string or copy button
   */
  static conditionalCopyButton (text) {
    // check support for Clipboard API
    try {
      ClipboardItem
    } catch (exception) {
      return ''
    }
    return `<button class="btn-primary copy-button" onClick="Utils.copyToClipboard('${text}')">Copy</button>`
  }

  /**
   * Copy text to clipboard
   * @param {String} text
   */
  static copyToClipboard (text) {
    const blob = new Blob([text], { type: 'text/plain' })
    const clipboardData = new ClipboardItem({ [blob.type]: blob })
    navigator.clipboard.write([clipboardData])
  }
}

// inject custom sort functions into jQuery datatables
jQuery.fn.dataTableExt.oSort['custom-quality-asc'] = function (a, b) {
  return Utils.compareTorsionQuality(a, b)
}

jQuery.fn.dataTableExt.oSort['custom-quality-desc'] = function (a, b) {
  return Utils.compareTorsionQuality(a, b) * -1
}
