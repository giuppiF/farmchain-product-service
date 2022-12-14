
const fs = require('fs')
var mkdirp = require('mkdirp');
var path = require('path');
var mime = require('mime')

const storageService = (options) => {

  const saveToDir =  async (rawfile, filename, pathname) => {

    try{
      console.log(pathname)
      if (!fs.existsSync(pathname)) {
        await mkdirp.sync(pathname)
      }
      var file = path.join(pathname,filename)
      await moveFile(rawfile,file )
      
      return file

    } catch (err) {
      throw  Error(err)
    }
  }

  const deleteFile =  async (filename, pathname) => {

    try{
      var file = path.join(pathname,filename)
      await fs.unlinkSync(file)
      return true

    } catch (err) {
      throw  Error(err)
    }
  }

  const copyTemplateFile =  async (rawfile, filename, pathname) => {

    try{
      if (!fs.existsSync(pathname)) {
        await mkdirp.sync(pathname)
      }

      var newfile = path.join(pathname,filename)
      
      await copyFile(rawfile,newfile )
      
      return newfile

    } catch (err) {
      throw  Error(err)
    }
  }
  const saveBase64ToDir =  async (base64file, filename, pathname) => {

    try{
      var newfile = path.join(pathname,filename)
      if (!fs.existsSync(pathname)) {
        await mkdirp.sync(pathname)
      }
      fs.writeFileSync(newfile, base64file, {encoding: 'base64'}, function(err) {
        console.log('File created');
    });
            
      return newfile

    } catch (err) {
      throw  Error(err)
    }
  }
  const fileToBase64 =  async (filename) => {
    const file_buffer  = fs.readFileSync(filename);
    var mimeType = mime.getType(filename)
    var fileBase64 = 'data:' + mimeType + ';base64,'+ file_buffer.toString('base64')
    
    return fileBase64
  }
  const deleteDir =  async (pathname) => {

    try{
      await fs.rmdirSync(pathname);
      return true

    } catch (err) {
      throw  Error(err)
    }
  }



  return Object.create({
	saveToDir,
  deleteFile,
  copyTemplateFile,
  saveBase64ToDir,
  fileToBase64,
  deleteDir
  })
}

function moveFile(imagePath,saveTo) {
  return new Promise(function (resolve, reject) {
      fs.rename(imagePath, saveTo, async  (err)=>{
          if(err) reject(err)
          else
          resolve()
      })
  });
}

function copyFile(originalFile,newFile) {
  return new Promise(function (resolve, reject) {
    fs.copyFile(originalFile, newFile,  async  (err)=>{
          if(err) reject(err)
          else
          resolve()
      })
  });
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