/**
 * Tab pane component
 */
class TabPane {
  /**
   * Tab pane component
   * @param {String} element id of the root element of the table
   */
  constructor (element) {
    this.element = document.getElementById(element)
    this.initHtml()
    this.tabs = this.element.getElementsByClassName('nav')[0]
    this.content = this.element.getElementsByClassName('tab-content')[0]
    this.firstTab = true
    this.renderFunctions = new Map()
  }

  /**
   * Generate the HTML
   */
  initHtml () {
    this.element.innerHTML =
      `<ul class="nav nav-tabs">
</ul>
<div class="tab-content">
</div>`
  }

  /**
   *
   * Add a tab to the tab pane with the following HTML.
   * tab:
   * <li class="nav-item">
   *     <a class="nav-link active" id="{{ idString + '-tab' }} href="{{ idString }}">Active</a>
   * </li>
   *
   * content:
   * <div class="tab-pane active" id="{{ idString}}">
   *     {{ content }}
   * </div>
   *
   *
   * @param {String} title title of the tab
   * @param {HTMLElement} content content of the tab
   */
  addTab (title, content = undefined) {
    const idString = title.toLowerCase().replace(' ', '-')
    this.tabs.appendChild(ElementBuilder.generate('li')
      .addClass('nav-item')
      .appendChild(ElementBuilder.generate('a', title)
        .addClass('nav-link')
        .setAttribute('id', idString + '-tab')
        .setAttribute('href', 'javascript:void(0)')
        .setAttribute('target', idString)
        .addListener('click', (event) => { this.handleTabClicked(event) })).element)
    this.content.appendChild(ElementBuilder.generate('div')
      .addClass('tab-pane')
      .setAttribute('id', idString)
      .element)
    if (content) {
      document.getElementById(idString).appendChild(content)
    }
    if (this.firstTab) {
      document.getElementById(idString + '-tab').classList.add('active')
      document.getElementById(idString).classList.add('active')
      this.firstTab = false
    }
  }

  /**
   * Handle tab clicked
   * @param event click event
   */
  handleTabClicked (event) {
    event.preventDefault()
    if (event.target.classList.contains('active')) {
      return
    }
    const id = event.target.getAttribute('target')
    if (id && id !== '_blank') {
      this.switchTab(id)
    }
  }

  /**
   * Switch to a tab
   * @param {String} id id of the tab to switch to
   */
  switchTab (id) {
    if (id === 'help') {
      return
    }
    const tabId = id + '-tab'
    this.tabs.getElementsByClassName('active')[0].classList.remove('active')
    this.content.getElementsByClassName('active')[0].classList.remove('active')
    document.getElementById(tabId).classList.add('active')
    document.getElementById(id).classList.add('active')
    this.callRenderFunctions(id)
  }

  /**
   * Add a custom function that runs after a tab is rendered
   * @param id id of the tab
   * @param callback
   */
  addRenderFunction (id, callback) {
    if (!this.renderFunctions.has(id)) {
      this.renderFunctions.set(id, [])
    }
    this.renderFunctions.get(id).push(callback)
  }

  /**
   * Call render the function(s) of a tab
   * @param id id of the tab
   */
  callRenderFunctions (id) {
    if (!this.renderFunctions.has(id)) {
      return
    }
    this.renderFunctions.get(id).forEach((callback) => callback())
  }
}
