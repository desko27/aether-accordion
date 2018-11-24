import {storiesOf} from '@storybook/html'
import {withNotes} from '@storybook/addon-notes'
import addons from '@storybook/addons'
import hljs from 'highlight.js'

// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import hljsCss from '!raw-loader!highlight.js/styles/github-gist.css'

import stories from './stories'
import '../src/index.scss'

// load highligh.js css into root document once
const rootDoc = window.parent.document
const styleElement = rootDoc.createElement('style')
styleElement.appendChild(rootDoc.createTextNode(hljsCss))
rootDoc.head.appendChild(styleElement)

// get event manager
const channel = addons.getChannel()

// configure storybook
const storybook = storiesOf('AetherAccordion', module)
  .addDecorator(withNotes)
  .addDecorator(story => {
    const {html, init} = story()
    setTimeout(() => {
      init()
      channel.emit('storybook/aether-accordion/inited')
    })

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
