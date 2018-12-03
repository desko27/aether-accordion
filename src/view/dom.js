import loadingSvg from './loading.svg.js'

// node queries getter
export const getNodeQueries = node => {
  const queries = {
    getAllEntryTitleDescriptionNodes: () =>
      [...node.querySelectorAll(`dt, dd`)].filter(n => n.parentNode === node),
    getEntryNode: id =>
      [...node.querySelectorAll(`dt[data-id="${id}"]`)].find(
        n => n.parentNode === node
      ),
    getEntryNodeAt: index =>
      [...node.querySelectorAll(`dt:nth-child(${1 + index * 2})`)].find(
        n => n.parentNode === node
      ),
    getEntryTitleNode: id => queries.getEntryNode(id),
    getEntryTitleNodeAt: index => queries.getEntryNodeAt(index),
    getEntryDescriptionNode: id =>
      queries.getEntryTitleNode(id).nextElementSibling,
    getEntryDescriptionNodeAt: index =>
      queries.getEntryTitleNodeAt(index).nextElementSibling
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

// extras
export const loadingTemplate = `<img src="${loadingSvg}" />`
