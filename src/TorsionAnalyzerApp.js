const fs = require('fs')
const path = require('path')

/**
 * Central app of the Torsion Analyzer
 */
class TorsionAnalyzerApp {
  /**
   * Central app of the Torsion Analyzer
   * @param {String} element id of the root element of the app
   */
  constructor (element) {
    this.element = document.getElementById(element)
    this.initHtml()
    this.stage = new NGL.Stage('viewport')
    this.torsionAnalyzerWrapper = new TorsionAnalyzerWrapper(__dirname)
    this.tabPane = new TabPane('tab-pane')
    this.generateTabs()
    this.torsionAnalysis = undefined
    this.TABPANE_HEIGHT = 187

    window.addEventListener('resize', (event) => {
      this.onResize(event)
    })
    window.addEventListener('keydown', (event) => {
      this.onKeydown(event)
    })
  }

  /**
   * Generate the HTML
   */
  initHtml () {
    this.element.classList.add('container-fluid')
    this.element.classList.add('h-100')
    this.element.innerHTML =
      `<div class="row h-100">
                <div class="col-sm-6 h-100">
                    <div id="viewport" class="h-100"></div>
                </div>
                <div class="col-sm-6 h-100">
                    <div id="tab-pane" class="h-100"></div>
                </div>
            </div>`
  }

  /**
   * Generate the components and their corresponding tabs
   */
  generateTabs () {
    const uploadFormId = 'upload-form'
    const uploadFormElement = ElementBuilder.generate('div')
      .createChild('h1', 'Upload')
      .appendChild(ElementBuilder.generate('div')
        .setAttribute('id', uploadFormId))
      .addClass('container').element
    this.tabPane.addTab('Load', uploadFormElement)

    const moleculeTableId = 'molecule-table-element'
    const moleculeTableElement = ElementBuilder.generate('div')
      .createChild('h1', 'Molecules')
      .appendChild(ElementBuilder.generate('div')
        .setAttribute('id', moleculeTableId))
      .addClass('container').element
    this.tabPane.addTab('Molecules', moleculeTableElement)

    const torsionResultTableId = 'torsion-result-table-element'
    const torsionResultTableElement = ElementBuilder.generate('div')
      .createChild('h1', 'Torsion Results')
      .appendChild(ElementBuilder.generate('div')
        .setAttribute('id', torsionResultTableId))
      .addClass('container').element
    this.tabPane.addTab('Torsion Results', torsionResultTableElement)

    this.uploadForm = new MoleculeUploadForm(uploadFormId)
    this.uploadForm.uploadForm.addEventListener('submit', (event) => this.handleFile(event))

    const torsionResultsAvailableHeight = this.tabPane.element.clientHeight - this.TABPANE_HEIGHT
    this.torsionResultTable = new TorsionResultsTable(
      torsionResultTableId,
      this.stage,
      undefined,
      torsionResultsAvailableHeight,
      (plotPath) => this.handleReadPlot(plotPath))
    this.tabPane.addRenderFunction('torsion-results', () => {
      this.torsionResultTable.resize(this.tabPane.element.clientHeight - this.TABPANE_HEIGHT)
    })

    const moleculeTableAvailableHeight = this.tabPane.element.clientHeight - this.TABPANE_HEIGHT
    this.moleculeTable = new MoleculeTable(
      moleculeTableId, this.stage, this.torsionResultTable, [], moleculeTableAvailableHeight)
    this.tabPane.addRenderFunction('molecules', () => {
      this.moleculeTable.resize(this.tabPane.element.clientHeight - this.TABPANE_HEIGHT)
    })
  }

  /**
   * Resize the App
   */
  onResize () {
    const moleculeTableAvailableHeight = this.tabPane.element.clientHeight - this.TABPANE_HEIGHT
    this.moleculeTable.resize(moleculeTableAvailableHeight)

    const torsionResultsAvailableHeight = this.tabPane.element.clientHeight - this.TABPANE_HEIGHT
    this.torsionResultTable.resize(torsionResultsAvailableHeight)

    this.stage.viewer.handleResize()
  }

  /**
   * On key down to center the viewer on the current molecule
   * @param event keydown event
   */
  onKeydown (event) {
    if (event.keyCode !== 32) {
      return
    }
    if (this.moleculeTable.highlightedMolecule && this.moleculeTable.highlightedMolecule.component) {
      this.moleculeTable.highlightedMolecule.component.autoView()
    }
  }

  handleFile (event) {
    event.preventDefault()
    const inputPath = this.uploadForm.fileField.files[0].path
    this.torsionAnalyzerWrapper.call(inputPath).then((moleculeData) => {
      this.torsionAnalysis = { molecules: moleculeData }
      this.moleculeTable.setMolecules(this.torsionAnalysis.molecules)
      this.tabPane.switchTab('molecules')
    })
  }

  async handleReadPlot (plotPath) {
    if (!fs.existsSync(plotPath)) {
      return
    }
    return fs.readFileSync(plotPath, 'utf-8')
  }
}
