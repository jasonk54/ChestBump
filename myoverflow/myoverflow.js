Questions = new Meteor.Collection('questions');

if (Meteor.isClient) {

  Meteor.Router.add({
    '/': function() {
      if(Session.get('name')){
        return 'getQuestion';
      } else {
        return 'getName';
      }
    }
  }); 

  Handlebars.registerHelper('session',function(input){
    return Session.get(input);
  });

  Template.getName.events({
    'click .submitName' : function() {
      // $('.greeting').hide();
      var posterName = $('.enterName').val();
      if(posterName) {
        Session.set('name', posterName);
        $('.getName').hide();
        $('.greeting').hide();

      }
    }
  });

  Template.getQuestion.events({
    //need to call getName
    'click .submitQuestion' : function() {
      var name = Session.get('name');
      var question = $('.question').val();
      if (question) {
        Questions.insert({
          text: question,
          askerName: name
          // need to link the user to the questions
        })
      }
    }
  });

  Template.questionsList.questions = function() {
    return Questions.find({});
  }
};

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
