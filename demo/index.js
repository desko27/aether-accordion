import { storiesOf } from "@storybook/html";
import addons from "@storybook/addons";
import CoreEvents from "@storybook/core-events";

import initAetherAccordion from "../src";

const END_STORY = () => {};

storiesOf("AetherAccordion", module)
  .addDecorator(story => {
    const { html, init } = story();
    addons
      .getChannel()
      .emit(CoreEvents.REGISTER_SUBSCRIPTION, init || (() => END_STORY));
    setTimeout(() => init());
    return html;
  })
  .add("basic 1", () => {
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
        return END_STORY;
      }
    };
  })
  .add("basic 2", () => {
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
        return END_STORY;
      }
    };
  });
