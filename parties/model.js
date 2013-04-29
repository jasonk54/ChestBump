Parties = new Meteor.Collection("parties");

Parties.allow({
  insert: function (userId, party) {
    return false; // no inserts -- use createParty method
  },
  update: function (userId, party, fields, modifier, funding) {
    if (userId !== party.owner)
      return false; // not the owner

    var allowed = ["title", "description"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field
    return true;
  },
  remove: function (userId, party) {
    // You can only remove parties that you created and nobody is going to.
    return party.owner === userId && attending(party) === 0;
  }
});

attending = function (party) {
  return (_.groupBy(party.rsvps, 'rsvp').yes || []).length;
};



///////////////////////////////////////////////////////////////////////////////
// Users

displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};
