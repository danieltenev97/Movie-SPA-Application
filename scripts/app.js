const handlers = {};

$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');
        this.get('#/home', handlers.getHome);
        this.get('#/register', handlers.getRegister);
        this.post('#/register', handlers.registerUser);
        this.get('#/login', handlers.getLogin);
        this.post('#/login', handlers.loginUser);
        this.get('#/logout', handlers.logoutUser);
        this.get('#/addMovie',handlers.getAddMovie);
        this.post('#/addMoviePost',handlers.addMovie);
        this.get('#/cinema',handlers.getCinema);
        this.get('#/movieByGenre',handlers.getMoviesByGenre);
        this.get('#/details/:id',handlers.showMovieDetails);
        this.get('#/myMovies',handlers.getMyMovies);
        this.get('#/buy/:id',handlers.buyTicket);
        this.get('#/edit/:id',handlers.getEditPage);
        this.get('#/delete/:id',handlers.getDeletePage);
        this.post('#/delete/:id',handlers.deleteMovie);
        this.post('#/edit/:id',handlers.editMovie);

    });

    app.run('#/home');
});