<p align="center">
  <img src="https://linkorg.club/www/html-template/logo.png" alt="html-template">
</p>

# html-template

The simplest `html` template engine

## Installation

`npm install @linkorgs/html-template`

or

`yarn add @linkorgs/html-template`

## Usage

```javascript
import { Render } from "@linkorgs/html-template"                    // ESModule
// const { Render } = require("@linkorgs/html-template")            // commonjs 
const render = new Render()
render.render(`<div>{{ null || '@linkorgs/html-template' }}</div>`)
// output: <div>@linkorgs/html-template</div>
```

## Documentation

Use **new Render (options?: object)** for initialization and return an instance of **Render**.

### options

+ `mini`: Whether to compress `html` content

### API

+ `set (html: string)`: set the template string to be rendered
+ `render (template?: string)`: render template string and return
