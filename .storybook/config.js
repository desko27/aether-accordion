import {configure} from '@storybook/html'

function loadStories() {
  require('../demo/index.js')
}

configure(loadStories, module)
