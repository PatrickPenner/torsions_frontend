describe('TabPane', function () {
  beforeEach(function () {
    const element = document.createElement('div')
    element.setAttribute('id', 'tab-pane')
    document.body.appendChild(element)
  })

  afterEach(function () {
    document.getElementById('tab-pane').remove()
  })

  it('should generate tab pane scaffold', function () {
    const tabPane = new TabPane('tab-pane')
    expect(tabPane.tabs).toHaveClass('nav-tabs')
    expect(tabPane.tabs).toHaveClass('nav')
    expect(tabPane.content).toHaveClass('tab-content')
  })

  it('should add a tab', function () {
    const tabPane = new TabPane('tab-pane')

    const content = document.createElement('div')
    content.innerHTML = '<p>Test content please ignore</p>'
    tabPane.addTab('Test', content)

    let navItems = tabPane.tabs.getElementsByClassName('nav-item')
    expect(navItems.length).toEqual(1)
    expect(navItems[0].getElementsByTagName('a')[0]).toHaveClass('active')
    let contentItems = tabPane.content.getElementsByClassName('tab-pane')
    expect(contentItems.length).toEqual(1)
    expect(contentItems[0]).toHaveClass('active')

    const content2 = document.createElement('div')
    content2.innerHTML = '<p>Test content 2 please ignore</p>'
    tabPane.addTab('Test2', content2)

    navItems = tabPane.tabs.getElementsByClassName('nav-item')
    expect(navItems.length).toEqual(2)
    expect(navItems[1].getElementsByTagName('a')[0]).not.toHaveClass('active')
    contentItems = tabPane.content.getElementsByClassName('tab-pane')
    expect(contentItems.length).toEqual(2)
    expect(contentItems[1]).not.toHaveClass('active')
  })

  it('should switch tab on click', function () {
    const tabPane = new TabPane('tab-pane')

    const content = document.createElement('div')
    content.innerHTML = '<p>Test content please ignore</p>'
    tabPane.addTab('Test', content)

    const content2 = document.createElement('div')
    content2.innerHTML = '<p>Test content 2 please ignore</p>'
    tabPane.addTab('Test2', content2)

    const navItems = tabPane.tabs.getElementsByClassName('nav-item')
    const contentItems = tabPane.content.getElementsByClassName('tab-pane')

    let event = new Event('click')
    navItems[1].getElementsByTagName('a')[0].dispatchEvent(event)
    expect(navItems[1].getElementsByTagName('a')[0]).toHaveClass('active')
    expect(contentItems[1]).toHaveClass('active')

    event = new Event('click')
    navItems[0].getElementsByTagName('a')[0].dispatchEvent(event)
    expect(navItems[0].getElementsByTagName('a')[0]).toHaveClass('active')
    expect(contentItems[0]).toHaveClass('active')
  })
})
