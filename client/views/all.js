Template.home.helpers({
	projectCount: function () {
		return Projects.find({active: true}).count();
	}
});

Template.projectPage.helpers({
	isOwner: function () {
		return this.owner === Meteor.userId();
	},
	contributorList: function() {
		return this.contributors;
	}
});

Template.projectPage.events({
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