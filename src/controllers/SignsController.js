'use strict'

const Sign = require('../models').signs
const pug = require('pug')
const puppeteer = require('puppeteer')
const { mkdirpath } = require('../helpers')
const path = require('path')
const sha256 = require('sha256')

class SignsController {
  static async sign(id, type, auth) {
    try {
      const data = {
        type: type,
        type_id: id,
        user_id: auth.user.id,
      }

      const compiledFunction = pug.compileFile('templates/sign-receipt.pug');
      const html = compiledFunction({
        ...data, 
        user: auth.user,
        time: new Date()
      });
      const pdfPath = `${__basedir}/../public/crop-${id}`
      
      await mkdirpath(pdfPath)

      const options = {
        headerTemplate: "<p>roberto carlos mother faka</p>",
        footerTemplate: "<p></p>",
        displayHeaderFooter: false,
        printBackground: true,
        path: `${pdfPath}/budget-user-${auth.user.id}.pdf`,
        format: 'A4'
      }

      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
      });

      var page = await browser.newPage();

      await page.goto(`data:text/html;charset=UTF-8,${html}`, {
        waitUntil: 'networkidle0'
      });

      const pdfBuffer = await page.pdf(options);
      
      const hash = sha256(pdfBuffer)

      return await Sign.create({...data, hash})
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = SignsController