import initAetherAccordion from '$lib'

export default () => {
  const accordion = initAetherAccordion({element: 'dl'})

  accordion.on('activateEntry', ({id}) =>
    window.alert(`Item #${id} activated!`)
  )
  accordion.on('deactivateEntry', ({id}) =>
    window.alert(`Item #${id} deactivated!`)
  )
}
