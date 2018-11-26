import initAetherAccordion from '../../src'

export default {
  html: `<dl class="aether-accordion" />`,
  init: () => {
    initAetherAccordion({
      element: '.aether-accordion',
      entries: [
        {id: 0, title: 'Title #1', description: '<p>Description #1</p>'},
        {id: 1, title: 'Title #2', description: '<p>Description #2</p>'},
        {id: 2, title: 'Title #3', description: '<p>Description #3</p>'},
        {id: 3, title: 'Title #4', description: '<p>Description #4</p>'}
      ]
    })
  }
}
