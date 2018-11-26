import initAetherAccordion from '$lib'

export default () => {
  initAetherAccordion({
    element: '.aether-accordion',
    entries: [...new Array(1000).keys()].map(i => ({
      id: i,
      title: `Title #${i + 1}`,
      description: `<p>Description #${i + 1}</p>`
    }))
  })
}
