var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PaymentSchema = new Schema({
  contributer: String,
  giver: {type: Schema.ObjectId,
          ref: "User"},
  taker: {type: Schema.ObjectId,
          ref: "User"},
  campaign: {type: Schema.ObjectId,
            ref: "Campaign"},
            // doesn't hurt to have the campaign property here
            // at the same time since the payment is going to be stored
            // in the campaign instances, there may not be a point
  amount: Number,
  balancedId: String,
  created: String,
  status: String,
  type: String,
});

mongoose.model('Payment', PaymentSchema);
