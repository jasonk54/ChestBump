var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};


Template.main.events({
  'click .create' : function () {
    openCreateDialog();
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