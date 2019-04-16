handlers.getHome = function (ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username');

  ctx.loadPartials({
    header: 'Templates/common/header.hbs',
    footer: 'Templates/common/footer.hbs'
  }).then(function () {
    this.partial('Templates/home.hbs');

  }).catch(function (err) {
    notify.showError(err);
  });
};