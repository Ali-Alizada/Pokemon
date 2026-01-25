function createPokemonCardHTML(pokemon) {
  return `
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
            `<span class="type-badge type-${t.type.name}">
              ${t.type.name}
            </span>`,
        )
        .join("")}
    </div>
  `;
}

function createPokemonCardHTML(pokemon) {
  return `
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
}
