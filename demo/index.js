/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */

import {storiesOf} from '@storybook/html'
import {withNotes} from '@storybook/addon-notes'
import addons from '@storybook/addons'
import hljs from 'highlight.js'
import hljsCss from '!raw-loader!highlight.js/styles/github-gist.css'

import customStorybookCss from '!to-string-loader!css-loader!sass-loader!./index.scss'

// story files requires
const reqStories = require.context('./stories', true, /\.story\.js$/)
const reqNotes = require.context('./stories', true, /\.story\.md$/)
const reqStyles = require.context(
  '!to-string-loader!css-loader!sass-loader!./stories',
  true,
  /\.scss$/
)

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

// add all the stories
reqStories.keys().forEach(filename => {
  const {default: story} = reqStories(filename)

  // filename comes in the shape of ./name.story.js
  const name = filename.slice(2).split('.')[0]

  // load styles file for this story
  const allStylesFilenames = reqStyles.keys()
  const storyStylesFilename = `./${name}.scss`
  const styles = allStylesFilenames.includes(storyStylesFilename)
    ? reqStyles(storyStylesFilename)
    : null

  // load notes file for this story
  const allNotesFilenames = reqNotes.keys()
  const storyNotesFilename = `./${name}.story.md`
  const notes = allNotesFilenames.includes(storyNotesFilename)
    ? reqNotes(storyNotesFilename)
    : null

  // add some collected stuff to the story object
  const extendedStory = {
    ...story,
    css: styles
  }

  // FINALLY add story to the storybook
  storybook.add(name, () => extendedStory, {
    notes: {markdown: notes || '-'}
  })
})

// apply syntax highlighting to readme code blocks every time an
// aether-accordion story is inited
channel.on('storybook/aether-accordion/inited', () => {
  const blocks = rootDoc.querySelectorAll('.addon-notes-container pre code')
  blocks.forEach(block => hljs.highlightBlock(block))
})
