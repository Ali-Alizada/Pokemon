const MAX_POKEMON = 150;
const API_BASE = "https://pokeapi.co/api/v2";

let allPokemons = [];
let currentIndex = 0;

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

function loadPokemonList() {
  fetch(`${API_BASE}/pokemon?limit=${MAX_POKEMON}`)
    .then((res) => res.json())
    .then((data) => {
      allPokemons = data.results;
      renderPokemonList(allPokemons);
    })
    .catch(showError);
}

async function loadPokemon(id) {
  const res = await fetch(`${API_BASE}/pokemon/${id}`);
  return res.json();
}

async function loadEvolution(speciesUrl) {
  const species = await (await fetch(speciesUrl)).json();
  const res = await fetch(species.evolution_chain.url);
  return res.json();
}

async function renderPokemonList(pokemonArray) {
  listWrapper.innerHTML = "";

  if (pokemonArray.length === 0) {
    notFoundMessage.style.display = "flex";
    return;
  }

  notFoundMessage.style.display = "none";

  for (let i = 0; i < pokemonArray.length; i++) {
    const pokemonRef = pokemonArray[i];
    const id = getIdFromUrl(pokemonRef.url);
    const pokemon = await loadPokemon(id);

    listWrapper.appendChild(createPokemonCard(pokemon, i));
  }
}

function createPokemonCard(pokemon, index) {
  const mainType = pokemon.types[0].type.name;

  const div = document.createElement("div");
  div.className = `list-item type-${mainType}`;

  div.innerHTML = `
    <div class="card-header">
      <span class="pokemon-id">#${pokemon.id.toString().padStart(3, "0")}</span>
      <span class="pokemon-name">${pokemon.name}</span>
    </div>

    <div class="img-wrap">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>

    <div class="type-container">
      ${pokemon.types
        .map(
          (t) =>
            `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`,
        )
        .join("")}
    </div>
  `;

  div.onclick = () => openModal(index);

  return div;
}

async function openModal(index) {
  currentIndex = index;

  const pokemonRef = allPokemons[index];
  const id = getIdFromUrl(pokemonRef.url);

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  const pokemon = await loadPokemon(id);
  const evoData = await loadEvolution(pokemon.species.url);

  fillModal(pokemon);
  showEvolution(evoData.chain);
  updateNavButtons();
  activateTab("main");
}

function fillModal(pokemon) {
  modal.className = `modal type-${pokemon.types[0].type.name}`;

  modalId.textContent = `#${pokemon.id.toString().padStart(3, "0")}`;
  modalName.textContent = pokemon.name;
  modalImg.src = pokemon.sprites.other["official-artwork"].front_default;

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
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
         alt="${chain.species.name}">
  `;

  chain.evolves_to.forEach((evo) => renderEvolutionStep(evo));
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim().toLowerCase();
  closeSearchBtn.style.display = value ? "block" : "none";

  if (!value) {
    renderPokemonList(allPokemons);
    return;
  }

  const filtered = allPokemons.filter((pokemon) => {
    const id = getIdFromUrl(pokemon.url);
    return pokemon.name.includes(value) || id.startsWith(value);
  });

  renderPokemonList(filtered);
});

closeSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  closeSearchBtn.style.display = "none";
  renderPokemonList(allPokemons);
  notFoundMessage.style.display = "none";
  searchInput.focus();
});

prevBtn.onclick = () => currentIndex > 0 && openModal(currentIndex - 1);
nextBtn.onclick = () =>
  currentIndex < allPokemons.length - 1 && openModal(currentIndex + 1);

function updateNavButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === allPokemons.length - 1;
}

tabs.forEach((tab) => {
  tab.onclick = () => activateTab(tab.dataset.tab);
});

function activateTab(id) {
  tabs.forEach((t) => t.classList.remove("active"));
  tabContents.forEach((c) => c.classList.remove("active"));

  document.querySelector(`[data-tab="${id}"]`).classList.add("active");
  document.getElementById(id).classList.add("active");
}

closeModalBtn.onclick = closeModal;
modalOverlay.onclick = (e) => e.target === modalOverlay && closeModal();

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (!modalOverlay.classList.contains("active")) return;

  if (e.key === "ArrowLeft" && currentIndex > 0) openModal(currentIndex - 1);
  if (e.key === "ArrowRight" && currentIndex < allPokemons.length - 1)
    openModal(currentIndex + 1);
  if (e.key === "Escape") closeModal();
});

function getIdFromUrl(url) {
  return url.split("/")[6];
}

function showError() {
  notFoundMessage.style.display = "flex";
  notFoundMessage.textContent = "Fehler beim Laden";
}
