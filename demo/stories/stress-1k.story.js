import initAetherAccordion from "../../src";

export default () => ({
  html: `<dl class="aether-accordion" />`,
  init: () => {
    initAetherAccordion({
      element: ".aether-accordion",
      entries: [...new Array(1000).keys()].map(i => ({
        id: i,
        title: `Title ${i + 1}`,
        description: `Description #1 ${i + 1}`
      }))
    });
  }
});
