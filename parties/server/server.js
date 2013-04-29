Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};

displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};


Meteor.methods({
  // options should include: title, description, funding, date, public
  createParty: function (options) {
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (options.funding.length < 0)
      throw new Meteor.Error(413, "Need to add at least one player");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    return Parties.insert({
      owner: this.userId,
      title: options.title,
      description: options.description,
      public: !! options.public,
      date: options.date,
      funding: options.funding,
      invited: [],
      rsvps: []
    });
  },

  invite: function (partyId, userId) {
    var party = Parties.findOne(partyId);
    if (! party || party.owner !== this.userId)
      throw new Meteor.Error(404, "No such party");
    if (party.public)
      throw new Meteor.Error(400,
                             "That party is public. No need to invite people.");
    if (userId !== party.owner && ! _.contains(party.invited, userId)) {
      Parties.update(partyId, { $addToSet: { invited: userId } });
      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));

      // For twilio account
      var from_sms = "+14159928245";
      var body_content = "testing hello"
      var accountSid = "AC3dbd3aa966f48b71ba678baf938f5cbc"
      // var checkedBox = $('#email_checkbox').attr('checked');

      if (Meteor.isServer && to) {
        Email.send({
          from: "jasonk54@gmail.com",
          to: to,
          replyTo: from || undefined,
          subject: "PARTY: " + party.title,
          text:
            "Can you come to '" + party.title + "' on (insert date)." +
            "\n\nLet me know on: " + Meteor.absoluteUrl() + "\n"
        });

        // Twilio api for sending text.
        Meteor.http.post('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/SMS/Messages.json',
        {
          params : {From: from_sms, To: '+12139250776', Body: body_content},
          auth: accountSid + ':9c5b65f71f3abe3546e531118f57188b',
          headers: {'content-type':'application/x-www-form-urlencoded'}
        }, function () {
            console.log(arguments)
          }
        );
      }
    }
  },

  rsvp: function (partyId, rsvp) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");
    var party = Parties.findOne(partyId);
    if (! party)
      throw new Meteor.Error(404, "No such party");
    if (! party.public && party.owner !== this.userId &&
        !_.contains(party.invited, this.userId))
      // private, but let's not tell this to the user
      throw new Meteor.Error(403, "No such party");

    var rsvpIndex = _.indexOf(_.pluck(party.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Parties.update(
          {_id: partyId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        Parties.update(partyId, modifier);
      }
    } else {
      // add new rsvp entry
      Parties.update(partyId,
                     {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  }
});