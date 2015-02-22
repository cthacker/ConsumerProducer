# Simple Producer/Consumer Exercise With Meteor

This project uses meteor, which to quote wikipedia is, "an open-source real-time JavaScript web
application framework written on top of Node.js." Using this allows for quick and easy development.
While I am aware there are probably many issues if this were to be production level code, for this
exercise it is amazing!


# What does it do?!

**N** consumers (client) send a register message to a producer (server) after which the producer sends them the time for
five seconds. Consumers then send **K** keepAlive messages every five seconds to keep the producer
sending messages. Finally after the last keepAlive message the producer sends time for 10 seconds.

The Producer message is printed to the console by the consumers (as required by the specs), but I also have the
message displaying on the website as well. Additionally, the first thing printed in the console is
the number of consumers and how many keepAlive messages they will send.

![Screenshot of the program running on Chrome](http://screenshot/Sample-screenshot.png)


# How to Install

You will first want to install meteor using:

    > curl https://install.meteor.com/ | sh

Next, you will need to clone this GitHub repository by doing:

    > git clone https://github.com/cthacker/ConsumerProducer.git

Finally, to run a local webserver and demo this project go into the project folder that you cloned and type:
meteor. That's it all done. Point your browser to [localhost](http://localhost:3000/) and be amazed!

If you want to restart just refresh the page to cancel the current progress, input a new Consumer
number and submit. It will overwrite the old data and reactively show the new "run"
    

# What if something goes wrong?

1) It won't

B) If for some reason something weird is going on (could only be due to quantum effects ... not a bug) run the following to fully restart.
    
    >meteor reset
    >meteor 


Issues
-------------------------------
* I guess the biggest issue is that this is super insecure. If the Consumers were different clients
  they probably wouldn't be happy their info is shared.
    - To remedy this, we should not let the consumer generate id's and either limit the database
      calls only pertaining to their id (all of this would happen server side) or generate unique
      databases for each Consumer
* Messages pass from client to server and back through databases -- this would almost certainly have
  some scaling performance issues

