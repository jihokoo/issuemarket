// this should return an object
// that closes over an array
var _ = require('underscore');


exports.temporaryIssues = function(){
  dataStore = [];

  return {
    push: function(issue){
      dataStore.push(issue);
    },
    list: function(){
      return dataStore;
    },
    find: function(properties){
      return _.where(dataStore, properties);
    }
  };
}();
