var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};


Template.main.events({
  'click .create' : function () {
    openCreateDialog();
  },
  'click .join_events' : function () {
    Session.set("showEvents", true);
    Session.set("showMain", false);
  },
  'click .homepage' : function () {
    Session.set("showMain", true);
    Session.set("showEvents", false);
  }
});

Template.main.showPlan = function () {
  return Session.get('showPlan');
};

Template.main.showEvents = function () {
  return Session.get('showEvents');
};

Template.main.showMain = function () {
  return Session.get('showMain');
};

Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};