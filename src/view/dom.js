// node queries getter
export const getNodeQueries = node => {
  const queries = {
    getAllEntryTitleDescriptionNodes: () =>
      [...node.querySelectorAll(`dt, dd`)].filter(n => n.parentNode === node),
    getEntryNode: id =>
      [...node.querySelectorAll(`dt[data-id="${id}"]`)].find(
        n => n.parentNode === node
      ),
    getEntryTitleNode: id => queries.getEntryNode(id),
    getEntryDescriptionNode: id =>
      queries.getEntryTitleNode(id).nextElementSibling
  }
  return queries
}

// template getters
export const templates = {
  getEntryTitleTemplate: ({id, title, active}) => `
    <dt data-id="${id}" ${active ? 'class="is-active"' : ''}>${title}</dt>
  `,
  getEntryDescriptionTemplate: ({description}) => `
    <dd>${description}</dd>
  `,
  getEntryTemplate: ({id, title, description, active}) => `
    ${templates.getEntryTitleTemplate({id, title, active})}
    ${templates.getEntryDescriptionTemplate({description, active})}
  `
}
