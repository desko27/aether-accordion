import { storiesOf } from "@storybook/html";
import addons from "@storybook/addons";
import CoreEvents from "@storybook/core-events";

import stories from "./stories";

// prepare storybook
const storybook = storiesOf("AetherAccordion", module).addDecorator(story => {
  const END_STORY = () => {};
  const { html, init } = story();
  addons.getChannel().emit(
    CoreEvents.REGISTER_SUBSCRIPTION,
    (() => {
      init();
      return END_STORY;
    }) || (() => END_STORY)
  );
  setTimeout(() => init());
  return html;
});

// add all the stories
stories.forEach(({ name, story }) => storybook.add(name, story));