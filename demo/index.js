/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */

import {storiesOf} from '@storybook/html'
import {withNotes} from '@storybook/addon-notes'
import addons from '@storybook/addons'
import hljs from 'highlight.js'
import hljsCss from '!raw-loader!highlight.js/styles/github-gist.css'

import stories from './stories'
import customStorybookCss from '!raw-loader!sass-loader!./index.scss'

// load extra css into root document once
const rootDoc = window.parent.document
const styleElement = rootDoc.createElement('style')
styleElement.appendChild(rootDoc.createTextNode(hljsCss))
styleElement.appendChild(rootDoc.createTextNode(customStorybookCss))
rootDoc.head.appendChild(styleElement)

// create story style element for using it later
const storyStyleElement = document.createElement('style')
document.head.appendChild(storyStyleElement)

// get event manager
const channel = addons.getChannel()

// configure storybook for our custom behaviour
const storybook = storiesOf('AetherAccordion', module)
  .addDecorator(withNotes)
  .addDecorator(story => {
    const {name, html, init} = story()

    // load css for this particular story
    const storyCss = require(`!raw-loader!sass-loader!./stories/${name}.scss`)
    storyStyleElement.innerHTML = storyCss

    setTimeout(() => {
      // run javascript
      init()

      // run inited event
      channel.emit('storybook/aether-accordion/inited')
    })

    // render the story's html
    return html
  })

// add all the stories
stories.forEach(({name, story, notes}) =>
  storybook.add(name, story, {
    notes: {markdown: notes || '-'}
  })
)

// apply syntax highlighting to readme code blocks every time an
// aether-accordion story is inited
channel.on('storybook/aether-accordion/inited', () => {
  const blocks = rootDoc.querySelectorAll('.addon-notes-container pre code')
  blocks.forEach(block => hljs.highlightBlock(block))
})
