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
      var posterName = $('.enterName').val();
      if(posterName) {
        Session.set('name', posterName);
        $('.getName').hide();
      }
    }
  });

  Template.getQuestion.events({
    //need to call getName
    'click .submitQuestion' : function() {
      var name = Session.get('name');
      var question = $('.question').val();
      $('h1').hide();
      if (question) {
        Questions.insert({
          text: question,
          askerName: name,
          answer: null
          // need to link the user to the questions
        })
      }
    }
  });

  Template.questionList.questions = function() {
    return Questions.find({}).fetch().reverse();
  };

  Template.questionDetails.select_question = function() {
    var question = Questions.findOne(Session.get('text'));
    return question;
  };

  Template.questionDetails.events({
    'click .submitAnswer' : function(event) {
      var response = $(event.target).parent().find('.answer').val();
      if(response) {
        console.log(this);
        Questions.update(
          this._id, {$set : {answer: response}}
        );
      }
    },
    'click .questionList' : function(event) {
      $(event.target).parent().find('.drop_answer_box').toggle();
    }
  });
};

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
