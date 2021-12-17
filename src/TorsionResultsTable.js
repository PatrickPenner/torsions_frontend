/**
 * Wrapper around a datatable for torsion results
 */
class TorsionResultsTable {
  /**
   * Wrapper around a datatable for torsion results
   * @param {String} element id of the root element of the app
   * @param {Object} stage NGL stage to interact with
   * @param {Object} molecule current molecule
   * @param {Number} availableHeight height to grow to
   * @param {Function} plotCallback callback to retrieve plots
   */
  constructor (element, stage, molecule = undefined, availableHeight = 0, plotCallback = undefined) {
    this.element = document.getElementById(element)
    this.element.innerHTML = '<div id="torsion-plot"></div><table></table>'
    this.availableHeight = availableHeight
    this.torsionPlot = new TorsionPlot('torsion-plot', undefined, this.availableHeight * 2 / 3, plotCallback)
    this.tableElement = this.element.getElementsByTagName('table')[0]
    this.stage = stage
    this.molecule = molecule
    this.resultComponentMap = new Map()
    this.highlightedBond = undefined

    this.table = $(this.tableElement).DataTable({
      retrieve: true,
      info: false,
      paging: false,
      scrollY: this.availableHeight / 3,
      ScrollCollapse: true,
      data: this.molecule ? this.molecule.torsionResults : [],
      autoWidth: false,
      columns: [
        { title: 'ID', data: 'id' },
        { title: 'Angle', data: 'angle', render: (angle) => angle.toFixed(2) },
        {
          title: 'Quality',
          data: 'quality',
          sType: 'custom-quality',
          render: (quality) => Utils.capitalize(quality)
        },
        {
          title: 'Matched Pattern',
          data: 'patternHierarchy',
          render: (hierarchy) => {
            const pattern = hierarchy.split('|')[0]
            return `<button class="btn-primary copy-button" onclick="Utils.copyToClipboard('${pattern}')">
    Copy
</button>
${pattern}`
          }
        }
      ]
    })
    this.element.addEventListener('click', (event) => {
      this.handleTableClicked(event)
    })
    this.stage.signals.clicked.add((pickingProxy) => {
      this.handleTorsionMarkerClicked(pickingProxy)
    })
    this.initTorsionMarkers()
  }

  /**
   * Set the current molecule
   * @param {Object} molecule
   */
  setMolecule (molecule) {
    this.molecule = molecule
    this.table.clear()
    this.table.rows.add(this.molecule.torsionResults)
    this.table.draw()
    for (const [, results] of this.resultComponentMap.entries()) {
      for (const [, result] of results.entries()) {
        result.torsionMarker.remove()
      }
    }
    this.resultComponentMap = new Map()
    this.initTorsionMarkers()
  }

  /**
   * Initialize torsion markers
   */
  initTorsionMarkers () {
    if (this.molecule) {
      for (const [, results] of this.resultComponentMap.entries()) {
        for (const [, result] of results.entries()) {
          result.torsionMarker.setVisibility(false)
        }
      }
      if (!this.resultComponentMap.has(this.molecule.id)) {
        const results = new Map()

        const nglStructure = this.molecule.component.structure
        this.molecule.torsionResults.forEach(result => {
          result.torsionMarker = new TorsionMarker(nglStructure, result, this.stage)
          results.set(result.id, result)
        })
        this.resultComponentMap.set(this.molecule.id, results)
      }
      for (const [, result] of this.resultComponentMap.get(this.molecule.id).entries()) {
        result.torsionMarker.setVisibility(true)
      }
      const rowElement = this.element.querySelector('tr.odd, tr.even')
      this.applyRow(rowElement)
    }
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
   * Event handler for clicks on the torsion markers
   * @param pickingProxy
   */
  handleTorsionMarkerClicked (pickingProxy) {
    if (!pickingProxy || !pickingProxy.cylinder) {
      return
    }
    const id = pickingProxy.cylinder.name.split(' ').pop()
    const rows = this.element.getElementsByTagName('tr')
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].children[0].textContent === id) {
        this.applyRow(rows[i])
        break
      }
    }
  }

  /**
   * Apply a datatable row
   * @param {HTMLElement} element elemente of the row
   */
  applyRow (element) {
    const highlightedElements = this.element.getElementsByClassName('highlight')
    if (highlightedElements.length > 0) {
      for (let i = highlightedElements.length - 1; i >= 0; i--) {
        highlightedElements[i].classList.remove('highlight')
      }
    }
    if (this.highlightedBond) {
      this.highlightedBond.setHighlight(false)
    }
    const rowText = element.getElementsByTagName('td')[0].innerText
    if (rowText === 'No data available in table') {
      this.torsionPlot.setTorsionResult(undefined)
      return
    }
    const resultId = parseInt(rowText)
    element.classList.add('highlight')
    const result = this.resultComponentMap.get(this.molecule.id).get(resultId)
    this.highlightedBond = result.torsionMarker
    this.highlightedBond.setHighlight(true)
    this.torsionPlot.setTorsionResult(result)
  }

  /**
   * Resize the table
   * @param availableHeight height to grow to
   */
  resize (availableHeight = undefined) {
    if (availableHeight) {
      this.availableHeight = availableHeight
    }
    const torsionResultsScrollElement = this.element.getElementsByClassName('dataTables_scrollBody')
    if (torsionResultsScrollElement.length === 1) {
      torsionResultsScrollElement[0].style.height = this.availableHeight / 3 + 'px'
    }
    if (this.table) {
      this.table.draw()
    }
    this.torsionPlot.resize(this.availableHeight * 2 / 3)
  }
}
