Groups = new Meteor.Collection('groups');
Outings = new Meteor.Collection('outings');

if (Meteor.isClient) {
  Template.users.current_user = function() {
    return Meteor.users.find({}).fetch()
  };

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  })
  // Template.users.friends = function() {};
  // //use modal to select friends that you want to invite
  // //Need a way to invite friends not already on the list

  // Template.occasions.select_event = function() {};

  // Template.occasions.planned_event = function() {};

  Template.occasions.events = {
    'click .submit_occasion' : function() {
      var event = $('.input_occasion').val();
      var currUser = Meteor.userId();
      Outings.insert({
        participant: [currUser],
        occasion_name: event,
        money_pool: 0, 
        people_attended: 0
      });
    }
  }


}

if (Meteor.isServer) {
  // Meteor.startup(function () {
  // });
}

