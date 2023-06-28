const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2Q1YzI2ZjEyNWYxZGM0NGJkNzViYzI5NzNiZDRjNiIsInN1YiI6IjY0OWIzNjdkYWFkOWMyMDBlMzYxOGY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SVkUF4wrBRAAzSU6Y85lsp1vXRPDDHeucsInmCtCLPc'
    }
};

const searchBar = document.querySelector("#search-bar");
const movies = document.querySelector(".movies");

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
        console.log(moviesResult);
    }
    // fetch(`https://api.themoviedb.org/3/search/movie?query=${movieTitle.textContent}&include_adult=false&language=en-US&page=1`, options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     // .then(response => Titles(response.results))
    //     .catch(err => console.error(err))
    // ;
});

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
        movies.appendChild(moviesContainer);
    });
}

function ClearHTML(container){
    while(container.firstChild) container.removeChild(container.firstChild);
}

// Seleccionar Pelicula -> Obtener generos -> Buscar/Descubrir pelicula por generos.