Projects = new Mongo.Collection("projects");

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("projects");

  Template.body.helpers({
    projectCount: function () {
      return Projects.find({active: true}).count();
    }
  });

  Template.projects.helpers({
    projectList: function () {
      return Projects.find({active: true}, {sort: {createdAt: -1}});
    },
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.newProjectForm.events({
    "submit form": function (event) {
      // This function is called when the new project form is submitted
      var titleText = event.target.title.value;
      var descriptionText = event.target.description.value;

      Meteor.call("addProject", titleText, descriptionText);

      // Clear form
      event.target.title.value = "";
      event.target.description.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.projects.events({
    "click .delete": function () {
      Meteor.call("deleteProject", this._id);
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addProject: function (titleText, descriptionText) {
    // Make sure the user is logged in before inserting a project
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    currentDate = new Date();

    Projects.insert({
      title: titleText,
      description: descriptionText,
      createdAt: currentDate,
      updatedAt: currentDate,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      active: true,
      private: true
    });
  },
  deleteProject: function (projectId) {
    var project = Projects.findOne(projectId);
    if (project.owner === Meteor.userId()) {
      Projects.update(projectId, { $set: { active: false } });
      //Projects.remove(projectId);
    } else {
      throw new Meteor.Error("not-authorized");
    }
  },
  setPrivate: function (projectId, setToPrivate) {
    var project = Projects.findOne(projectId);

    // Make sure only the project owner can make a project private
    if (project.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Projects.update(projectId, { $set: { private: setToPrivate } });
  }
});

if (Meteor.isServer) {
  // Only publish projects that are public or belong to the current user
  Meteor.publish("projects", function () {
    return Projects.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}