
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



const kafkaService = (options, producer) => {
  var repo = options.repo;
  try {
    const ConsumerGroup = kafka.ConsumerGroup;
    var kafkaGroupOptions = {
    kafkaHost: options.kafkaSettings.server , // connect directly to kafka broker (instantiates a KafkaClient)
    batch: undefined, // put client batch settings if you need them
    ssl: true, // optional (defaults to false) or tls options hash
    groupId: 'ProductServiceGroup',
    sessionTimeout: 15000,
    // An array of partition assignment protocols ordered by preference.
    // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
    protocol: ['roundrobin'],
    encoding: 'utf8', // default is utf8, use 'buffer' for binary data
   
    // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
    // equivalent to Java client's auto.offset.reset
    fromOffset: 'latest', // default
    commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
    // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
    outOfRangeOffset: 'earliest', // default
    // Callback to allow consumers with autoCommit false a chance to commit before a rebalance finishes
    // isAlreadyMember will be false on the first connection, and true on rebalances triggered after that
    onRebalance: (isAlreadyMember, callback) => { callback(); } // or null
  };
  
  let consumer = new ConsumerGroup(
    kafkaGroupOptions,
        ['service.farm']
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
          messages: JSON.stringify({event: event, data: data}),
          key: data._id
        }
      ];
      let push_status = producer.send(payloads, (err, data) => {
        if (err) {
          throw Error(err)
        } else {
          console.log("pubblicato evento " + event + " in topic " + topic )
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
      resolve(kafkaService(options,producer))
    });
    producer.on('error', function(err) {
      reject(new Error('kafka connection error'))
    });
    
  })
}

module.exports = Object.assign({}, {start})