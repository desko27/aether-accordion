# aether-accordion [![Build Status](https://travis-ci.org/desko27/aether-accordion.svg?branch=master)](https://travis-ci.org/desko27/aether-accordion) [![Coverage Status](https://coveralls.io/repos/github/desko27/aether-accordion/badge.svg?branch=master)](https://coveralls.io/github/desko27/aether-accordion?branch=master)

> An easy-to-use, performant, full tested and configurable accordion UI component written in Vanilla JS.

## [Check the Storybook ↗](https://desko27.github.io/aether-accordion)

All the use cases are demonstrated and documented at the Storybook. Also, each example is provided with the source code so you can understand how to use it yourself.

Features:

- Fast and easy to use
- Documented through stories
- Advanced API
- SASS variables
- CSS transitions
- Events
- Nesting
- AJAX content

## Install

```sh
npm install aether-accordion --save
```

## Quick start

Here is the basic implementation. For more advanced use cases refer to the linked Storybook at the beginning of this file.

```js
import initAetherAccordion from 'aether-accordion'

initAetherAccordion({ element: 'dl' })
```

```html
<dl>
  <dt>Section 1</dt>
  <dd>
    <p>Section 1 Content...</p>
  </dd>
  <dt>Section 2</dt>
  <dd>
    <p>Section 2 Content...</p>
  </dd>
  <dt>Section 3</dt>
  <dd>
    <p>Section 3 Content...</p>
  </dd>
</dl>
```

---

## Development

### Run the Storybook

```sh
npm start
```

### Run linters

```sh
npm run lint
```

### Run tests

```sh
npm test
```

### Get coverage

```sh
npm run coverage
```

### Build the lib

```sh
npm run build
```
