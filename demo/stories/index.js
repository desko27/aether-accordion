import basicStory from './basic.story'
import basicNotes from './basic.story.md'
import advancedStory from './advanced.story'
import advancedNotes from './advanced.story.md'
import stress1kStory from './stress-1k.story'
import nestingStory from './nesting.story'

export default [
  {name: 'Basic', story: basicStory, notes: basicNotes},
  {name: 'Advanced', story: advancedStory, notes: advancedNotes},
  {name: 'Stress (1k entries)', story: stress1kStory},
  {name: 'Nesting', story: nestingStory}
]
