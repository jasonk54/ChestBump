Posters = new Meteor.Collection('posters');

if (Meteor.isClient) {
  Template.Names.name = function () {
    var posterName = document.getElementByClass('name').value;
    Posters.insert({name: posterName}) 
  };

  Template.Names.getName = function () {
    var posterName = document.getElementByClass('getName').value;
    Posters.insert({name: posterName}) 
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
