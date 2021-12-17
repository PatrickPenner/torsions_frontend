/**
 * Wrapper around a datatable for molecules
 */
class MoleculeTable {
  /**
   * Wrapper around a datatable for molecules
   * @param {String} element id of the root element of the table
   * @param {Object} stage NGL stage to interact with
   * @param {TorsionResultsTable} torsionResultsTable table to display the torsion results of the molecules
   * @param {Object} molecules molecules to display
   * @param {Number} availableHeight height to grow to
   */
  constructor (element, stage, torsionResultsTable, molecules = [], availableHeight = 0) {
    this.element = document.getElementById(element)
    this.element.innerHTML = '<table></table>'
    this.tableElement = this.element.getElementsByTagName('table')[0]
    this.availableHeight = availableHeight
    this.stage = stage
    this.torsionResultsTable = torsionResultsTable
    this.molecules = molecules
    this.componentMap = new Map()
    this.highlightedElement = undefined
    this.highlightedMolecule = undefined

    this.table = $(this.tableElement).DataTable({
      retrieve: true,
      info: false,
      paging: false,
      scrollY: this.availableHeight,
      ScrollCollapse: true,
      data: this.molecules,
      autoWidth: false,
      columns: [
        { title: 'Entry', data: 'entryId' },
        { title: 'Name', data: 'name' },
        {
          title: 'Quality',
          data: 'torsionResults',
          sType: 'custom-quality',
          render: function (torsionResults) {
            return MoleculeTable.getWorstQuality(torsionResults)
          }
        }
      ]
    })
    this.element.addEventListener('click', (event) => {
      this.handleTableClicked(event)
    })
    this.initMolecule()
  }

  /**
   * Get the worst quality from a list of torsion results
   * @param {Array} torsionResults
   * @returns {string} worst result as a capitalized string
   */
  static getWorstQuality (torsionResults) {
    let quality = 'No data'
    torsionResults.some(function (torsionResult) {
      if (torsionResult.quality === 'strained') {
        quality = Utils.capitalize(torsionResult.quality)
        return true
      } else if (torsionResult.quality === 'tolerable') {
        quality = Utils.capitalize(torsionResult.quality)
      } else if (quality === 'No data' && torsionResult.quality === 'relaxed') {
        quality = Utils.capitalize(torsionResult.quality)
      }
      return false
    })
    return quality
  }

  /**
   * Event handler for clicks on table rows
   * @param event click event
   */
  handleTableClicked (event) {
    if (event.target.tagName.toLowerCase() !== 'td') {
      return
    }
    const rowElement = event.target.parentElement
    this.applyRow(rowElement)
  }

  /**
   * Apply a datatable row
   * @param {HTMLElement} element element of the row
   */
  applyRow (element) {
    const highlightedElements = this.element.getElementsByClassName('highlight')
    if (highlightedElements.length > 0) {
      for (let i = highlightedElements.length - 1; i >= 0; i--) {
        highlightedElements[i].classList.remove('highlight')
      }
    }
    this.highlightedElement = element
    this.highlightedElement.classList.add('highlight')
    const data = this.table.row(this.highlightedElement).data()
    const entryId = parseInt(this.highlightedElement.children[0].textContent)
    this.loadMolecule(entryId, data)
  }

  /**
   * Set the table molecules
   * @param {Array} molecules
   */
  setMolecules (molecules) {
    this.molecules = molecules
    this.table.clear()
    this.table.rows.add(this.molecules)
    this.table.draw()
    if (this.componentMap.size > 0) {
      for (const [, molecule] of this.componentMap.entries()) {
        this.stage.removeComponent(molecule.component)
      }
    }
    this.componentMap = new Map()
    this.initMolecule()
  }

  /**
   * Initialize the associated molecule in the ngl stage
   */
  initMolecule () {
    if (this.molecules.length > 0) {
      this.highlightedElement = this.element.querySelector('tr.odd, tr.even')
      this.highlightedElement.classList.add('highlight')
      this.loadMolecule(this.molecules[0].entryId, this.molecules[0])
    }
  }

  /**
   * Load a molecules into the viewer
   * @param entryId
   * @param molecule
   */
  loadMolecule (entryId, molecule) {
    this.highlightedMolecule = molecule
    for (const [, molecule] of this.componentMap.entries()) {
      molecule.component.setVisibility(false)
    }
    if (this.componentMap.has(entryId)) {
      this.componentMap.get(entryId).component.setVisibility(true)
      this.torsionResultsTable.setMolecule(molecule)
      molecule.component.autoView()
    } else {
      Utils.addStructure(this.stage, molecule).then((component) => {
        molecule.component = component
        component.addRepresentation('licorice', { multipleBond: true })
        component.autoView()
        this.componentMap.set(entryId, molecule)
        molecule.component.autoView()
        this.torsionResultsTable.setMolecule(molecule)
      })
    }
  }

  /**
   * Resize the table
   * @param {Number} availableHeight height to grow to
   */
  resize (availableHeight = undefined) {
    if (availableHeight) {
      this.availableHeight = availableHeight
    }
    const moleculeTableScrollElement = this.element.getElementsByClassName('dataTables_scrollBody')
    if (moleculeTableScrollElement.length === 1) {
      moleculeTableScrollElement[0].style.height = this.availableHeight + 'px'
    }
    if (this.table) {
      this.table.draw()
    }
  }
}
