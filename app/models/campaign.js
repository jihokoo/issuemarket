var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CampaignSchema = new Schema({
  title: String,
  description: String,
  merchants: [{type: Schema.ObjectId,
              ref: "User"
              }],
  marketplaces: [{type: Schema.ObjectId,
              ref: "User"
              }],
  status: String,
  tiltThreshold: String,
  payments: [{type: Schema.ObjectId,
            ref: "Payment"}],
  issue: Schema.Types.Mixed,
  escrowFund: String,
  created: {type: Date,
            default: Date.now()}
  // totalDays: String
});

mongoose.model('Campaign', CampaignSchema);
