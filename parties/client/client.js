Meteor.subscribe("directory");
Meteor.subscribe("games");

Meteor.startup(function () {
  open_main();
  close_events();

  Deps.autorun(function () {
    if (! Session.get("selected")) {
      // Refactor this to show the highest rsvp event
      var game = Games.findOne();
      if (game)
        Session.set("selected", game._id);
    }
  });
});
///////////////////////////////////////////////////////////////////////////////
// Create game dialog


var open_main = function() {
  Session.set('showMain', true);
};

var close_events = function() {
  Session.set("showEvents", false);
};

Template.createDialog.events({
  // Need to add location val()
  // Need to change people_count to people_needed
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var people_count = template.find(".people_count").value;
    var description = template.find(".description").value;
    var event_date = template.find(".date").value;
    var public = ! template.find(".private").checked;

    if (title.length && description.length) {
      Meteor.call('createGame', {
        title: title,
        people_count: people_count,
        date: event_date,
        description: description,
        public: public
      }, function (error, game) {
        if (! error) {
          Session.set("selected", game);
          if (! public && Meteor.users.find().count() > 1)
            openInviteDialog();
        }
      });
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
                  "It needs a title and a description, or why bother?");
    }
    Session.set("showMain", false);
    Session.set('showEvents', true)
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
    Session.set('showEvents', true)
    Session.set('showMain', false)
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
  var game = Games.findOne(Session.get("selected"));
  if (! game)
    return []; // game hasn't loaded yet
  return Meteor.users.find({$nor: [{_id: {$in: game.invited}},
                                   {_id: game.owner}]});
};

Template.inviteDialog.displayName = function () {
  return displayName(this);
};

Template.friends_list.names = function () {
  return Meteor.users.find({}).fetch();
};

// Add this back if you don't modal
// <template name="createDialog">
//   <div>
//     <div>
//       {{#if error}}
//         <div class="alert alert-error">{{error}}</div>
//       {{/if}}
//       <label>Title</label>
//       <input type="text" class="title span5">

//       <label>Minimum Needed</label>
//       <input type="number" class="people_count span">

//       <label>Date Proposed</label>
//       <input type="date" class="date">

//       <label>Description</label>
//       <textarea class="description span5"></textarea>

//       <label class="checkbox">
//         <input type="checkbox" class="private" checked="checked">
//           Private game &mdash; invitees only
//       </label>
//     </div>

//     <div>
//       <a href="#plan" class="btn cancel">Cancel</a>
//       <a href="#events" class="btn btn-primary save">Add Event</a>
//     </div>
//   </div>
// </template>



