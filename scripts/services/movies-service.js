const movieService = (() => {

    function addMovie(data) {
        return kinvey.post('appdata', 'songs', 'Kinvey', data);
    }

    function getAllMovies() {

        return kinvey.get('appdata','movies?query={}&sort={"tickets": -1}','Kinvey');
    }

    function updateMovie(id, data) {
        let endPoint='movies/'+id;
        console.log(endPoint);
        return kinvey.update('appdata',endPoint,'Kinvey',data);
    }

    function deleteMovie(id) {
        let endPoint='movies/'+id;
        return kinvey.remove('appdata',endPoint,'Kinvey');
    }

    function getMovie(id) {
        let endPoint='movies/'+id;
        return kinvey.get('appdata',endPoint,'Kinvey');
    }


    return {
        addMovie,
        getAllMovies,
        getMovie,
        updateMovie,
        deleteMovie

    }
})();