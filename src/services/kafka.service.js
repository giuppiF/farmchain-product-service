
var kafka = require('kafka-node');


const updateFarm = async (repo,farm) => {
  farm.products.map(
    async (product) => {

    const productFarmData = {
      farm: farm
    }
    console.log(productFarmData)
    try{
        var product = await repo.updateProduct(product._id,productFarmData)
        product ?
        console.log('okkkk')
        :
        console.log('error, product not found')
    } catch (err) {
        console.log('error on db', err);
    }
  })
}



const updateDealer = async (repo,dealer) => {


  try{
      var product = await repo.updateDealer(dealer._id,dealer)
      product ?
      console.log('okkkk')
      :
      console.log('error, product not found')
  } catch (err) {
      console.log('error on db', err);
  }

}
const deleteDealer = async (repo,dealer) => {


  try{
      var product = await repo.deleteDealer(dealer._id)
      product ?
      console.log('okkkk')
      :
      console.log('error, product not found')
  } catch (err) {
      console.log('error on db', err);
  }

}
const updateLot = async (repo,lot) => {


  try{
      var product = await repo.updateLot(lot._id,lot)
      product ?
      console.log('okkkk')
      :
      console.log('error, product not found')
  } catch (err) {
      console.log('error on db', err);
  }

}
const deleteLot = async (repo,lot) => {


  try{
      var product = await repo.deleteLot(lot._id)
      product ?
      console.log('okkkk')
      :
      console.log('error, product not found')
  } catch (err) {
      console.log('error on db', err);
  }

}



const kafkaService = (options, producer,client) => {
  var repo = options.repo;
  try {
    const Consumer = kafka.Consumer;
    var kafkaOptions = [{ topic: 'service.farm', partition: 0 }]
    var kafkaConsumerOptions =  {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      fromOffset: false
    };
  
  let consumer = new Consumer(
    client,
    kafkaOptions,
    kafkaConsumerOptions
    );


    var farmFunctions = {
      "update.farm" : (repo,farm) => {
          return updateFarm(repo, farm)
        },
      "update.dealer" : (repo,dealer) => {
          return updateDealer(repo, dealer)
        },
      "delete.dealer" : (repo,dealer) => {
          return deleteDealer(repo, dealer)
        },
      "update.lot" : (repo,lot) => {
          return updateLot(repo, lot)
        },
      "delete.lot" : (repo,lot) => {
          return deleteLot(repo, lot)
        },

    }

    consumer.on('message', async function(message) {

      var message_parsed = JSON.parse(message.value);
      farmFunctions[message_parsed.event](repo,message_parsed.data)

    })
    consumer.on('error', function(err) {
        console.log('error', err);
    });
    }
    catch(e) { 
    console.log(e);
    }

    const publishEvent = async (topic,event,data) =>  {

      let payloads = [
        {
          topic: topic,
          messages: JSON.stringify({event: event, data: data})
        }
      ];
      let push_status = producer.send(payloads, (err, data) => {
        if (err) {
          throw Error(err)
        } else {
          console.log("pubblicato evento " + event + " in topic " + topic + "with data : " + data )
          return;
        }
      });
    }



  return Object.create({
    publishEvent
  })
}


const start = (options) => {
  return new Promise((resolve, reject) => {

    if (!options) {
      reject(new Error('options settings not supplied!'))
    }
    const Producer = kafka.Producer;

    const client = new kafka.KafkaClient({kafkaHost: options.kafkaSettings.server});

    const producer = new Producer(client);

    producer.on('ready', async function() {
      resolve(kafkaService(options,producer,client))
    });
    producer.on('error', function(err) {
      reject(new Error('kafka connection error'))
    });
    
  })
}

module.exports = Object.assign({}, {start})