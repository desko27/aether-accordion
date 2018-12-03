import initAetherAccordion from '$lib'

export default () => {
  initAetherAccordion({
    element: '.aether-accordion',
    activeId: 0,
    entries: [
      {id: 0, title: 'AJAX asset', description: 'ajax:https://api.ipify.org'},
      {id: 1, title: 'Title #1', description: '<p>Description #1</p>'},
      {id: 2, title: 'Title #2', description: '<p>Description #2</p>'},
      {id: 3, title: 'Title #3', description: '<p>Description #3</p>'}
    ]
  })
}
