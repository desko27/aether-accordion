import initAetherAccordion from "../../src";

export default () => {
  const className = "aether-accordion--basic2";

  return {
    html: `<dl class="${className}" />`,
    init: () => {
      initAetherAccordion({
        element: `.${className}`,
        entries: [
          { id: 0, title: "Title 1", description: "Description #1" },
          { id: 1, title: "Title 2", description: "Description #2" },
          { id: 2, title: "Title 3", description: "Description #3" },
          { id: 3, title: "Title 4", description: "Description #4" }
        ]
      });
    }
  };
};
