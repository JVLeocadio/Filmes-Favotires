export class MovieAPI {
static search (title) {
    const endpoint = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`;
    const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzMwNzVkZjE2MmEyMTc3MDZmMDdhMjhiOTlmYzNiNCIsIm5iZiI6MTczNjg1MDAxNS42MDYwMDAyLCJzdWIiOiI2Nzg2M2E1ZjYyZThmYTYyOWRiYjA5MzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rO-Nw0WSu9-eEVM2A9TepFsA3NO8DPwEnta3pCyBlzU";
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
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "caminho_para_imagem_padrao.png", // Fallback para imagem padrão
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        }));
        
      });
  }
}