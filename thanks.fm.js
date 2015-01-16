Projects = new Mongo.Collection("projects");

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("projects");

  Template.home.helpers({
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

  Template.projectInfo.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
    contributorList: function() {
      return this.contributors;
    }
  });

  Template.projectInfo.events({
    "submit .addContributorForm": function (event) {
      var contributorText = event.target.contributor.value;
      Meteor.call("addContributor", this._id, contributorText);
      event.target.contributor.value = "";
      return false;
    },
    "click .delete": function () {
      Meteor.call("deleteProject", this._id);
      Router.go('/');
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
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
    }
  });

  Template.projects.events({
    "click .delete": function () {
      Meteor.call("deleteProject", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}


if (Meteor.isServer) {
  // Only publish projects that are public or belong to the current user
  Meteor.publish("projects", function () {
    return Projects.find({
      $or: [
        { private: false },
        { owner: this.userId }
      ]
    });
  });

  // if (Projects.find().count() === 0) {
  //   Meteor.call("addProject", "Project 1", "description of Project 1");
  // };

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
        private: true,
        contributors: []
      });
    },
    addContributor: function (projectId, contributorText) {
      var project = Projects.findOne(projectId);
      if (Meteor.userId() === project.owner) {
        Projects.update(project._id, { $addToSet: { contributors: contributorText }});
      } else {
        throw new Meteor.Error("not-authorized");
      }
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
      if (project.owner === Meteor.userId()) {
        Projects.update(projectId, { $set: { private: setToPrivate } });
      } else {
        throw new Meteor.Error("not-authorized");
      }
    }
  });
}