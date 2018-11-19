import {
  throwMissingArgumentError,
  throwArgumentTypeError
} from "../utils/error";
import AetherAccordionController from "../controller";

import { templates, getNodeQueries } from "./dom";

const LIB_CLASS = "aether-accordion";

/**
 * AetherAccordionController view factory.
 *
 * @param element Selector string to target one or multiple elements, or a
 *                single HTMLElement.
 * @param entries Array of objects each of them representing an accordion
 *                entry. Each object needs the following properties: id, title
 *                description. See AetherAccordionController for more details.
 * @param activeId An entry ID which will be active from the beginning.
 *                 No entry will be active if this param is missing or null.
 *
 * @returns As many controller instances as needed in an array. If only one
 *          controller is needed, no array will be returned, but a single
 *          controller instance.
 */
const initAetherAccordion = ({ element, entries = null, activeId = null }) => {
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
    // load dom management functions
    const {
      getAllEntryTitleDescriptionNodes,
      getEntryNode,
      getEntryTitleNode,
      getEntryDescriptionNode
    } = getNodeQueries(node);
    const { getEntryTemplate } = templates;

    // prepare viewUpdaters for the controller
    const viewUpdaters = {
      init: controller => {
        // add lib class to the container
        node.classList.add(LIB_CLASS);

        // render everything in the container
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

    // check entries in order to load them from the DOM if they're not passed
    // as an argument
    let finalEntries;
    if (!entries) {
      finalEntries = [...getAllEntryTitleDescriptionNodes()].reduce(
        (pairs, item, index) => {
          const pairIndex = Math.floor(index / 2);
          const entry = pairs[pairIndex];
          if (!entry) {
            // create new entry object with id & title
            pairs[pairIndex] = { id: pairIndex, title: item.innerHTML };
            return pairs;
          }
          // add description
          entry.description = item.innerHTML;
          return pairs;
        },
        []
      );
    } else finalEntries = entries;

    // pass down args & view updaters to make the controller instance
    const controller = new AetherAccordionController({
      entries: finalEntries,
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

export default initAetherAccordion;
