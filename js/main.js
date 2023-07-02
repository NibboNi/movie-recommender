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
    const moviesList = document.createElement("ul");
    
    selectedMoviesInfo.innerHTML = `
        <h2>Selected Movies</h2>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="currentcolor">
            <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/>
        </svg>
    `;

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
    movie.textContent = `${movieName}`;
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