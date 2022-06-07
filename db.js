import mongoose from "mongoose"; 

export default () => {
    var dbURI = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`; 
     
    // CONNECTION EVENTS
    mongoose.connection.on('connected', function () {
      console.log('Mongoose default connection open to ' + dbURI);
    }); 
      
    mongoose.connection.on('error',function (err) { 
      console.log('Mongoose default connection error: ' + err);
    }); 
    
    mongoose.connection.on('disconnected', function () { 
      console.log('Mongoose default connection disconnected'); 
    });
    
    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {   
      mongoose.connection.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
      }); 
    }); 

    return mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true }); 

}
