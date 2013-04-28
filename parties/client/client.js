Meteor.subscribe("directory");
Meteor.subscribe("parties");

// If no party selected, select one.
Meteor.startup(function () {
  Deps.autorun(function () {
    openCreateDialog();
    $('#calendar').fullCalendar({});
    if (! Session.get("selected")) {
      // Refactor this to show the highest rsvp event
      var party = Parties.findOne();
      if (party)
        Session.set("selected", party._id);
    }
  });
});
///////////////////////////////////////////////////////////////////////////////
// Party details sidebar

Template.page.rsvpName = function () {
  var user = Meteor.users.findOne(this.user);
  return displayName(user);
};

// Uncomment if you want modal
// Template.page.events({
//   'click .newEvent' : function () {
//     openCreateDialog();
//   }
// });

Template.fundings.funds = function () {

};

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
    console.log(this);
  }
});

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

///////////////////////////////////////////////////////////////////////////////
// Create Party dialog

var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var funding = template.find(".funding").value;
    var description = template.find(".description").value;
    var event_date = template.find(".date").value;
    var public = ! template.find(".private").checked;
    console.log(funding)
    if (title.length && description.length) {
      Meteor.call('createParty', {
        title: title,
        funding: funding,
        date: event_date,
        description: description,
        public: public
      }, function (error, party) {
        if (! error) {
          Session.set("selected", party);
          if (! public && Meteor.users.find().count() > 1)
            openInviteDialog();
        }
      });
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
                  "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.error = function () {
  return Session.get("createError");
};

///////////////////////////////////////////////////////////////////////////////
// Invite dialog

var openInviteDialog = function () {
  Session.set("showInviteDialog", true);
};

Template.page.showInviteDialog = function () {
  return Session.get("showInviteDialog");
};

Template.inviteDialog.events({
  'click .invite': function (event, template) {
    Meteor.call('invite', Session.get("selected"), this._id);
  },
  'click .done': function (event, template) {
    Session.set("showInviteDialog", false);
    return false;
  }
});

Template.inviteDialog.uninvited = function () {
  var party = Parties.findOne(Session.get("selected"));
  if (! party)
    return []; // party hasn't loaded yet
  return Meteor.users.find({$nor: [{_id: {$in: party.invited}},
                                   {_id: party.owner}]});
};

Template.inviteDialog.displayName = function () {
  return displayName(this);
};

Template.friends_list.names = function () {
  return Meteor.users.find({}).fetch();
}

// Add this back if you want modal
// <template name="createDialog">
//   <div class="mask"> </div>
//   <div class="modal modalbox">
//     <div class="modal-header">
//       <button type="button" class="close cancel">&times;</button>
//       <h3>Add party</h3>
//     </div>

//     <div class="modal-body">
//       {{#if error}}
//         <div class="alert alert-error">{{error}}</div>
//       {{/if}}

//       <label>Title</label>
//       <input type="text" class="title span5">

//       <label>Funding Needed</label>
//       <input type="number" class="funding span5">

//       <label>Date Proposed</label>
//       <input type="date" class="date">

//       <label>Description</label>
//       <textarea class="description span5"></textarea>

//       <label class="checkbox">
//         <input type="checkbox" class="private">
//         Private party &mdash; invitees only
//       </label>
//     </div>

//     <div class="modal-footer">
//       <a href="#" class="btn cancel">Cancel</a>
//       <a href="#" class="btn btn-primary save">Add party</a>
//     </div>
//   </div>
// </template>
