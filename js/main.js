const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2Q1YzI2ZjEyNWYxZGM0NGJkNzViYzI5NzNiZDRjNiIsInN1YiI6IjY0OWIzNjdkYWFkOWMyMDBlMzYxOGY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SVkUF4wrBRAAzSU6Y85lsp1vXRPDDHeucsInmCtCLPc'
    }
};

const searchBar = document.querySelector("#search-bar");
const movies = document.querySelector(".movies");
const recommendBtn = document.querySelector(".recommendation");
let moviesID = [];

document.addEventListener("DOMContentLoaded", () => {
    
    searchBar.addEventListener("change", async() => {
        if(searchBar.value){
            const query = searchBar.value.trim();
            const movieTitle = document.createElement("h2");
            movieTitle.textContent = `Results for: ${query}`;
        
            ClearHTML(movies);
            movies.appendChild(movieTitle);
        
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, options)
            const { results: moviesResult } = await response.json();
            CreateMovieCard(moviesResult);
            searchBar.value = "";
        }
    });
})


function CreateMovieCard(results = []){
    const moviesContainer = document.createElement("div");
    moviesContainer.classList.add("movies__container");

    results.forEach(result => {
        const movieContainer = document.createElement("div");
        const movieTitle = document.createElement("h3");
        const movieCover = document.createElement("img");

        movieTitle.textContent = result.original_title;
        movieCover.src = result.poster_path ? `https://image.tmdb.org/t/p/w1280${result.poster_path}` : "/imgs/no_cover.png";
        movieCover.alt = result.poster_path ? `${result.original_title} cover` : `unavailable ${result.original_title} cover`;

        movieContainer.appendChild(movieCover);
        movieContainer.appendChild(movieTitle);

        moviesContainer.appendChild(movieContainer);
        movieContainer.onclick = () => {
            movieCover.classList.toggle("movie-added");
            setTimeout( () => {
                movieCover.classList.toggle("movie-added");
            }, 300);

            if(!document.body.contains(document.querySelector(".selected-movies"))) CreateSelectedMoviesList();
            // else if( moviesID.length <= 0 && ) document.querySelector(".selected-movies").remove();

            if(!moviesID.includes(result.id)){
                moviesID.push(result.id);
                FillSelectedMoviesList(result.original_title, result.id);
            }
            
            if(moviesID.length >= 5){
                recommendBtn.classList.remove("recommendation--hide");
                recommendBtn.classList.add("recommendation--show");
            } 
            else{
                recommendBtn.classList.add("recommendation--hide");
                recommendBtn.classList.remove("recommendation--show");
            }
        }

        movies.appendChild(moviesContainer);
    });
}

function CreateSelectedMoviesList(){
    const selectedMovies = document.createElement("div");
    const selectedMoviesInfo = document.createElement("div");
    const selectedMoviesInfoTitle = document.createElement("h2");
    const selectedMoviesInfoIcon = document.createElement("i");
    const moviesList = document.createElement("ul");

    selectedMoviesInfoTitle.textContent = "Selected Movies";
    selectedMoviesInfoIcon.classList.add("fa-solid", "fa-film");
    
    selectedMoviesInfo.appendChild(selectedMoviesInfoTitle);
    selectedMoviesInfo.appendChild(selectedMoviesInfoIcon);

    selectedMovies.classList.add("selected-movies");
    selectedMoviesInfo.classList.add("selected-movies__info");
    moviesList.classList.add("selected-movies__list");

    selectedMovies.appendChild(selectedMoviesInfo);
    selectedMovies.appendChild(moviesList);

    document.body.insertBefore(selectedMovies, movies);
}

function FillSelectedMoviesList(movieName, id){
    const list = document.querySelector(".selected-movies__list");
    const movie = document.createElement("li");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-circle-xmark");
    movie.textContent = `${movieName}`;
    movie.appendChild(icon);
    movie.onclick = () => {
        movie.remove();
        moviesID = moviesID.filter( movie => movie != id);
        if(moviesID.length >= 5){
            recommendBtn.classList.remove("recommendation--hide");
            recommendBtn.classList.add("recommendation--show");
        }
        else{
            recommendBtn.classList.add("recommendation--hide");
            recommendBtn.classList.remove("recommendation--show");
        }

        if(moviesID.length <= 0) document.querySelector(".selected-movies").remove();
    }
    list.appendChild(movie);
}

function MovieDetails(id){
    // fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
    //     .then(response => response.json())
    //     .then(response => console.log(response.genres))
    //     .catch(err => console.error(err))
    // ;
}

function ClearHTML(container){
    while(container.firstChild) container.removeChild(container.firstChild);
}

// Seleccionar Pelicula -> Obtener generos -> Buscar/Descubrir pelicula por generos.