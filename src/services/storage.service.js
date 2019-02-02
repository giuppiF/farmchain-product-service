const multer = require('multer');


const storageService = (options) => {

    const storageInit = async (file) => {
        
        var storage = multer.diskStorage({
            destination: (req, file, cb) => {
              cb(null, options.path)
            },
            filename: (req, file, cb) => {
              cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
            }
        });

        return storage;
    }


    return Object.create({
        storageInit
    })
}

const start = (options) => {
    return new Promise((resolve, reject) => {

      if (!options) {
        reject(new Error('options settings not supplied!'))
      }

      resolve(storageService(options))
    })
  }

module.exports = Object.assign({}, {start})