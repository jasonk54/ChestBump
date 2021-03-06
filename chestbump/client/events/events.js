Template.events_list.event_list = function () {
  return Games.find({}).fetch();
};
Template.events_list.showDetails = function () {
  if (Session.get('showDetails') === undefined) {
    Session.set('showDetails', false)
  }
  return Session.get('showDetails');
};

Template.events_list.open_spots = function (currentNum, attending) {
  var spots = currentNum - attending.length;
  if (spots <= 0) {
    return false;
  }
  return spots;
};

Template.events_list.events({
  'click .event' : function() {
    Games.findOne(Session.set("selected", this._id));
    Session.set('showDetails', true);
    $('.detailsmodal').toggle('slow');
  }
});

Template.events_list.time_from = function (date) {
  if (date) {
    return moment(date, "YYYYMMDD").fromNow();
  } else {
    return;
  }
};
///////////////////////////////////////////////////////////////////////////////
// Game details sidebar

Template.page.rsvpName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayName(user);
};

Template.details.game = function () {
  return Games.findOne(Session.get("selected"));
};

Template.details.anyGames = function () {
  return Games.find().count() > 0;
};

Template.details.creatorName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

Template.details.canRemove = function () {
  return this.owner === Meteor.userId() && attending(this) === 0;
};

Template.details.maybeChosen = function (what) {
  var myRsvp = _.find(this.rsvps, function (r) {
    return r.user === Meteor.userId();
  }) || {};

  return what == myRsvp.rsvp ? "chosen btn-inverse" : "";
};

Template.details.open_spots = function (currentNum, attending) {
  var spots = currentNum - attending.length;
  if (spots <= 0) {
    return false;
  }
  return spots;
};

Template.details.progress = function (currentNum, attending) {
  var per = attending.length/currentNum
  var percentage = per*100;
  return percentage;
};

var openInviteDialog = function () {
  Session.set("showInviteDialog", true);
};

Template.details.events({
  'click .rsvp_yes': function () {
    Meteor.call("rsvp", Session.get("selected"), "yes");
    return false;
  },
  'click .rsvp_maybe': function () {
    Meteor.call("rsvp", Session.get("selected"), "maybe");
    return false;
  },
  'click .rsvp_no': function () {
    Meteor.call("rsvp", Session.get("selected"), "no");
    return false;
  },
  'click .invite': function () {
    $('.detailsmodal').hide();
    openInviteDialog();
    return false;
  },
  'click .remove': function () {
    Games.remove(this._id);
    return false;
  },
  'click .exit_modal' : function () {
    $('.detailsmodal').hide();
  }
});

///////////////////////////////////////////////////////////////////////////////
// game Gttendance widget

Template.attendance.rsvpName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayName(user);
};

Template.attendance.outstandingInvitations = function () {
  var game = Games.findOne(this._id);
  return Meteor.users.find({$and: [
    {_id: {$in: game.invited}}, // they're invited
    {_id: {$nin: _.pluck(game.rsvps, 'user')}} // but haven't RSVP'd
  ]});
};

Template.attendance.invitationName = function () {
  return displayName(this);
};

Template.attendance.rsvpIs = function (what) {
  return this.rsvp === what;
};

Template.attendance.nobody = function () {
  return ! this.public && (this.rsvps.length + this.invited.length === 0);
};

Template.attendance.canInvite = function () {
  return ! this.public && this.owner === Meteor.userId();
};