var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var UserSchema = new Schema({
  displayName: String,
  username: String,
  balancedId: String,
  balancedToken: String,
  email: String,
  githubId: String,
  campaigns: [{type: Schema.ObjectId,
              ref: 'Campaign'}],
  github: {},
  githubUrl: String,
  repuation: String,
  githubAccessToken: String,
  paymentsMade: [{type: Schema.ObjectId,
                ref: 'Payment'}],
  paymentsReceived: [{type: Schema.ObjectId,
                    ref: 'Payment'}],
  totalpm: Number,
  totalpr: Number
});

mongoose.model('User', UserSchema);
