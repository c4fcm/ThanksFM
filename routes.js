// Router.onBeforeAction(function(pause) {
//   if(!this.ready()) {
//     this.render('loading');
//     //pause();
//   } else {
//     this.next();
//   }
// });

Router.map(function(){
  this.route('home', {path: '/'} );
  this.route('test', {
    path: '/test',
    data: function() {
      var testvar = {testvar:"helloworld"};
      return testvar;
    }
  });
  this.route('projectInfo', {
    path: '/projects/:projectId',
    data: function() {
      var projectId = this.params.projectId;
      var project = Projects.findOne(projectId);
      if (project != null && (Meteor.user().username === project.username || !project.private)) {
        return project;
      } /**else {
        throw new Meteor.Error("not-authorized");
      }**/
    },
    waitOn: function() {
      return Meteor.subscribe("projects");
    }
  });
  this.route('userInfo', {
    path: 'users/:username',
    data: function() {
      var usernameParam = this.params.username;
      console.log(usernameParam);
      return Projects.find({username: usernameParam});
      // if (Meteor.user().username === usernameParam) {
      //   return Projects.find({username: usernameParam, active: true});
      // } else {
      //   return Projects.find({username: usernameParam, private: false, active: true});
      // }
    },
    template: "projects"
  });
});

// Router.configure({
//   loadingTemplate: 'loading'
// });