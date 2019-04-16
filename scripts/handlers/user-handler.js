handlers.getRegister = function (ctx) {
  ctx.loadPartials({
    header: 'Templates/common/header.hbs',
    footer: 'Templates/common/footer.hbs'
  }).then(function () {
    this.partial('Templates/register.hbs');
  }).catch(function (err) {
     notify.showError(err);
  });
};

handlers.getLogin = function (ctx) {

  ctx.loadPartials({
    header: 'Templates/common/header.hbs',
    footer: 'Templates/common/footer.hbs'
  }).then(function () {
    this.partial('templates/login.hbs');
  }).catch(function (err) {
    notify.showError(err);
  });
};

handlers.registerUser = function (ctx) {
  let username = ctx.params.username;
  let password = ctx.params.password;
  let repeatPassword = ctx.params.repeatPassword;
  if (repeatPassword !== password) {
    notify.showError('Passwords must match');
    return;
  }
  if(username.length<3){
    notify.showError('Username must be at least 3 symbols');
     return;
  }
  if(password.length<6){
    notify.showError('Passwords must have at least 6 symbols');
     return;
  }

   userService.register(username, password).then((res) => {
    userService.saveSession(res);
    notify.showInfo('User registration successful');
    ctx.redirect('#/home');
  }).catch(function (err) {
    notify.showError('Error: '+err.responseJSON.description);
  });
};

handlers.logoutUser = function (ctx) {
  userService.logout().then(() => {
    sessionStorage.clear();
    notify.showInfo('Logout successful');
    ctx.redirect('#/home');
  })
};

handlers.loginUser = function (ctx) {
  let username = ctx.params.username;
  let password = ctx.params.password;
  userService.login(username, password).then((res) => {
    userService.saveSession(res);
    notify.showInfo('Log in successful');
    ctx.redirect('#/home');
  }).catch(function (err) {
    notify.showError('Error: '+err.responseJSON.description);
  });
};

