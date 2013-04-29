Template.events_list.event_list = function () {
  return Parties.find({}).fetch();
};
Template.events_list.showDetails = function () {
  if (Session.get('showDetails') === undefined) {
    Session.set('showDetails', false)
  }
  return Session.get('showDetails');
};

Template.events_list.events({
  'click .event' : function() {
    Parties.findOne(Session.set("selected", this._id));
    Session.set('showDetails', true);
  },
  //add tooltip: names
  'mouseover .event' : function() {
    $('.event').tooltip('show');
  }
});

Template.events_list.time = function (date) {
  if (date) {
    return moment(date, "YYYYMMDD").fromNow();
  } else {
    return;
  }
};
///////////////////////////////////////////////////////////////////////////////
// Party details sidebar

Template.page.rsvpName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayName(user);
};

Template.details.party = function () {
  return Parties.findOne(Session.get("selected"));
};

Template.details.anyParties = function () {
  return Parties.find().count() > 0;
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
  console.log(percentage)
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
    openInviteDialog();
    return false;
  },
  'click .remove': function () {
    Parties.remove(this._id);
    return false;
  }
});

///////////////////////////////////////////////////////////////////////////////
// Party attendance widget

Template.attendance.rsvpName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayName(user);
};

Template.attendance.outstandingInvitations = function () {
  var party = Parties.findOne(this._id);
  return Meteor.users.find({$and: [
    {_id: {$in: party.invited}}, // they're invited
    {_id: {$nin: _.pluck(party.rsvps, 'user')}} // but haven't RSVP'd
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