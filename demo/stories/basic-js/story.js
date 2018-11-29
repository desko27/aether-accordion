import initAetherAccordion from '$lib'

export default () => {
  initAetherAccordion({
    element: '.aether-accordion',
    entries: [
      {title: 'Title #1', description: '<p>Description #1</p>'},
      {title: 'Title #2', description: '<p>Description #2</p>'},
      {title: 'Title #3', description: '<p>Description #3</p>'},
      {title: 'Title #4', description: '<p>Description #4</p>'}
    ]
  })
}
