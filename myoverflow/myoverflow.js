Posters = new Meteor.Collection('posters');

if (Meteor.isClient) {
  Template.Names.events = {
    'click .submitName' : function() {
      var posterName = $('.name').val();
      if(posterName){
        Posters.insert({name: posterName});
      }
    },
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
