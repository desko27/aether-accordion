import '@storybook/addon-notes/register'
import addons from '@storybook/addons'

addons.register(
  'aether-accordion/set-current-story-display-name',
  storybookAPI => {
    storybookAPI.onStory((kind, story) => {
      window.__currentStoryDisplayName = story
    })
  }
)
