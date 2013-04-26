Friends = new Meteor.Collection('friends');
Event = new Meteor.Collection('event');

// Need to add authenication process
// Currently printing all Friends and Events regardless of user.
// Not tied to the user

if (Meteor.isClient) {
  var curUser = Meteor.userId();
  var pin_visitor;
  //Pin for visitor.  Yet to implement
  Template.invite_friends.pin = function() {
    var first_digit = Math.floor((Math.random()*9)+1);
    var second_digit = Math.floor((Math.random()*5)+1);
    var third_digit = Math.floor((Math.random()*5)+1);
    pin_visitor = first_digit.toString() + second_digit.toString() + third_digit.toString();
    pin_visitor = parseInt(pin_visitor);
  };

  Template.listfriends.group = function() {
    return Friends.find({}).fetch();
  };

  Template.settings.events({
    'click .event_img' : function() {
      $('.create_event').toggle();
    },
    'click .invite_img' : function() {
      $('.inviteFriends').toggle();
    },
    'click .fund_img' : function() {
      $('.funding_needed').toggle();
    }
  });
  Template.create_event.events({
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

  Template.invite_friends.events({
    'click .inviteMore' : function() {
      temp = {name: $('.friend_name').val(), email: $('.email').val(), phone: $('.phone').val()};
      console.log(temp);
      friend.push(temp);
      $('<input type="text" id="first_input" placeholder="enter friends name" class="friend_name" /><input type="email" placeholder="invite friends email" class="email" /><input type="tel" placeholder="555-555-5555" class="phone" /><br />').prependTo('.inviteFriends');
      $('#first_input').focus();
    },
    'click .submitInvite' : function() {
      $('.inviteFriends').hide();
      temp = {name: $('.friend_name').val(), email: $('.email').val(), phone: $('.phone').val()}
      friend.push(temp);
      Friends.insert({
        userID: curUser,
        friend: friend
      }),

      //this._id not working
      Event.update(
        this._id, {$push : {invited: friend}}
      )
    }
  });

  var funding;
  Template.funding.events({
    'click .submitFunding' : function() {
      funding = $('.total_funding').val();
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
