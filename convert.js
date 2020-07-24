const cheerio = require('cheerio')
const fs = require('fs')
const marked = require('marked');

['index', 'why/index'].forEach((f) => {
  const $ = cheerio.load(fs.readFileSync('./template.html'))
  const src = fs.readFileSync(`./content/${f}.md`)
  const content = cheerio.load(marked(src.toString()))

  content('h1').addClass('my-5')
  content('h2').addClass('lead')
  content('h2').addClass('my-5')
  content('p').addClass('my-4')

  $('.container').html(content.html())

  fs.writeFileSync(`./public/${f}.html`, $.html())

})
