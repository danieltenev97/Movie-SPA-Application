handlers.getAddMovie = function (ctx) {
    isLogged(ctx);
    ctx.loadPartials({
        header: 'Templates/common/header.hbs',
        footer: 'Templates/common/footer.hbs'
    }).then(function () {
        this.partial('Templates/addMovie.hbs');

    }).catch(function (err) {
        notify.showError(err);
    });

};

handlers.addMovie = function (ctx) {

    let title = ctx.params.title;
    let description = ctx.params.description;
    let imageURL = ctx.params.imageUrl;
    let genres = ctx.params.genres;
    let tickets = ctx.params.tickets;
    let isValid = true;

    if (title.length < 6) {
        notify.showError('Title must be at least 6 characters long');
        isValid = false;

    }
    if (description.length < 10) {
        notify.showError('Description must be at least 10 characters long');
        isValid = false;
    }


    if (!imageURL.startsWith('https://') && !imageURL.startsWith('http://')) {
        notify.showError('The image url should start with http:// or https://');
        isValid = false;
    }

    if (isValid) {
        let movieTobeAdded = {
            title,
            description,
            imageURL,
            tickets,
            genres
        };
        kinvey.post('appdata', 'movies', 'Kinvey', movieTobeAdded)
            .then(function () {
                notify.showInfo('Movie created successfully');
                ctx.redirect('#/home');
            }).catch(function (e) {
            notify.showError(e);
        });
    }


    $('#createTitle').val('');
    $('#createDescription').val('');
    $('#createImage').val('');
    $('#createGenres').val('');
    $('#createTickets').val('');

};

handlers.getCinema = async function (ctx) {
    isLogged(ctx);

    let movies = await movieService.getAllMovies();
    movies = sort(movies);
    ctx.movies = movies;
    try {
        ctx.loadPartials({
            header: 'Templates/common/header.hbs',
            footer: 'Templates/common/footer.hbs',
            movie: 'Templates/movie.hbs'
        }).then(function () {
            this.partial('Templates/cinema.hbs');

        });
    } catch (e) {
        notify.showError(e);
    }
};

handlers.getMoviesByGenre = function (ctx) {
    isLogged(ctx);
    let genre = ctx.params.search;
    let moviesByGenre = [];
    movieService.getAllMovies()
        .then(function (movies) {
            for (const movie of movies) {
                let genres = Array.from(movie.genres.split(','));
                let contains = genres.includes(genre);
                if (contains) {
                    moviesByGenre.push(movie);
                }
            }
            moviesByGenre = sort(moviesByGenre);
            ctx.movies = moviesByGenre;
            ctx.loadPartials({
                header: 'Templates/common/header.hbs',
                footer: 'Templates/common/footer.hbs',
                movie: 'Templates/movie.hbs'
            }).then(function () {
                this.partial('Templates/cinema.hbs');

            });

        }).catch(function (e) {
        notify.showError(e);
    })
};

handlers.showMovieDetails = function (ctx) {
    isLogged(ctx);
    let id = ctx.params.id;
    movieService.getMovie(id)
        .then(function (movie) {

            Object.assign(ctx, movie);

            ctx.loadPartials({
                header: 'Templates/common/header.hbs',
                footer: 'Templates/common/footer.hbs',
            }).then(function () {
                this.partial('Templates/MovieDetails.hbs');

            });

        }).catch(function (e) {
        notify.showError(e);
    });

};

handlers.buyTicket = function (ctx) {
    let id = ctx.params.id;
    movieService.getMovie(id)
        .then(function (movie) {
            if (+movie.tickets > 0) {
                movie.tickets = +movie.tickets - 1;
                console.log(movie);
                movieService.updateMovie(id, movie);
                notify.showInfo(`Successfully bought ticket for ${movie.title}!`);
                ctx.redirect('#/cinema');
            }

        })
        .catch(function (e) {
            notify.showError(e);
        });
};

handlers.getMyMovies = async function (ctx) {
    try {
        isLogged(ctx);
        let movies = await movieService.getAllMovies();

        movies.map(s => s.isMyMovie = sessionStorage.getItem('userId') === s._acl.creator);

        movies = movies.filter(m => m.isMyMovie === true);

        movies = sort(movies);

        ctx.myMovies = movies;

        ctx.loadPartials({
            header: 'Templates/common/header.hbs',
            footer: 'Templates/common/footer.hbs',
            myMovie: 'Templates/myMovie.hbs'
        }).then(function () {
            this.partial('Templates/MyMovies.hbs');

        });
    } catch (e) {
        notify.showError(e);
    }
};

handlers.getEditPage = function (ctx) {
    let id = ctx.params.id;
    isLogged(ctx);

    movieService.getMovie(id)
        .then(function (movie) {
            Object.assign(ctx, movie);

            ctx.loadPartials({
                header: 'Templates/common/header.hbs',
                footer: 'Templates/common/footer.hbs',

            }).then(function () {
                this.partial('Templates/editMovie.hbs');

            });
        })
        .catch(function (e) {
            notify.showError(e);
        });


};

handlers.editMovie = function (ctx) {
    let id = ctx.params.id;

    let title = ctx.params.title;
    let description = ctx.params.description;
    let imageURL = ctx.params.imageUrl;
    let genres = ctx.params.genres;
    let tickets = ctx.params.tickets;



    movieService.getMovie(id)
        .then(function (movie) {

            let updatedMovie = {
                title,
                description,
                imageURL,
                tickets,
                genres
            };

            movieService.updateMovie(id, updatedMovie)
                .then(function () {
                    notify.showInfo('Movie info updated successfully');
                    ctx.redirect('#/myMovies');
                });

        })
        .catch(function (e) {
            notify.showError(e);
        });
};

handlers.getDeletePage = function (ctx) {
    let id = ctx.params.id;
    isLogged(ctx);

    movieService.getMovie(id)
        .then(function (movie) {
            Object.assign(ctx, movie);

            ctx.loadPartials({
                header: 'Templates/common/header.hbs',
                footer: 'Templates/common/footer.hbs',

            }).then(function () {
                this.partial('Templates/DeletePage.hbs');

            });
        })
        .catch(function (e) {
            notify.showError(e);
        });
};

handlers.deleteMovie = function (ctx) {
    let id = ctx.params.id;
    movieService.deleteMovie(id)
        .then(function () {
            notify.showInfo('Movie removed successfully!');
            ctx.redirect('#/home');
        })
        .catch(function (e) {
            notify.showError(e);
        });
};

function sort(arr) {
    let sorted = arr.sort(compare);

    function compare(a, b) {
        if (+a.tickets > +b.tickets) {
            return -1;
        }
        if (+a.tickets < +b.tickets) {
            return 1;
        }
        return 0;
    }

    return sorted;
}


function isLogged(ctx) {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');
}