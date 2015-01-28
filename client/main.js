Meteor.subscribe("projects");

// if (Projects.find().count() === 0 && Meteor.userId()) {
// 	for(i = 0; i<10; i++) {
// 		Meteor.call("addProject", "Project "+i.toString(), "description of Project "+i.toString());
// 	}
// }

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});