const MAX_POKEMON = 300;
const API_BASE = "https://pokeapi.co/api/v2";
const BATCH_SIZE = 24;

let allPokemons = [];
let filteredPokemons = [];
let currentIndex = 0;
let renderIndex = 0;
let isRendering = false;

const pokemonCache = {};
const evolutionCache = {};

const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.getElementById("search-input");
const closeSearchBtn = document.getElementById("search-close-icon");
const notFoundMessage = document.getElementById("not-found-message");

const modalOverlay = document.getElementById("pokemon-modal");
const modal = modalOverlay.querySelector(".modal");
const modalId = document.getElementById("modal-id");
const modalName = document.getElementById("modal-name");
const modalImg = document.getElementById("modal-img");
const modalTypes = document.getElementById("modal-types");
const modalHeight = document.getElementById("modal-height");
const modalWeight = document.getElementById("modal-weight");
const modalExp = document.getElementById("modal-exp");
const modalAbilities = document.getElementById("modal-abilities");
const modalStats = document.getElementById("modal-stats");
const modalEvolution = document.getElementById("modal-evolution");

const closeModalBtn = document.getElementById("close-modal");
const prevBtn = document.getElementById("prev-pokemon");
const nextBtn = document.getElementById("next-pokemon");

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

loadPokemonList();
window.addEventListener("scroll", handleScroll);

async function loadPokemon(id) {
  if (pokemonCache[id]) return pokemonCache[id];
  const res = await fetch(`${API_BASE}/pokemon/${id}`);
  const data = await res.json();
  pokemonCache[id] = data;
  return data;
}

async function loadEvolution(speciesUrl) {
  if (evolutionCache[speciesUrl]) return evolutionCache[speciesUrl];
  const species = await (await fetch(speciesUrl)).json();
  const evo = await (await fetch(species.evolution_chain.url)).json();
  evolutionCache[speciesUrl] = evo;
  return evo;
}

function loadPokemonList() {
  fetch(`${API_BASE}/pokemon?limit=${MAX_POKEMON}`)
    .then((res) => res.json())
    .then((data) => {
      allPokemons = data.results;
      filteredPokemons = [...allPokemons];
      resetAndRender();
    })
    .catch(showError);
}

function resetAndRender() {
  listWrapper.innerHTML = "";
  renderIndex = 0;
  isRendering = false;
  renderNextBatch();
  setTimeout(fillUntilScrollable, 50);
}

async function renderNextBatch() {
  if (isRendering) return;
  isRendering = true;

  const slice = filteredPokemons.slice(renderIndex, renderIndex + BATCH_SIZE);

  for (const ref of slice) {
    const id = getIdFromUrl(ref.url);
    if (listWrapper.querySelector(`[data-id="${id}"]`)) continue;
    const pokemon = await loadPokemon(id);
    const card = createPokemonCard(pokemon);
    card.dataset.id = id;
    listWrapper.appendChild(card);
  }
  renderIndex += BATCH_SIZE;
  isRendering = false;
}

function handleScroll() {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (nearBottom && renderIndex < filteredPokemons.length) {
    renderNextBatch();
  }
}

function fillUntilScrollable() {
  if (
    renderIndex < filteredPokemons.length &&
    document.body.scrollHeight <= window.innerHeight + 50
  ) {
    renderNextBatch().then(() => {
      setTimeout(fillUntilScrollable, 50);
    });
  }
}

function createPokemonCard(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const div = document.createElement("div");
  div.className = `list-item type-${mainType}`;
  div.innerHTML = createPokemonCardHTML(pokemon);
  div.onclick = () => openModalById(pokemon.id);
  return div;
}

