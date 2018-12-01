import initAetherAccordion from '$lib'

export default () => {
  const [red, green, blue] = initAetherAccordion({element: 'dl'})

  document.getElementById('get-red-title').addEventListener('click', () => {
    const activeEntry = red.getActive()
    window.alert(activeEntry ? activeEntry.getTitle() : 'No active entry')
  })
  document.getElementById('get-green-title').addEventListener('click', () => {
    const activeEntry = green.getActive()
    window.alert(activeEntry ? activeEntry.getTitle() : 'No active entry')
  })
  document.getElementById('get-blue-title').addEventListener('click', () => {
    const activeEntry = blue.getActive()
    window.alert(activeEntry ? activeEntry.getTitle() : 'No active entry')
  })

  document.getElementById('set-red-title').addEventListener('click', () => {
    const [firstEntry] = red.getEntries()
    if (firstEntry)
      red.setEntryTitle(firstEntry.getId(), window.prompt('Insert new title'))
    else window.alert('First entry does not exist!')
  })
  document.getElementById('set-green-title').addEventListener('click', () => {
    const [firstEntry] = green.getEntries()
    if (firstEntry)
      green.setEntryTitle(firstEntry.getId(), window.prompt('Insert new title'))
    else window.alert('First entry does not exist!')
  })
  document.getElementById('set-blue-title').addEventListener('click', () => {
    const [firstEntry] = blue.getEntries()
    if (firstEntry)
      blue.setEntryTitle(firstEntry.getId(), window.prompt('Insert new title'))
    else window.alert('First entry does not exist!')
  })

  document.getElementById('add-red-start').addEventListener('click', () => {
    red.prependEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })
  document.getElementById('add-green-start').addEventListener('click', () => {
    green.prependEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })
  document.getElementById('add-blue-start').addEventListener('click', () => {
    blue.prependEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })

  document.getElementById('add-red-end').addEventListener('click', () => {
    red.appendEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })
  document.getElementById('add-green-end').addEventListener('click', () => {
    green.appendEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })
  document.getElementById('add-blue-end').addEventListener('click', () => {
    blue.appendEntry({
      title: 'New entry',
      description: '<p>New description</p>'
    })
  })

  document
    .getElementById('add-red-before-active')
    .addEventListener('click', () => {
      const activeId = red.getActiveId()
      if (activeId !== null)
        red.insertEntryBefore(activeId, {
          title: 'New entry',
          description: '<p>New description</p>'
        })
      else window.alert('No active entry')
    })
  document
    .getElementById('add-green-before-active')
    .addEventListener('click', () => {
      const activeId = green.getActiveId()
      if (activeId !== null)
        green.insertEntryBefore(activeId, {
          title: 'New entry',
          description: '<p>New description</p>'
        })
      else window.alert('No active entry')
    })
  document
    .getElementById('add-blue-before-active')
    .addEventListener('click', () => {
      const activeId = blue.getActiveId()
      if (activeId !== null)
        blue.insertEntryBefore(activeId, {
          title: 'New entry',
          description: '<p>New description</p>'
        })
      else window.alert('No active entry')
    })

  document
    .getElementById('add-red-after-active')
    .addEventListener('click', () => {
      const activeId = red.getActiveId()
      if (activeId !== null)
        red.insertEntryAfter(activeId, {
          title: 'New entry',
          description: '<p>New description</p>'
        })
      else window.alert('No active entry')
    })
  document
    .getElementById('add-green-after-active')
    .addEventListener('click', () => {
      const activeId = green.getActiveId()
      if (activeId !== null)
        green.insertEntryAfter(activeId, {
          title: 'New entry',
          description: '<p>New description</p>'
        })
      else window.alert('No active entry')
    })
  document
    .getElementById('add-blue-after-active')
    .addEventListener('click', () => {
      const activeId = blue.getActiveId()
      if (activeId !== null)
        blue.insertEntryAfter(activeId, {
          title: 'New entry',
          description: '<p>New description</p>'
        })
      else window.alert('No active entry')
    })

  document.getElementById('remove-red-second').addEventListener('click', () => {
    const [, secondEntry] = red.getEntries()
    if (secondEntry) red.removeEntry(secondEntry.getId())
    else window.alert('Second entry does not exist!')
  })
  document
    .getElementById('remove-green-second')
    .addEventListener('click', () => {
      const [, secondEntry] = green.getEntries()
      if (secondEntry) green.removeEntry(secondEntry.getId())
      else window.alert('Second entry does not exist!')
    })
  document
    .getElementById('remove-blue-second')
    .addEventListener('click', () => {
      const [, secondEntry] = blue.getEntries()
      if (secondEntry) blue.removeEntry(secondEntry.getId())
      else window.alert('Second entry does not exist!')
    })

  document.getElementById('activate-red-last').addEventListener('click', () => {
    const [lastEntry] = [...red.getEntries()].reverse()
    if (lastEntry) {
      if (!lastEntry.isActive()) red.activateEntry(lastEntry.getId())
      else window.alert('Last entry is already active!')
    } else window.alert('Last entry does not exist!')
  })
  document
    .getElementById('activate-green-last')
    .addEventListener('click', () => {
      const [lastEntry] = [...green.getEntries()].reverse()
      if (lastEntry) {
        if (!lastEntry.isActive()) green.activateEntry(lastEntry.getId())
        else window.alert('Last entry is already active!')
      } else window.alert('Last entry does not exist!')
    })
  document
    .getElementById('activate-blue-last')
    .addEventListener('click', () => {
      const [lastEntry] = [...blue.getEntries()].reverse()
      if (lastEntry) {
        if (!lastEntry.isActive()) blue.activateEntry(lastEntry.getId())
        else window.alert('Last entry is already active!')
      } else window.alert('Last entry does not exist!')
    })

  document
    .getElementById('deactivate-red-active')
    .addEventListener('click', () => {
      const activeId = red.getActiveId()
      if (activeId !== null) red.deactivateEntry(activeId)
      else window.alert('No active entry')
    })
  document
    .getElementById('deactivate-green-active')
    .addEventListener('click', () => {
      const activeId = green.getActiveId()
      if (activeId !== null) green.deactivateEntry(activeId)
      else window.alert('No active entry')
    })
  document
    .getElementById('deactivate-blue-active')
    .addEventListener('click', () => {
      const activeId = blue.getActiveId()
      if (activeId !== null) blue.deactivateEntry(activeId)
      else window.alert('No active entry')
    })
}
