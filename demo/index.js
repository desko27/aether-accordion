/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */

import {storiesOf} from '@storybook/html'
import {withNotes} from '@storybook/addon-notes'
import addons from '@storybook/addons'
import hljs from 'highlight.js'
import hljsCss from '!raw-loader!highlight.js/styles/github-gist.css'

import customStorybookCss from '!to-string-loader!css-loader!sass-loader!./index.scss'

// requires for story files
const reqStories = require.context('./stories', true, /story\.js$/)
const reqInfo = require.context('./stories', true, /info\.json$/)
const reqHtml = require.context('./stories', true, /index\.html$/)
const reqNotes = require.context('./stories', true, /notes\.md$/)
const reqStyles = require.context(
  '!to-string-loader!css-loader!sass-loader!./stories',
  true,
  /styles\.scss$/
)
const storyFilesSchema = {
  info: {file: 'info.json', req: reqInfo},
  html: {file: 'index.html', req: reqHtml},
  css: {file: 'styles.scss', req: reqStyles},
  notes: {file: 'notes.md', req: reqNotes}
}

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
    const {html, css, init} = story()

    // load css for this particular story
    storyStyleElement.innerHTML = css || ''

    setTimeout(() => {
      // run javascript
      init()

      // run inited event
      channel.emit('storybook/aether-accordion/inited')
    })

    // render the story's html
    return html
  })

// add each story with its files
reqStories.keys().forEach(filename => {
  const {default: storyJs} = reqStories(filename)

  // filename comes in the shape of ./<name>/story.js
  const name = filename.slice(2).split('/')[0]

  // load the extra files for this story
  const storyFiles = Object.entries(storyFilesSchema).reduce(
    (obj, [key, {file, req}]) => {
      const allFilenames = req.keys()
      const storyFilename = `./${name}/${file}`
      return {
        ...obj,
        [key]: allFilenames.includes(storyFilename) ? req(storyFilename) : null
      }
    },
    {}
  )

  // add some collected stuff to the story object
  const extendedStory = {
    init: storyJs,
    ...storyFiles
  }

  // get story's displayName and extra data we may need right now
  const {info, notes} = storyFiles
  const displayName = (info && info.name) || name

  // FINALLY add story to the storybook
  storybook.add(displayName, () => extendedStory, {
    notes: {markdown: notes || '-'}
  })
})

// apply syntax highlighting to readme code blocks every time an
// aether-accordion story is inited
channel.on('storybook/aether-accordion/inited', () => {
  const blocks = rootDoc.querySelectorAll('.addon-notes-container pre code')
  blocks.forEach(block => hljs.highlightBlock(block))
})
