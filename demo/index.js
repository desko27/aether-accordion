/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */

import {storiesOf} from '@storybook/html'
import {withNotes} from '@storybook/addon-notes'
import CoreEvents from '@storybook/core-events'
import addons from '@storybook/addons'
import hljs from 'highlight.js'
import hljsCss from '!raw-loader!highlight.js/styles/github-gist.css'

import customStorybookCss from '!to-string-loader!css-loader!sass-loader!./index.scss'
import sourceTemplateMd from './source.template.md'

// requires for story files
const reqStories = require.context('./stories', true, /story\.js$/)
const reqJs = require.context('!raw-loader!./stories', true, /story\.js$/)
const reqSass = require.context('!raw-loader!./stories', true, /styles\.scss$/)
const reqInfo = require.context('./stories', true, /info\.json$/)
const reqHtml = require.context('./stories', true, /index\.html$/)
const reqNotes = require.context('./stories', true, /notes\.md$/)
const reqStyles = require.context(
  '!to-string-loader!css-loader!sass-loader!./stories',
  true,
  /styles\.scss$/
)
const storyFilesSchema = {
  js: {file: 'story.js', req: reqJs},
  sass: {file: 'styles.scss', req: reqSass},
  info: {file: 'info.json', req: reqInfo},
  html: {file: 'index.html', req: reqHtml},
  css: {file: 'styles.scss', req: reqStyles},
  notes: {file: 'notes.md', req: reqNotes}
}

// load extra css into root document once
const rootWindow = window.parent
const rootDoc = rootWindow.document
const styleElement = rootDoc.createElement('style')
styleElement.appendChild(rootDoc.createTextNode(hljsCss))
styleElement.appendChild(rootDoc.createTextNode(customStorybookCss))
rootDoc.head.appendChild(styleElement)

// create story style element for using it later
const storyStyleElement = document.createElement('style')
document.head.appendChild(storyStyleElement)

// get storybook's event manager
const channel = addons.getChannel()

// configure storybook for our custom behaviour
const storybook = storiesOf('AetherAccordion', module)
  .addDecorator(withNotes)
  .addDecorator(story => {
    const {html, css} = story()

    // load css for this particular story
    storyStyleElement.innerHTML = css || ''

    // render the story's html
    return html
  })

// add each story with its additional files
reqStories.keys().forEach(filename => {
  // story's filename comes in the shape of ./<name>/story.js
  const name = filename.slice(2).split('/')[0]

  // load the additional files associated with this story
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

  // get story's JavaScript and prepare a runner function
  const {default: storyJs} = reqStories(filename)
  const runJavaScript = () => {
    storyJs()

    // emit inited event
    channel.emit('storybook/aether-accordion/inited')
  }

  // get story's displayName and extra data
  const {js, sass, html, info, notes: rawNotes} = storyFiles
  const displayName = (info && info.name) || name

  // run story's JavaScript any time a story's html gets rendered
  channel.on(CoreEvents.STORY_RENDERED, () => {
    const currentStoryDisplayName = rootWindow.__currentStoryDisplayName
    if (currentStoryDisplayName !== displayName) return
    runJavaScript()
  })

  // apply some useful replacements to markdown notes before they get parsed
  const notes =
    rawNotes &&
    rawNotes
      .replace('((source))', sourceTemplateMd)
      .replace('((html))', `~~~html\n${html}\n~~~`)
      .replace(
        '((js))',
        `~~~js\n${js.replace('$lib', 'aether-accordion')}\n~~~`
      )
      .replace(
        '((sass))',
        `~~~scss\n${sass.replace('$lib', 'aether-accordion')}\n~~~`
      )

  // add some collected stuff to the story object in order to make it available
  // to the story decorator
  const extendedStory = {
    name,
    displayName,
    ...storyFiles
  }

  // FINALLY add story to the storybook
  storybook.add(displayName, () => extendedStory, {
    notes: {markdown: notes || '-'}
  })
})

// apply syntax highlighting to readme code blocks every time a notes panel
// is inited
channel.on('storybook/notes/add_notes', () => {
  setTimeout(() => {
    const blocks = rootDoc.querySelectorAll('.addon-notes-container pre code')
    blocks.forEach(block => hljs.highlightBlock(block))
  })
})

// do something every time an aether-accordion story is fully inited
channel.on('storybook/aether-accordion/inited', () => {})
