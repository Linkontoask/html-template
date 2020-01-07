/// <reference path="node.d.ts"/>

/**
 * Core rendering class
 * Belong to @Link
 */
import {line, trim, match, isString, isFunction, isBoolean, translateCode, isObject} from "./units"
import {minify, MiniOptions} from "html-minifier-terser"

type Script = string[] | string
type Match = any[]

interface Options {
  mini: boolean | MiniOptions
}

export interface RenderType {
  set(html: string): void
  render(template: string): Promise<string> | string
  compiler(template: string): any[]
}

export class Render implements RenderType {
  private html: string | undefined
  private readonly options: Options

  constructor(
    options: Options = {
      mini: true
    }
  ) {
    this.options = options
  }

  set(html: string) {
    this.html = html
  }

  output(html: string): string {
    const { mini } = this.options

    let option: MiniOptions = {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }
    if (isBoolean(mini) && !mini) {
      return html
    }

    if (isObject(mini) && typeof mini === 'object') {
      option = mini
    }

    return minify(html, option)
  }

  render(template?: string): Promise<string> | string {

    const tp = template || this.html
    if (typeof tp === 'undefined') {
      return ''
    }

    const matchArray = this.compiler(tp)
    const placeholder: string = '!%'

    let output: string = ''

    let sync: boolean = false
    let syncArray: Array<Promise<any>> = []

    for (let item of matchArray) {
      if (isString(item)) {
        output += item
      }
      if (isFunction(item)) {
        try {
          const cb = item()
          if (cb instanceof Promise) {
            sync = true
            syncArray.push(cb)
            output += placeholder
          } else {
            output += cb
          }
        } catch (e) {

        }
      }
    }

    if (sync) {
      return Promise.all(syncArray).then(value => {
        let html: string = ''
        output.split(placeholder).forEach((item, index) => {
          html += (item + (value[index] || ''))
        })
        return this.output(html)
      })
    }

    return this.output(output)
  }

  compiler(template: string): Match {

    if (typeof template === 'undefined') {
      console.warn('render function error: not find html template')
    }

    let matchArray: Match = []

    let matchString: RegExpMatchArray | null
    let tp: string = template.replace(line, ' ')

    while((matchString = match.exec(tp))) {
      const index: any = matchString.index
      const script: Script = matchString[1]
      const scriptBlock: Script = matchString[0]
      // @ts-ignore
      const js: any = script.replace(/&(lt|gt|nbsp|amp|quot);/ig, (key) => translateCode[key])

      index !== 0 && matchArray.push(tp.slice(0, index))
      try {
        matchArray.push(new Function(js))
      } catch (e) {
        console.error(js, e)
      }

      tp = tp.substring(index + scriptBlock.length)
      matchString = match.exec(tp)
    }

    matchArray.push(tp)

    return matchArray
  }

}
