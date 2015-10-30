if (Meteor.isClient) {
  
  //Creat consumer class
  var Consumer = function (id, keepAlive) {
    this.id = id
    this.keepAlive = keepAlive
    
  }
  

  // This is the main loop started on form submission
  Template.getConsumer.events({
    'submit form': function(event, template){
      event.preventDefault();

      // Check db's make sure they are clear
      Meteor.call("removeCollection")

      
      numConsumers = template.find("#inputNumConsumers").value;
      consumerArray = [];
      
      //create consumers and add to consumerArray
      for (i=1; i <= numConsumers; i++) {
          id = i;
          keepAlive = getRandomInt(0,12);
          consumerArray.push(new Consumer(id, keepAlive));
          console.log("Created Consumer " + id + " with " + keepAlive + " messages to the producer")
      }
                        
      //Registers Consumers
      registerCon(consumerArray);
      // 5 seconds after Consumer registers (registerCon) we ping that we are alive every 5 seconds
      setTimeout(pingAlive(consumerArray),5000);   
      }
  });

  Template.messages.helpers({
    messages: function() {
      return Messages.find({}, {sort: {date: -1}});
    }
  });

  // Listens to messages for each Consumer and prints to console
  Messages.find().observe({
    added: function(record){  
      if (typeof consumerArray == "undefined") {
        return //do nothing
      } else {
        consumerPrint(consumerArray, record)
      }
    }
  });
  
  function consumerPrint (consumerArray, record) {
    var consumerMatch = findId(consumerArray, record.id);
    console.log(record.msg + consumerMatch.id + record.msg2 + record.date);
  }

  //Allows client to register the consumers to the producer
  function registerCon (consumerArray) {
    consumerArray.forEach(function (consumer) {
      Meteor.call("register",consumer.id, consumer.keepAlive)
    });
  }

  //sends keepAlive updates to producer every 5 seconds for each consumer
  function pingAlive (consumerArray) {
    consumerArray.forEach(function (consumer) {
      if (consumer.keepAlive > 0) {
        setIntervalX( function() {
        Meteor.call("keepAlive",consumer.id)
        }, 5000, consumer.keepAlive)
      }
    });
  }


  //returns random integer between min and max inclusive
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

    
 

}
