if (Meteor.isServer) {

  // Consumer class -- server side representation will go into ConsumerArray during registration
  var Consumer = function (consumerID, consumerAlive) {
    this.consumerID = consumerID;
    this.consumerAlive = consumerAlive;
  }
  
  // Listens for Registered Consumer -- then sends time every second for 5 seconds
  consumerArray = []
  Registered.find().observe({
    added: function(record){  
      consumerArray.push(new Consumer(record.id, record.consumerAlive));
      sendTimeRegistered(record, 1000, 5)   
    }
  });
  
  // Listens for keepAliveMessages -- then sends time every second for 5 seconds if no more
  // keepAlive goes for final 5 seconds
  keepAliveMessages.find().observe({
    added: function(record){  
      sendTimeRegistered(record, 1000, 5)   
    }
  });
  

  //Meteor.publish(messages, function(id) {
  //    return Messages.find({consumer: id});
  //});
  
  
  
  // Sends dateTime every second for 5 seconds after being registered  consumerRegistered is
  // instance of Consumer class
  function sendTimeRegistered(record, delay, repetitions) {
    
    //consumerRegistered now points to the correct consumer so we can modify it 
    var consumerRegistered = findId(consumerArray, record.id); 
    
    if (consumerRegistered.consumerAlive > 0) {
      consumerRegistered.consumerAlive -= 1;
      setIntervalX( function() {
        var dateTime = new Date().toTimeString();
        //console.log("Consumer " + consumerRegistered.consumerID + " is Alive!")
        Messages.insert({
        msg: "Producer tells Consumer id#", 
        id: consumerRegistered.consumerID, 
        msg2: " the time is: ",
        date: dateTime
        })  
      }, delay, repetitions)
    } else {
      // last time there won't be any more pings so send messages for 10 seconds
      setIntervalX( function() {
        var dateTime = new Date().toTimeString();
        //console.log("Consumer " + consumerRegistered.consumerID + " is Dead!")
        Messages.insert({
        msg: "Producer tells Consumer id#", 
        id: consumerRegistered.consumerID, 
        msg2: " the time is: ",
        date: dateTime
        })
      }, delay, 2*repetitions)
    }
  }

  // Consumer calls register method and adds date, id, and keepAlive to Registered db 
  Meteor.methods({
    register: function(consumerid, keepAlive) {
        var dateTime = new Date().toTimeString();
        Registered.insert({
            date: dateTime,
            id: consumerid,
            consumerAlive: keepAlive
        });
    },
  });
  
  // server side adds consumer to the keepAliveMessages db
  Meteor.methods({
    keepAlive: function(consumerid) {
      keepAliveMessages.insert({id: consumerid});
    },
  });

  // Clears db for rerunning the program
  Meteor.methods({
    removeCollection: function() {
      Registered.remove({});
      Messages.remove({});
      keepAliveMessages.remove({});
    }
  });
  
}
