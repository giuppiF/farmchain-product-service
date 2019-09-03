
const fs = require('fs')
var mkdirp = require('mkdirp');
var path = require('path');
var mime = require('mime')
const AWS = require('aws-sdk');

const storageService = (options) => {

  const uploadFileInS3 = (rawfile, filename, pathname) =>  {
    return new Promise(function (resolve, reject) {
      try{ 
        //configuring the AWS environment
        s3 = new AWS.S3();
        params = {
          Bucket: options.awsSettings.s3BucketName,
          Body: fs.createReadStream(rawfile),
          Key:  path.join(pathname.replace(/^\/+/g, ''),filename),
          ContentType: mime.getType(rawfile),
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
      } catch (err) {
        throw  Error(err)
      }
    });
  }
  
  const deleteFileFromS3 = ( filename) =>  {
    return new Promise(function (resolve, reject) {
      try{ 
        //configuring the AWS environment
        s3 = new AWS.S3();
       
        params = {
          Bucket: options.awsSettings.s3BucketName,
          Key:  filename.replace(/^\/+/g, '')
        }
        s3.deleteObject(params, function(err, data) {
          if (err){
            console.log("file delete in error err")
            reject(err);  // error
          } 
          else
          {
            console.log("file delete")
            resolve()                // deleted
          }     
        });

      

      } catch (err) {
        throw  Error(err)
      }
    });
  }


  const copyTemplateFile =(rawfile, filename, pathname) =>  {
    return new Promise(function (resolve, reject) {
      try{ 
        //configuring the AWS environment
        s3 = new AWS.S3();
        console.log('/'+ options.awsSettings.s3BucketName + rawfile)
        var params = {
          Bucket: options.awsSettings.s3BucketName,
          Key:  filename.replace(/^\/+/g, ''),
          CopySource : '/'+ options.awsSettings.s3BucketName + rawfile,
          ContentType: mime.getType(rawfile),
          ACL: 'public-read'
      };
      s3.copyObject(params, function(err, data) {
          if (err)
            reject(err);  // error
          else {
            resolve()      
          }
      });
     

      } catch (err) {
        throw  Error(err)
      }
    });
  }

  const saveBase64ToS3 = (rawfile, filename, pathname) =>  {
    return new Promise(function (resolve, reject) {
      try{ 
        //configuring the AWS environment
        s3 = new AWS.S3( { params: {Bucket: options.awsSettings.s3BucketName} });
        buf = new Buffer(base64file,'base64')
        var data = {
          Key: path.join(pathname.replace(/^\/+/g, ''),filename),
          Body: buf,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg',
          ACL: 'public-read'
        };
        s3.putObject(data, function(err, data){
            if (err) { 
              reject(err)
            } else {
              resolve()
            }
        });
      } catch (err) {
        throw  Error(err)
      }
    });
  }


  const fileToBase64 =  async (filename) => {
    s3 = new AWS.S3();
       
    params = {
      Bucket: options.awsSettings.s3BucketName,
      Key:  filename.replace(/^\/+/g, '')
    }
    var file_buffer;
    s3.client.getObject(params, function(error, data) {
      file_buffer = data.Body.toString('base64');
    });

    var mimeType = mime.getType(filename)
    var fileBase64 = 'data:' + mimeType + ';base64,'+ file_buffer.toString('base64')
    
    return fileBase64
  }




  return Object.create({
	uploadFileInS3,
  deleteFileFromS3,
  copyTemplateFile,
  saveBase64ToS3,
  fileToBase64,
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