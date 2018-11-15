import initAetherAccordion from "../../src";

export default () => {
  const className = "aether-accordion--basic1";

  return {
    html: `<dl class="${className}" />`,
    init: () => {
      initAetherAccordion({
        element: `.${className}`,
        entries: [
          { id: 0, title: "Title 1", description: "First description" },
          { id: 1, title: "Title 2", description: "Second description" }
        ]
      });
    }
  };
};
