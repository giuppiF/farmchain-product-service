const jwt = require('express-jwt');



const authentication = (options) => { 

  const {secret, repo} = options
  const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Bearer') {
      return authorization.split(' ')[1];
    }
    return null;
  };

  var  isFarmAdmin = async (req,res,next) => {
    var currentProduct = await repo.getProduct(req.params.productID)
    var farmId = req.user.farm
    res.locals.farmId = farmId
    farmId == currentProduct.farm._id?
      next()
    :
      res.status(401).send()

  }
  var  isFarmAdminMedia = async (req,res,next) => {
   
    var farmId = req.user.farm
    res.locals.farmId = farmId
    farmId ?
      next()
    :
      res.status(401).send()

  }
  var isFarmAdminForCreation = (req,res,next) => {
    var farmId = req.user.farm
    res.locals.farmId = farmId
    farmId == req.body.farm._id || farmId == req.body.farm ?
      next()
    :
      res.status(401).send()

  }

  return {
    required: jwt({
      secret: secret,
      userProperty: 'user',
      getToken: getTokenFromHeaders,
    }),
    optional: jwt({
      secret: secret,
      userProperty: 'user',
      getToken: getTokenFromHeaders,
      credentialsRequired: false,
    }),
    isFarmAdmin,
    isFarmAdminMedia,
    isFarmAdminForCreation
  };

}
const start = (options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      reject(new Error('secret not supplied!'))
    }
    
    resolve(authentication(options))
  })
}

module.exports = Object.assign({}, {start})

