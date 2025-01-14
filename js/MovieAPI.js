export class MovieApi {
static search (title) {
    const endpoint = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`;
    const apiKey = "5c3075df162a217706f07a28b99fc3b4";
    return fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

.then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao buscar filme: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.results || data.results.length === 0) {
          throw new Error("Filme não encontrado");
        }
        return data.results.map(movie => ({
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        }));
      });
  }
}