async function openModalById(id) {
  currentIndex = filteredPokemons.findIndex((p) => getIdFromUrl(p.url) == id);
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  const pokemon = await loadPokemon(id);
  fillModal(pokemon);
  const evo = await loadEvolution(pokemon.species.url);
  showEvolution(evo.chain);

  updateNavButtons();
  activateTab("main");
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function fillModal(pokemon) {
  modal.className = `modal type-${pokemon.types[0].type.name}`;
  modalId.textContent = `#${pokemon.id.toString().padStart(3, "0")}`;
  modalName.textContent = pokemon.name;
  modalImg.src =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;
  modalHeight.textContent = pokemon.height / 10 + " m";
  modalWeight.textContent = pokemon.weight / 10 + " kg";
  modalExp.textContent = pokemon.base_experience;
  modalAbilities.textContent = pokemon.abilities
    .map((a) => a.ability.name)
    .join(", ");

  modalTypes.innerHTML = "";
  pokemon.types.forEach((t) => {
    const span = document.createElement("span");
    span.className = `type type-${t.type.name}`;
    span.textContent = t.type.name;
    modalTypes.appendChild(span);
  });

  renderStats(pokemon.stats);
}

function renderStats(stats) {
  modalStats.innerHTML = "";
  stats.forEach((stat) => {
    modalStats.innerHTML += `
      <div class="stat">
        <div class="stat-label">
          <small>${stat.stat.name}</small>
          <small>${stat.base_stat}</small>
        </div>
        <div class="stat-bar">
          <span style="width:${Math.min(stat.base_stat, 100)}%"></span>
        </div>
      </div>
    `;
  });
}

function showEvolution(chain) {
  modalEvolution.innerHTML = "";
  renderEvolutionStep(chain);
}

function renderEvolutionStep(chain) {
  const id = getIdFromUrl(chain.species.url);
  modalEvolution.innerHTML += `
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">
  `;
  chain.evolves_to.forEach(renderEvolutionStep);
}

function getSelectedFilter() {
  return document.querySelector('input[name="filters"]:checked').value;
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim().toLowerCase();
  const filter = getSelectedFilter();
  closeSearchBtn.style.display = value ? "block" : "none";
  if (!value) {
    filteredPokemons = [...allPokemons];
    notFoundMessage.style.display = "none";
    resetAndRender();
    return;
  }

  filteredPokemons = allPokemons.filter((p) => {
    const id = getIdFromUrl(p.url);
    const name = p.name.toLowerCase();
    if (filter === "number") {
      return id === value || id.padStart(3, "0") === value;
    }
    if (filter === "name") {
      return name.includes(value);
    }
    return false;
  });

  notFoundMessage.style.display = filteredPokemons.length ? "none" : "flex";

  resetAndRender();
});

document
  .querySelectorAll('input[name="filters"]')
  .forEach((radio) =>
    radio.addEventListener("change", () =>
      searchInput.dispatchEvent(new Event("input")),
    ),
  );

closeSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  closeSearchBtn.style.display = "none";
  filteredPokemons = [...allPokemons];
  notFoundMessage.style.display = "none";
  resetAndRender();
});

prevBtn.onclick = () =>
  currentIndex > 0 &&
  openModalById(getIdFromUrl(filteredPokemons[currentIndex - 1].url));

nextBtn.onclick = () =>
  currentIndex < filteredPokemons.length - 1 &&
  openModalById(getIdFromUrl(filteredPokemons[currentIndex + 1].url));

function updateNavButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === filteredPokemons.length - 1;
}

tabs.forEach((tab) =>
  tab.addEventListener("click", () => activateTab(tab.dataset.tab)),
);

function activateTab(id) {
  tabs.forEach((t) => t.classList.remove("active"));
  tabContents.forEach((c) => c.classList.remove("active"));
  document.querySelector(`[data-tab="${id}"]`).classList.add("active");
  document.getElementById(id).classList.add("active");
}

function getIdFromUrl(url) {
  return url.split("/")[6];
}

function showError() {
  notFoundMessage.style.display = "flex";
  notFoundMessage.textContent = "Fehler beim Laden";
}

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
