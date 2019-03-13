const fs = require('fs')
var mkdirp = require('mkdirp');
var path = require('path');
const PDFDocument = require('pdfkit');


const advService = (options) => {
  const {storagePath} = options
  const singleProductFlyer = async (product) => {
      try{
        var pathname = path.join(storagePath,'product',product._id.toString())
        var filename = 'flyer.pdf'
        var completefilename = path.join(pathname,filename)
        const doc = new PDFDocument
        doc.pipe(fs.createWriteStream(completefilename))
        doc
          .fontSize(25)
          .text(product.name, 100, 100)

        doc.image(path.join(storagePath,product.image), {
            fit: [250, 300],
            align: 'left',
            valign: 'top'
         });
         doc.end();
         return path.join('/product',product._id.toString(),filename)
      } catch (err){
          throw  Error(err)
      }
  }


return Object.create({
  singleProductFlyer
})
}

const start = (options) => {
    return new Promise((resolve, reject) => {

      if (!options) {
        reject(new Error('options settings not supplied!'))
      }

      resolve(advService(options))
    })
  }

module.exports = Object.assign({}, {start})