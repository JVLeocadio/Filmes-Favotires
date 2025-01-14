import { MovieAPI } from "./MovieAPI.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@movie-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@movie-favorites:", JSON.stringify(this.entries));
  }

  async add(title) {
    try {
      const movies = await MovieAPI.search(title);
      const movie = movies[0]; // Pega o primeiro resultado da pesquisa
  
      const movieExists = this.entries.find(entry => entry.id === movie.id);
      if (movieExists) {
        throw new Error("Filme já cadastrado");
      }
  
      this.entries = [movie, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(movie) {
    const filteredEntries = this.entries.filter(entry => entry.id !== movie.id);

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();
  
    this.entries.forEach(movie => {
      if (!movie || !movie.title || !movie.poster) {
        console.error("Dados do filme incompletos:", movie);
        return; // Ignora itens com dados inválidos
      }
  
      const row = this.createRow();
  
      const movieLink = `https://www.themoviedb.org/movie/${movie.id}`;
      const imgElement = document.createElement("img");
      imgElement.src = movie.poster;
      imgElement.alt = `Pôster de ${movie.title}`;
  
      const linkElement = document.createElement("a");
      linkElement.href = movieLink;
      linkElement.target = "_blank";
      linkElement.appendChild(imgElement);
  
      const movieCell = row.querySelector(".movie");
      if (movieCell) {
        movieCell.innerHTML = "";
        movieCell.appendChild(linkElement);
  
        // Recria o <p> para o título
        const titleElement = document.createElement("p");
        titleElement.textContent = movie.title;
        movieCell.appendChild(titleElement);
      }
  
      row.querySelector(".approval").textContent = movie.vote_average.toFixed(1);
      row.querySelector(".release").textContent = movie.release_date;
  
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar esse filme?");
        if (isOk) {
          this.delete(movie);
        }
      };
  
      this.tbody.append(row);
    });
  }
  
  
  

  createRow() {
    const tr = document.createElement("tr");
  
    tr.innerHTML = `
      <td class="movie">
        <img src="" alt="">
        <p></p>
      </td>
      <td class="approval"></td>
      <td class="release"></td>
      <td>
        <button class="remove">&times;</button>
      </td>
    `;
    return tr;
  }
  

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach(tr => {
      tr.remove();
    });
  }
}