import {
  throwMissingArgumentError,
  throwArgumentTypeError
} from "../utils/error";
import AetherAccordionController from "../controller";

// init aether accordion
export default ({ element, entries, activeId = null }) => {
  // check incoming options
  if (element === undefined) throwMissingArgumentError("element");
  if (typeof element !== "string" && !(element instanceof window.HTMLElement))
    throwArgumentTypeError("element", element, "string or HTMLElement");

  // get actual dom nodes depending on the type of element
  let nodes;
  if (typeof element === "string")
    nodes = [...document.querySelectorAll(element)];
  else nodes = [element];

  // make a controller for every node
  const controllers = nodes.map(node => {
    // node getters
    const getEntryNode = id => node.querySelector(`dt[data-id="${id}"]`);
    const getEntryTitleNode = id => getEntryNode(id);
    const getEntryDescriptionNode = id =>
      getEntryTitleNode(id).nextElementSibling;

    // templates
    const getEntryTitleTemplate = ({ id, title }) => `
      <dt data-id="${id}">${title}</dt>
    `;
    const getEntryDescriptionTemplate = ({ description }) => `
      <dd>${description}</dd>
    `;
    const getEntryTemplate = ({ id, title, description }) => `
      ${getEntryTitleTemplate({ id, title })}
      ${getEntryDescriptionTemplate({ description })}
    `;

    // prepare viewUpdaters for the controller
    const viewUpdaters = {
      init: controller => {
        node.innerHTML = `
          ${controller
            .getEntries()
            .map(getEntryTemplate)
            .join("")}
        `;
      },
      setEntryTitle: (controller, id, value) => {
        getEntryTitleNode(id).innerHTML = value;
      },
      setEntryDescription: (controller, id, value) => {
        getEntryDescriptionNode(id).innerHTML = value;
      },
      activateEntry: (controller, id) => {
        getEntryNode(id).classList.add("is-active");
      },
      deactivateEntry: (controller, id) => {
        getEntryNode(id).classList.remove("is-active");
      },
      insertEntryBefore: (controller, id, entry) => {
        getEntryNode(id).insertAdjacentHTML(
          "beforebegin",
          getEntryTemplate(entry)
        );
      },
      insertEntryAfter: (controller, id, entry) => {
        getEntryDescriptionNode(id).insertAdjacentHTML(
          "afterend",
          getEntryTemplate(entry)
        );
      },
      removeEntry: (controller, id) => {
        getEntryDescriptionNode(id).remove();
        getEntryTitleNode(id).remove();
      }
    };

    // pass down args & view updaters to controller
    const controller = new AetherAccordionController({
      entries,
      activeId,
      viewUpdaters
    });

    // add events at each entry
    const entryEvents = {};
    controller.getEntries().forEach(({ id }) => {
      if (entryEvents[id] === undefined) entryEvents[id] = {};

      entryEvents[id].click = () => {
        const aid = controller.getActiveId();
        if (aid === id) controller.deactivateEntry(id);
        else controller.activateEntry(id);
      };

      getEntryNode(id).addEventListener("click", entryEvents[id].click);
    });

    return controller;
  });

  // return the prepared controller/s
  return controllers.length === 1 ? controllers[0] : controllers;
};
