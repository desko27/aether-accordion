import initAetherAccordion from '$lib'

export default () => {
  const accordion = initAetherAccordion({element: 'dl'})

  document.getElementById('get-title').addEventListener('click', () => {
    const activeEntry = accordion.getActive()
    window.alert(activeEntry ? activeEntry.getTitle() : 'No active entry')
  })

  document.getElementById('set-title').addEventListener('click', () => {
    const [firstEntry] = accordion.getEntries()
    if (firstEntry)
      accordion.setEntryTitle(
        firstEntry.getId(),
        window.prompt('Insert new title')
      )
    else window.alert('First entry does not exist!')
  })

  document.getElementById('add-start').addEventListener('click', () => {
    accordion.prependEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })

  document.getElementById('add-end').addEventListener('click', () => {
    accordion.appendEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })

  document.getElementById('add-before-active').addEventListener('click', () => {
    const activeId = accordion.getActiveId()
    if (activeId !== null)
      accordion.insertEntryBefore(activeId, {
        title: 'New entry',
        description: '<p>New description</p>'
      })
    else window.alert('No active entry')
  })

  document.getElementById('add-after-active').addEventListener('click', () => {
    const activeId = accordion.getActiveId()
    if (activeId !== null)
      accordion.insertEntryAfter(activeId, {
        title: 'New entry',
        description: '<p>New description</p>'
      })
    else window.alert('No active entry')
  })

  document.getElementById('remove-second').addEventListener('click', () => {
    const [, secondEntry] = accordion.getEntries()
    if (secondEntry) accordion.removeEntry(secondEntry.getId())
    else window.alert('Second entry does not exist!')
  })

  document.getElementById('activate-last').addEventListener('click', () => {
    const [lastEntry] = [...accordion.getEntries()].reverse()
    if (lastEntry) {
      if (!lastEntry.isActive()) accordion.activateEntry(lastEntry.getId())
      else window.alert('Last entry is already active!')
    } else window.alert('Last entry does not exist!')
  })

  document.getElementById('deactivate-active').addEventListener('click', () => {
    const activeId = accordion.getActiveId()
    if (activeId !== null) accordion.deactivateEntry(activeId)
    else window.alert('No active entry')
  })
}
