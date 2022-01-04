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
    // TODO edit in deployment
    this.baseUrl = 'http://localhost:8000'
    this.initHtml()
    this.stage = new NGL.Stage('viewport')
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
    this.stage.signals.clicked.add((pickingProxy) => {
      this.handleTorsionMarkerClicked(pickingProxy)
    })
  }

  /**
   * Generate the HTML
   */
  initHtml () {
    this.element.classList.add('container-fluid')
    this.element.classList.add('flex-grow-1')
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
    this.tabPane.addTab('Upload', uploadFormElement)

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

    // help tab with link to help.html
    this.tabPane.addTab('Help')
    const helpTab = document.getElementById('help-tab')
    helpTab.addEventListener('click', (_event) => {
      window.open(this.baseUrl + '/help.html')
    })

    this.uploadForm = new MoleculeUploadForm(uploadFormId)
    this.uploadForm.uploadForm.addEventListener('submit', (event) => {
      this.handleUploadedFile(event)
    })

    const torsionResultsAvailableHeight = this.tabPane.element.clientHeight - this.TABPANE_HEIGHT
    this.torsionResultTable = new TorsionResultsTable(
      torsionResultTableId,
      this.stage,
      undefined,
      torsionResultsAvailableHeight,
      (url) => this.handleDownloadPlot(url))
    this.tabPane.addRenderFunction('torsion-results', () => {
      this.torsionResultTable.resize(this.tabPane.element.clientHeight - this.TABPANE_HEIGHT)
    })

    const moleculeTableAvailableHeight = this.tabPane.element.clientHeight - this.TABPANE_HEIGHT
    this.moleculeTable = new MoleculeTable(
      moleculeTableId,
      this.stage,
      this.torsionResultTable,
      [],
      moleculeTableAvailableHeight,
      (event) => this.handleDownloadFile(event))
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

  /**
   * Handle a file upload
   * @param event submit event
   */
  handleUploadedFile (event) {
    event.preventDefault()
    $('#tab-pane').loading()
    const file = this.uploadForm.fileField.files[0]
    const formData = new FormData()
    formData.append('molFile', file)
    this.upload(formData)
  }

  /**
   * Upload a file to the server and process the response
   * @param formData form data containing the file
   */
  upload (formData) {
    const tabPane = $('#tab-pane')
    fetch(this.baseUrl + '/torsion_analysis', {
      method: this.uploadForm.uploadForm.getAttribute('method'),
      body: formData
    }).then((response) => {
      if (response.status >= 500) {
        alert('Encountered an internal server error.')
        tabPane.loading('stop')
        return
      }
      response.json().then((json) => {
        if (response.status >= 400) {
          alert(json.error)
          tabPane.loading('stop')
          return
        }
        this.poll(json.id, (data) => {
          this.torsionAnalysis = data
          this.moleculeTable.setMolecules(this.torsionAnalysis.molecules)
          this.tabPane.switchTab('molecules')
        })
      })
    })
  }

  /**
   * Poll the server until it responds with a successful/failed torsion analysis
   * @param id id of the torsion analysis
   * @param callback success callback function
   */
  poll (id, callback) {
    const tabPane = $('#tab-pane')
    fetch(this.baseUrl + '/torsion_analysis/' + id, { method: 'get' })
      .then((response) => {
        if (response.status >= 500) {
          alert('Encountered an internal server error.')
          tabPane.loading('stop')
          return
        }
        response.json().then((json) => {
          if (response.status >= 400) {
            alert(json.error)
            tabPane.loading('stop')
            return
          }
          if (json.status === 'pending' || json.status === 'running') {
            setTimeout(() => { this.poll(id, callback) }, 3000)
          } else if (json.status === 'failure') {
            alert('Torsion analysis failed')
            tabPane.loading('stop')
          } else if (json.status === 'success') {
            tabPane.loading('stop')
            callback(json)
          }
        })
      })
  }

  /**
   * Handle download of the torsion analysis
   * @param event click event
   */
  handleDownloadFile (event) {
    event.stopImmediatePropagation()
    if (this.torsionAnalysis.id) {
      window.open(this.baseUrl + '/torsion_analysis/' + this.torsionAnalysis.id + '/download')
    } else {
      alert('No torsion analysis to download')
    }
  }

  /**
   * Handle download of a plot
   * @param url url of the plot
   * @returns {String | undefined} plot as an svg string
   */
  async handleDownloadPlot (url) {
    const response = await fetch(this.baseUrl + url)
    if (response.status !== 200) {
      return undefined
    }
    return await response.text()
  }

  /**
   * Switch to torsion results when a torsion bond is clicked
   * @param pickingProxy
   */
  handleTorsionMarkerClicked (pickingProxy) {
    if (!pickingProxy || !pickingProxy.cylinder) {
      return
    }
    if (this.tabPane.currentTab !== 'torsion-results') {
      this.tabPane.switchTab('torsion-results')
    }
  }
}
