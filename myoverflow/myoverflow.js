// implement login 
// implement show-answer page

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
    'click .submitQuestion' : function() {
      var name = Session.get('name');
      var question = $('.question').val();
      $('h1').hide('slow');
      if (question) {
        Questions.insert({
          text: question,
          askerName: name,
          answer: []
        })
      }
    }
  });

  Template.questionDetails.time = function() {
    var time = moment(this.time).fromNow();
    return time;
  };

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
        Questions.update(
          this._id, {$push : {answer: {text: response}}}
        );
      }
    },
    'click .questionList' : function(event) {
      $('.getQuestion').slideToggle('slow');
      $(event.target).parent().find('.drop_answer_box').slideToggle('fast');
    }
    // 'mouseenter .questionList' : function() {
      
    //     $('.questionList').tooltip()
    //   }
    // }
  });
};

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
