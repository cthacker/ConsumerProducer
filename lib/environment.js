Registered = new Meteor.Collection("Registered");
Messages = new Meteor.Collection("messages");
keepAliveMessages = new Meteor.Collection("keepAlive");

//repeat actions after a given time and for fixed repititions
//since using meteor, recommended to use Meteor.setInterval
setIntervalX = function setIntervalX(callback, delay, repetitions) {
  var x = 0;
  var intervalID = Meteor.setInterval(function () {

     callback();

     if (++x === repetitions) {
         Meteor.clearInterval(intervalID);
     }
  }, delay);
}

// function to match the correct consumer id in consumerArray
findId = function findId(consumerArray, id) {
  for (var i = 0; i < consumerArray.length; i++) {
    //check if from client or server. Client if consumerArray[i].id exists
    if (consumerArray[i].id == undefined) {
      if (consumerArray[i].consumerID == id) {
        return consumerArray[i];
      }
    } else {
      if (consumerArray[i].id == id) {
        return consumerArray[i]
      }
    }
  }
}
