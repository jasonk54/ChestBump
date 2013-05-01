Games = new Meteor.Collection("games");

Games.allow({
  insert: function (userId, game) {
    return false;
  },
  update: function (userId, game, fields, modifier, people_count) {
    if (userId !== game.owner)
      return false;

    var allowed = ["title", "description"];
    if (_.difference(fields, allowed).length)
      return false;
    return true;
  },
  remove: function (userId, game) {
    return game.owner === userId && attending(game) === 0;
  }
});

attending = function (game) {
  return (_.groupBy(game.rsvps, 'rsvp').yes || []).length;
};

// Users
displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};


