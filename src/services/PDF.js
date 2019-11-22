'use strict'

const pug = require('pug')
const puppeteer = require('puppeteer')
const View = require('../services/View')
const { mkdirpath } = require('../helpers')
const sha256 = require('sha256')

class PDF {

  // TODO: implement
  static renderHeader({ template, data }) {
    if (!template || !data) return '<p></p>'
    return View.render({ template, data })
  }

  /**
   * Generate pdf with puppeteer screenshoot on 
   * on a pug template
   * 
   * @return hash|string, path|string
   */
  static async generate({ path, filename, template, data, header }) {
    try {
      const html = View.render({ template, data: data || {} })

      const pdfPath = path

      await mkdirpath(pdfPath)

      const options = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          bottom: '20mm',
          left: '8mm',
          right: '8mm'
        },
        path: `${pdfPath}/${filename}`,
      }

      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
      })

      var page = await browser.newPage();

      await page.goto(`data:text/html;charset=UTF-8,${html}`, {
        waitUntil: 'networkidle0'
      })

      const pdfBuffer = await page.pdf(options);

      const hash = sha256(pdfBuffer)

      return Promise.resolve({ hash, path: `${filename}` })
    } catch (err) {
      throw err
    }
  }
}

module.exports = PDF