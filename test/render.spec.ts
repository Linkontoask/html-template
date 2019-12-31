import { Render } from '../lib'
import { expect } from 'chai'
import 'mocha'

describe('Render Class', () => {
  it('should return render html string', () => {
    const render = new Render()
    render.set(`
      <div>{{
        [1,2,3].map(item => '<h' + item + '>' + item + '</h' + item + '>').join('')
      }}</div>
    `)
    let html = render.render().replace(/(\s|\n|\\s)/g, '')
    expect(html).to.equal('<div><h1>1</h1><h2>2</h2><h3>3</h3></div>')
  });

  it('should render function return template', () => {
    const render = new Render()
    let html = render.render(`
      <div>{{
        [1,2,3].map(item => '<h' + item + '>' + item + '</h' + item + '>').join('')
      }}</div>
    `).replace(/(\s|\n|\\s)/g, '')
    expect(html).to.equal('<div><h1>1</h1><h2>2</h2><h3>3</h3></div>')
  })

  it('should render "{" or "}"', () => {
    const render = new Render()
    const html = render.render(`<div>{{ null || '{@linkorgs/html-template}' }}</div>`)
    expect(html).to.equal('<div>{@linkorgs/html-template}</div>')
    const html1 = render.render(`<div>{{   
      [1,2].map(item => {
        return item
      }).join('')       
    }}</div>`).replace(/(\s|\n|\\s)/g, '')
    expect(html1).to.equal('<div>12</div>')
  })
});

