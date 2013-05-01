Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("games", function () {
  return Games.find(
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
  createGame: function (options) {
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (options.people_count.length < 0)
      throw new Meteor.Error(413, "Need to add at least one player");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    if (! options.where.length)
      throw new Meteor.Error(413, "Please enter location");

    return Games.insert({
      owner: this.userId,
      title: options.title,
      description: options.description,
      public: !! options.public,
      date: options.date,
      where: options.where,
      people_count: options.people_count,
      invited: [],
      rsvps: []
    });
  },

  invite: function (gameId, userId) {
    var game = Games.findOne(gameId);
    if (! game || game.owner !== this.userId)
      throw new Meteor.Error(404, "No events");
    if (game.public)
      throw new Meteor.Error(400,
                             "Public game. No need to invite people.");
    if (userId !== game.owner && ! _.contains(game.invited, userId)) {
      Games.update(gameId, { $addToSet: { invited: userId } });
      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      var body_content = "Are you game for " + game.title + " on " + game.date + "." +
            "\n\nLook me up on: " + Meteor.absoluteUrl() + " to rsvp.  Don't forget!\n";

      if (Meteor.isServer && to) {
        Email.send({
          from: "devuseonly@gmail.com",
          to: to,
          replyTo: from || undefined,
          subject: "Game: " + game.title,
          text: body_content
        });

      // For twilio account.  Uncomment to use.
      // var from_sms = "+14159928245";
      // var to_sms = "+12139250776";
      // var accountSid = "AC5933d34eda950c0bb81ed94811a9c13c";
      // var authToken = "99143cc9267d4ad6db22cdc12856ad5a";
      // var checkedBox = $('#email_checkbox').attr('checked');

      // Phone numbers.  Refactor to retrieve phone numbers at login
      // var jasonkang = {"cDprEHottRJ8h3eLg" : "+12139250776"};
      // var chad = {"a6MZpZFkSSiZQztdy" : "+15038609618"};
      // var andrew = {"qa9EdxB2fqjYyHCvj" : "+17816401203"};
      // var tony = {"76hJagT9eDp9F9SA9" : "+19494446451"};
      // var dan = {"KKWqxoH8YfrxdB5nW" : "+15133074346"};
      // var jasonk54 = {"yWW2gubi82CjtSw39" : "+12139250776"};

      // var contacts = [jasonkang, chad, andrew, tony, dan, jasonk54];
      // var to_sms;

      // _.each(contacts, function(el) {
      //   if (Object.keys(el) === Meteor.users.findOne(userId)) {
      //     to_sms = el[Meteor.users.findOne(userId)];
      //   }
      // });
      // console.log(to_sms);

      //   // Uncomment to send text
      //   // Twilio to send out SMS to players
      //   var client_twilio = Twilio(accountSid, "99143cc9267d4ad6db22cdc12856ad5a");
      //   client_twilio.sendSms({
      //       to: to_sms,
      //       from: from_sms,
      //       body: body_content
        // }, function(err, responseData) {
        //     if (!err) {
        //         console.log(responseData.from); // outputs "+14506667788"
        //         console.log(responseData.body); // outputs "word to your mother."
        //     } else {
        //       console.log(err);
        //     }
        // });
      };
    }
  },

  rsvp: function (gameId, rsvp) {
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");
    var game = Games.findOne(gameId);
    if (! game)
      throw new Meteor.Error(404, "No such game");
    if (! game.public && game.owner !== this.userId &&
        !_.contains(game.invited, this.userId))
      throw new Meteor.Error(403, "No such game");

    var rsvpIndex = _.indexOf(_.pluck(game.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      // update existing rsvp entry

      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Games.update(
          {_id: gameId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } else {
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        Games.update(gameId, modifier);
      }
    } else {
      Games.update(gameId,
                     {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  }
});