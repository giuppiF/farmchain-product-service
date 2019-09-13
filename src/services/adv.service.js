const fs = require('fs')
var mkdirp = require('mkdirp');
var path = require('path');
const PDFDocument = require('pdfkit');
const AWS = require('aws-sdk');

const advService = (options) => {

  const singleProductFlyer = async (product) => {
      try{
        var pathname = path.join('product',product._id.toString())
        var filename = 'flyer.pdf'
        
        const doc = new PDFDocument

        doc
          .fontSize(25)
          .text(product.name, 100, 100)

        doc.image('https://media.farmchain.it' + product.image, {
            fit: [250, 300],
            align: 'left',
            valign: 'top'
         });
         doc.end();

        //configuring the AWS environment
        s3 = new AWS.S3();
        params = {
          Bucket: options.awsSettings.s3BucketName,
          Body: doc,
          Key:  path.join(pathname,filename),
          ContentType: 'application/pdf',
          ACL: 'public-read'
        }
        s3.upload(params, function (err, data) {
          //handle error
          if (err) {
            reject(err)
          }
          //success
          if (data) {
              console.log("Uploaded in:", data.Location);
              resolve(data.Location)

          }
        });


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