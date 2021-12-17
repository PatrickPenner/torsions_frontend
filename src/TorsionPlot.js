/**
 * Torsion plot component
 */
class TorsionPlot {
  /**
   * Torsion plot component
   * @param {String} element id of the root element of the table
   * @param {Object} torsionResult current torsion result to visualize
   * @param {Number} availableHeight height to grow to
   * @param {Function} plotCallback
   */
  constructor (element, torsionResult = undefined, availableHeight = 0, plotCallback = undefined) {
    this.element = document.getElementById(element)
    this.csdPlotId = 'csd-plot'
    this.pdbPlotId = 'pdb-plot'
    this.availableHeight = availableHeight
    this.initHtml()
    this.csdPlot = document.getElementById(this.csdPlotId)
    this.pdbPlot = document.getElementById(this.pdbPlotId)
    this.plotCallback = plotCallback
    this.setTorsionResult(torsionResult)
  }

  /**
   * Generate the HTML
   */
  initHtml () {
    this.element.style.height = this.availableHeight + 'px'
    this.element.classList.add('torsion-plot')
    this.element.innerHTML =
`<ul class="nav nav-pills">
    <li class="nav-item">
        <a class="nav-link active" href="#${this.csdPlotId}" data-toggle="tab">CSD Histogram</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="#${this.pdbPlotId}" data-toggle="tab">PDB Histogram</a>
    </li>
</ul>
<div class="tab-content">
    <div class="tab-pane active" id="${this.csdPlotId}">No plot available</div>
    <div class="tab-pane" id="${this.pdbPlotId}">No plot available</div>
</div>`
  }

  /**
   * Set the visualized torsion result
   * @param {Object} torsionResult
   */
  setTorsionResult (torsionResult) {
    if (!torsionResult) {
      this.csdPlot.innerHTML = 'No plot available'
      this.pdbPlot.innerHTML = 'No plot available'
      return
    }
    if (!torsionResult.torsionPattern) {
      this.csdPlot.innerHTML = 'No plot available'
      this.pdbPlot.innerHTML = 'No plot available'
      return
    }
    this.fetchPlot(torsionResult.torsionPattern.csdPlotPath, this.csdPlot, torsionResult.angle)
    this.fetchPlot(torsionResult.torsionPattern.pdbPlotPath, this.pdbPlot, torsionResult.angle)
  }

  /**
   * Fetch a plot from the server
   * @param {String} url url of the plot
   * @param {HTMLElement} plotElement root element of the svg plot
   * @param {Number} angle angle of the torsion result to mark
   */
  async fetchPlot (url, plotElement, angle) {
    if (!this.plotCallback) {
      plotElement.innerHTML = 'No plot available'
      return
    }
    const plot = await this.plotCallback(url)
    if (!plot) {
      plotElement.innerHTML = 'No plot available'
    } else {
      this.loadPlot(plotElement, plot, angle)
    }
  }

  /**
   * Load a plot into the plot element
   * @param {HTMLElement} plotElement root element of the svg plot
   * @param {String} plot svg string of the plot
   * @param {Number} angle angle of the torsion result to mark
   */
  loadPlot (plotElement, plot, angle) {
    plot = plot.replaceAll('id="patch_', 'class="patch_')
      .replaceAll('id="xtick_', 'class="xtick_')
    plotElement.innerHTML = plot
    TorsionPlot.makeAngleLine(plotElement, angle)
    this.resize()
  }

  /**
   * Make a line on the plot for an angle
   * @param {HTMLElement} plotElement
   * @param {Number} angle
   */
  static makeAngleLine (plotElement, angle) {
    const plotEnclosingBox = plotElement.getElementsByClassName('patch_2')[0].children[0]
    const [lowestY, highestY] = Utils.getYBoundsOfPath(plotEnclosingBox)
    const firstXtick = plotElement.getElementsByClassName('xtick_1')[0]
    const firstXtickCoord = parseFloat(firstXtick.getElementsByTagName('use')[0].getAttribute('x'))
    const lastXtick = plotElement.getElementsByClassName('xtick_13')[0]
    const lastXtickCoord = parseFloat(lastXtick.getElementsByTagName('use')[0].getAttribute('x'))
    const xPoint = firstXtickCoord + (lastXtickCoord - firstXtickCoord) / 360 * (angle + 180)
    const lineElement = Utils.makeLine('angle-line', xPoint, xPoint, lowestY, highestY, '#9969BD')
    plotElement.getElementsByTagName('svg')[0].appendChild(lineElement)
  }

  /**
   * Resize the plot
   * @param {Number} availableHeight height to grow to
   */
  resize (availableHeight = undefined) {
    if (availableHeight) {
      this.availableHeight = availableHeight
    }
    const pill = this.element.getElementsByTagName('a')[0]
    const svgs = this.element.getElementsByTagName('svg')
    for (let i = 0; i < svgs.length; i++) {
      svgs[i].style.width = this.element.clientWidth + 'px'
      svgs[i].style.height = (this.availableHeight - pill.clientHeight) + 'px'
    }
  }
}
