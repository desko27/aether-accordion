// node queries getter
export const getNodeQueries = node => {
  const queries = {
    getAllEntryTitleDescriptionNodes: () => node.querySelectorAll(`dt, dd`),
    getEntryNode: id => node.querySelector(`dt[data-id="${id}"]`),
    getEntryTitleNode: id => queries.getEntryNode(id),
    getEntryDescriptionNode: id =>
      queries.getEntryTitleNode(id).nextElementSibling
  };
  return queries;
};

// template getters
export const templates = {
  getEntryTitleTemplate: ({ id, title }) => `
    <dt data-id="${id}">${title}</dt>
  `,
  getEntryDescriptionTemplate: ({ description }) => `
    <dd>${description}</dd>
  `,
  getEntryTemplate: ({ id, title, description }) => `
    ${templates.getEntryTitleTemplate({ id, title })}
    ${templates.getEntryDescriptionTemplate({ description })}
  `
};
