Template.projects.helpers({
	projectList: function () {
		return Projects.find({active: true}, {sort: {createdAt: -1}});
	},
	isOwner: function () {
		return this.owner === Meteor.userId();
	}
});

Template.project.helpers({
	prettyDate: function(date) {
		return moment(date).fromNow();
	}
});