Friends = new Meteor.Collection('friends');
Event = new Meteor.Collection('event');

// Need to add authenication process

if (Meteor.isClient) {
  var curUser = Meteor.userId();

  Template.friends.jhg = function() {
    return Friends.find({}).fetch();
  };


  Template.intro.events({
    'click click_to_start' : function () {
    }
  }),

  Template.what_to_do.events({
    'click .submitWhere' : function() {
      var whereTo = $('.where').val();
      if (whereTo) {
        Event.insert({
          userID: curUser,
          place: whereTo,
          invited: [],
          attending: []
        });
      }
    }
  });
  var friend = [];
  var temp = {};
  Template.friends.events({
    'click .inviteMore' : function() {
      temp = {name: $('.friend_name').val(), email: $('.email').val(), phone: $('phone').val()};
      friend.push(temp);
      $('<input type="text" placeholder="enter friends name" class="friend_name" /><input type="email" placeholder="invite friends email" class="email" /><input type="tel" placeholder="555-555-5555" class="phone" /><br />').prependTo('.inviteFriends');
    },
    'click .submitInvite' : function() {
      temp = {name: $('.friend_name').val(), email: $('.email').val(), phone: $('phone').val()}
      friend.push(temp);
      Friends.insert({
        userID: curUser,
        friend: friend
      })
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
