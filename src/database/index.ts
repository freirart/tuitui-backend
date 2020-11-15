const mongoose = require('mongoose');
// 'mongodb://localhost/musicplayce' 
const connectString = process.env.NODE_ENV === 'TEST'
                    ? process.env.MONGODB_URI_TEST
                    : process.env.MONGODB_URI

mongoose.connect(connectString, {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports = mongoose;  