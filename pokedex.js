// let randomPokemon = Math.floor(Math.random() * 1026) Commented out as unnecessary
const pokeType = document.getElementById("type");
const randomButtonHandler = document.getElementById("randoMon");
const musicButtonHandler = document.getElementById("music");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("pokeSearch");
const audio = new Audio("pokemon-theme.mp3");
const picaGif = document.getElementById("pikachu");
let pokeNumber = 0;
let query = "";
let pokeCry = new Audio();

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    setSearchValueHandler();
  }
});

searchButton.addEventListener("click", setSearchValueHandler);

randomButtonHandler.addEventListener("click", getPokemonHandler);
musicButtonHandler.addEventListener("click", play);

function play() {
  audio.volume = 0.08;
  audio.paused ? audio.play() : audio.pause();
}

function playCry() {
  pokeCry.volume = 0.1;
  pokeCry.play();
}

function getPokemonHandler() {
  query = Math.floor(Math.random() * 1026);
  picaGif.remove();
  getPokemon(query);
}

function setSearchValueHandler() {
  query = searchInput.value.toLowerCase();
  console.log(query);
  getPokemon(query);
  searchInput.value = "";
}

function upperCaseFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function flavourTextSanitization(flavour) {
  return flavour.replace(/\f/g, () => " ");
}

async function getPokemon(query) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!response.ok) {
      alert(`${query} is not a Pokémon`);
      return;
    }
    const pokemonData = await response.json();

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`
    );
    if (!speciesResponse.ok) {
      alert(`Failed to fetch species data for ${query}`);
      return;
    }
    const speciesData = await speciesResponse.json();

    pokeCry = new Audio(pokemonData.cries?.latest || "");
    playCry();
    showPokemon(pokemonData, speciesData);
  } catch (error) {
    console.error("Error fetching the Pokémon:", error);
  }
}

function showPokemon(pokemonData, speciesData) {
  const img = document.getElementById("pokemon-logo");
  img.src = pokemonData.sprites.front_default;
  img.style.width = "40%";

  pokeNumber = pokemonData.id;

  const pokeNameEl = document.getElementById("pokemon");
  const pokeName = upperCaseFirstLetter(pokemonData.name);
  pokeNameEl.textContent = pokeName;

  pokeType.innerHTML = "";

  pokemonData.types.forEach((typeInfo) => {
    const newType = document.createElement("p");
    newType.id = "type";
    newType.textContent = `Type: ${upperCaseFirstLetter(typeInfo.type.name)}`;
    pokeType.append(newType);
  });

  const flavorText = document.createElement("p");
  const flavorEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );
  if (flavorEntry) {
    flavorText.id = "flavor";
    flavorText.textContent = flavourTextSanitization(flavorEntry.flavor_text);
    pokeType.append(flavorText);
  }
}

function flavourTextSanitization(flavour) {
  return flavour.replace(/\f/g, " ");
}

function upperCaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
