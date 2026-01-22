const maxPokemon = 150;

let allPokemon = [];
let currentIndex = 0;
let pokemonCache = {};

const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.getElementById("search-input");
const numberFilter = document.getElementById("number");
const nameFilter = document.getElementById("name");
const notFoundMessage = document.getElementById("not-found-message");
const closeButton = document.querySelector(".search-close-icon");

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
const closeBtn = document.getElementById("close-modal");
const prevBtn = document.getElementById("prev-pokemon");
const nextBtn = document.getElementById("next-pokemon");

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}`)
  .then((res) => res.json())
  .then((data) => {
    allPokemon = data.results;
    showPokemons(allPokemon);
  });

async function showPokemons(pokemonList) {
  listWrapper.innerHTML = "";

  for (let index = 0; index < pokemonList.length; index++) {
    const pokemonRef = pokemonList[index];
    const id = pokemonRef.url.split("/")[6];

    let pokemon;
    if (pokemonCache[id]) {
      pokemon = pokemonCache[id].pokemon;
    } else {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      pokemon = await res.json();
      pokemonCache[id] = { pokemon };
    }

    const mainType = pokemon.types[0].type.name;

    const card = document.createElement("div");
    card.className = `list-item type-${mainType}`;

    card.innerHTML = `
      <div class="card-header">
        <span class="pokemon-id">#${id}</span>
        <span class="pokemon-name">${pokemonRef.name}</span>
      </div>

      <div class="img-wrap">
        <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemonRef.name}">
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

    card.addEventListener("click", () => {
      const realIndex = allPokemon.findIndex((p) => p.name === pokemonRef.name);
      openModalByIndex(realIndex);
    });

    listWrapper.appendChild(card);
  }
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allPokemon.filter((pokemon, index) => {
    const id = (index + 1).toString();
    return numberFilter.checked
      ? id.startsWith(value)
      : pokemon.name.startsWith(value);
  });

  showPokemons(filtered);
  notFoundMessage.style.display = filtered.length ? "none" : "flex";
});

closeButton.addEventListener("click", clearSearch);
function clearSearch() {
  searchInput.value = "";
  showPokemons(allPokemon);
  notFoundMessage.style.display = "none";
}

async function openModalByIndex(index) {
  currentIndex = index;
  const pokemonRef = allPokemon[index];
  const id = pokemonRef.url.split("/")[6];

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  if (!pokemonCache[id].evoChain) {
    const pokemon = pokemonCache[id].pokemon;
    const species = await fetch(pokemon.species.url).then((r) => r.json());
    const evoChain = await fetch(species.evolution_chain.url).then((r) =>
      r.json(),
    );
    pokemonCache[id].evoChain = evoChain;
  }

  const { pokemon, evoChain } = pokemonCache[id];

  modal.className = `modal type-${pokemon.types[0].type.name}`;

  modalId.textContent = `#${pokemon.id}`;
  modalName.textContent = pokemon.name;
  modalImg.src = pokemon.sprites.other["official-artwork"].front_default;

  modalTypes.innerHTML = "";
  pokemon.types.forEach((t) => {
    const span = document.createElement("span");
    span.className = `type type-${t.type.name}`;
    span.textContent = t.type.name;
    modalTypes.appendChild(span);
  });

  modalHeight.textContent = pokemon.height / 10 + " m";
  modalWeight.textContent = pokemon.weight / 10 + " kg";
  modalExp.textContent = pokemon.base_experience;
  modalAbilities.textContent = pokemon.abilities
    .map((a) => a.ability.name)
    .join(", ");

  modalStats.innerHTML = "";
  pokemon.stats.forEach((stat) => {
    modalStats.innerHTML += `
      <div class="stat">
        <small>${stat.stat.name}</small>
        <div class="stat-bar">
          <span style="width:${stat.base_stat / 2}%"></span>
        </div>
      </div>
    `;
  });

  modalEvolution.innerHTML = "";
  renderEvolution(evoChain.chain);

  updateNavButtons();
  activateTab("main");
}

function renderEvolution(chain) {
  const id = chain.species.url.split("/")[6];

  modalEvolution.innerHTML += `
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">
  `;

  chain.evolves_to.forEach((next) => renderEvolution(next));
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) openModalByIndex(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < allPokemon.length - 1) openModalByIndex(currentIndex + 1);
});

function updateNavButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === allPokemon.length - 1;
}

closeBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

function activateTab(id) {
  tabs.forEach((t) => t.classList.remove("active"));
  tabContents.forEach((c) => c.classList.remove("active"));

  document.querySelector(`.tab[data-tab="${id}"]`).classList.add("active");
  document.getElementById(id).classList.add("active");
}
