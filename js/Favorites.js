import { MovieAPI } from "/MovieAPI.js";

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
      const movieExists = this.entries.find(entry => entry.title === title);
      if (movieExists) {
        throw new Error("Filme já cadastrado");
      }

      const movies = await MovieAPI.search(title);
      const movie = movies[0]; // Pega o primeiro resultado da pesquisa

      this.entries = [movie, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(movie) {
    const filteredEntries = this.entries.filter(entry => entry.title !== movie.title);

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
      const row = this.createRow();
      row.querySelector(".movie img").src = movie.poster;
      row.querySelector(".movie img").alt = `Pôster de ${movie.title}`;
      row.querySelector(".movie p").textContent = movie.title;
      row.querySelector(".approval").textContent = movie.vote_average;
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