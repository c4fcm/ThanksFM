// Only publish projects that are public or belong to the current user
Meteor.publish("projects", function () {
	return Projects.find({
		$or: [
			{ private: false },
			{ owner: this.userId }
		]
	});
});

Meteor.methods({
	addProject: function (title, description) {
		// Make sure the user is logged in before inserting a project
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		currentDate = new Date();

		Projects.insert({
			title: title,
			description: description,
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