const mongoose = require('mongoose');

const connectString = 'mongodb://localhost/musicplayce' 
                    || process.env.MONGODB_URI;

mongoose.connect(connectString, {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

module.exports = mongoose;  

