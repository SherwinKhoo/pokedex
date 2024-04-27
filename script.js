"use strict"

/////////////////////////////////////////////////
///////  Elements  //////////////////////////////
/////////////////////////////////////////////////

// create elements
const container = document.createElement("div")
const searchContainer = document.createElement("form")
const spriteContainer = document.createElement("div")
const infoContainer = document.createElement("div")
const statsContainer = document.createElement("div")
const movesContainer = document.createElement("div")

const pokedexTitle = document.createElement("h1")

const searchInput = document.createElement("input")
const searchButton = document.createElement("button")
const searchIcon = document.createElement("i")

const surpriseMeButton = document.createElement("button")

const spriteImage = document.createElement("img")

// set up elements
document.querySelector("body").prepend(container)

container.append(pokedexTitle, searchContainer, surpriseMeButton, spriteContainer, infoContainer, statsContainer, movesContainer)
searchContainer.append(searchInput, searchButton)

container.id = "overall-container"

pokedexTitle.classList.add("container")
searchContainer.classList.add("container")
spriteContainer.classList.add("container")
infoContainer.classList.add("container")
statsContainer.classList.add("container")

pokedexTitle.innerText = "Pok\u00E9dex"

searchContainer.id = "search-container"

searchInput.id = "search-input"
searchInput.type = "text"
searchInput.placeholder = "Enter pok\u00e9mon name or id"
searchInput.setAttribute("required", "")

searchIcon.classList.add("fa-solid", "fa-magnifying-glass")
searchButton.id = "search-button"
searchButton.append(searchIcon)

surpriseMeButton.id = "surprise-me"
surpriseMeButton.innerText = "Surprise me"

spriteContainer.id = "sprite-container"

infoContainer.id = "info-container"

statsContainer.id = "stats-container"

/////////////////////////////////////////////////
///////  Pokedex  ///////////////////////////////
/////////////////////////////////////////////////

// utility functions

const randomId = (min, max) => {
    const randomId = Math.floor(Math.random() * max + min)
    return randomId
}

const formatStatString = (string, delimiter) => {
    let words = string.split(delimiter)

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
    }
    return words.join(" ")
}

const levelStatCalculator = (statName, baseStat, level, ev, iv, nature) => {
    if (statName.length > 2) {
        return Math.floor( (0.01 * (2 * baseStat + iv + 0.25 * ev) * level + 5) * nature )
    } else {
        return Math.floor( 0.01 * (2 * baseStat + iv + Math.floor(0.25 * ev)) * level + level + 10 )
    }
}

const totalStatCalculator = (array) => {
    return array.reduce((totalStat, stat) => totalStat + stat, 0)
}

const disableButtons = () => {

    searchButton.removeEventListener("click", handleSearchButtonClick)
    surpriseMeButton.removeEventListener("click", handleSurpriseMeButtonClick)
    surpriseMeButton.innerText = "-- disabled --"
    surpriseMeButton.style.cssText = "font-style: italic"
    searchButton.disabled = true
    surpriseMeButton.disabled = true
    console.log("buttons disabled");

    setTimeout(() => {
        searchButton.addEventListener("click", handleSearchButtonClick)
        surpriseMeButton.addEventListener("click", handleSurpriseMeButtonClick)
        surpriseMeButton.innerText = "Surprise me"
        surpriseMeButton.style.cssText = ""
        searchButton.disabled = false
        surpriseMeButton.disabled = false
        console.log("buttons enabled");
    }, 5000);
}

// show functions

const showPokemonTypes = (types) => {
    let pokemonIdAndName = document.getElementById("pokemon-id-name")
    let pokemonTypes = ``

    for (let i = 0; i < types.length; i++) {
        let {type: {name: type, url: _url}} = types[i]
        pokemonTypes += `<p class="pokemon-info types" id="type-${i + 1}" style="grid-column: span ${types.length === 1 ? 2 : 1}; background-color: var(--${type}-type); color: var(--light-style)">${type[0].toUpperCase()}${type.slice(1)}</p>`
    }

    pokemonIdAndName.insertAdjacentHTML("afterend", pokemonTypes)
}

const showPokemonAbilities = (abilities) => {
    let pokemonWeight = document.getElementById("pokemon-weight")
    let pokemonAbilities = ``

    for (let i = 0; i < abilities.length; i++) {
        let {ability: {name: ability, url: _url}} = abilities[i]
        pokemonAbilities += `<p class="pokemon-info abilities" id="ability-${i + 1}" style="grid-column: span 1">${ability[0].toUpperCase()}${ability.slice(1)}</p>`
    }

    pokemonWeight.insertAdjacentHTML("afterend", pokemonAbilities)
    // console.log(pokemonAbilities);
}

const showPokemonStats = (stats, types) => {

    let rootStyles = getComputedStyle(document.documentElement)
    
    //  .getComputedStyle() returns an object containing the values of all CSS properties of an element,
    //  after applying active stylesheets and resolving any basic computation those values may contain.

    //  document.documentElement returns the Element that is the root element of the document
    //  (for example, the <html> element for HTML documents).

    let statsData = []
    let categoriesData = []
    let barColours = []
    let backgroundColours = []
    // let newLabels = []
    let statNameData = []
    
    for (let i = 0; i < stats.length; i++) {
        const {base_stat, stat: {name: statName}} = stats[i]

        let correctedStatName = ""
        if (statName.length > 2) {
            correctedStatName = formatStatString(statName, "-")
        } else {
            correctedStatName = statName.toUpperCase()
        }

        statsData.push(base_stat)
        categoriesData.push(correctedStatName)
        barColours.push(rootStyles.getPropertyValue(`--${statName}-bar`))
        backgroundColours.push(rootStyles.getPropertyValue(`--${statName}-background`))
        // newLabels.push(`<span styles="text-align: left">${statName}</span>`)
        statNameData.push(statName)
    }
    console.log(statsData, categoriesData, barColours, backgroundColours);

    let type = types[0].type.name
    
    statsContainer.innerHTML = `
        <p class="table-header"; id="stat-title"; style="background-color: var(--${type}-fill)">Stats</p><p class="table-header"; id="stat-range"; style="background-color: var(--${type}-fill)">Range</p><p class="table-header"; id="stat-L50"; style="background-color: var(--${type}-fill)">At lvl 50</p><p class="table-header"; id="stat-L100"; style="background-color: var(--${type}-fill)">At lvl 100</p>
    `
    // levelStatCalculator( baseStat, level, ev, iv, nature )
    for (let i = 0; i < stats.length; i++) {
        statsContainer.innerHTML += `
            <p class="table-row ${statNameData[i]}-stat"; id="${statNameData[i]}-name"; style="background-color: var(--${statNameData[i]}-background); justify-content: left; padding-left: 1vw">${categoriesData[i]}:</p>
            <p class="table-row ${statNameData[i]}-stat"; id="${statNameData[i]}-stat"; style="background-color: var(--${statNameData[i]}-background); justify-content: right; padding-right: 1vw">${statsData[i]}</p>
            <div class="table-row ${statNameData[i]}-stat"; id="${statNameData[i]}-background"; style="background-color: var(--${statNameData[i]}-background); justify-content: flex-start; box-sizing: border-box; padding: 0.1vw">
                <div class="table-row ${statNameData[i]}-stat"; id="${statNameData[i]}-bar"; style="background-color: var(--${statNameData[i]}-bar); border: 1px solid var(--dark-style); border-radius: 0.25vw; width: calc(${statsData[i] / 255} * 100%)"></div>
            </div>
            <p class="table-row ${statNameData[i]}-stat"; id="${statNameData[i]}-L50"; style="background-color: var(--${statNameData[i]}-background)">${levelStatCalculator(statNameData[i], statsData[i], 50, 0, 0, 0.9)} - ${levelStatCalculator(statNameData[i], statsData[i], 50, 252, 31, 1.1)}</p>
            <p class="table-row ${statNameData[i]}-stat"; id="${statNameData[i]}-L50"; style="background-color: var(--${statNameData[i]}-background)">${levelStatCalculator(statNameData[i], statsData[i], 100, 0, 0, 0.9)} - ${levelStatCalculator(statNameData[i], statsData[i], 100, 252, 31, 1.1)}</p>
        `
    }

    statsContainer.innerHTML += `
        <p class="table-footer total-stat"; id="total-name"; style="background-color: var(--${type}-fill); justify-content: left; padding-left: 1vw; border-radius: 0 0 0 1vw">Total:</p>
        <p class="table-footer total-stat"; id="total-stat"; style="background-color: var(--${type}-fill); justify-content: right; padding-right: 1vw">${totalStatCalculator(statsData)}</p>
        <p class="table-footer total-stat"; id="total-explanation"; style="background-color: var(--${type}-fill); justify-content: left; padding-left: 1vw">Minimum stats are calculated with 0 EVs, IVs of 0, and (if applicable) a hindering nature.\nMaximum stats are calculated with 252 EVs, IVs of 31, and (if applicable) a helpful nature.</p>
    `
}

const showPokemonMoves = (moves) => {
    // deconstruct "moves" object
    // split by "machine", "tutor" and "level-up"
}

const showPokemon = (pokemonData) => {
    const {
        abilities,
        height,
        id,
        name,
        sprites: { front_default: sprite },
        stats,
        types,
        weight,
        moves
    } = pokemonData

    console.log(id, name, types, height, weight, abilities, stats, moves);

    container.style.backgroundColor = `var(--${types[0]["type"]["name"]}-type)`
    pokedexTitle.style.backgroundColor = `var(--${types[0]["type"]["name"]}-fill)`

    // spriteContainer.style.backgroundImage = `url("${sprite}")`

    spriteContainer.append(spriteImage)
    spriteImage.id = "sprite-image"
    spriteImage.src = `${sprite}`
        
    infoContainer.style.cssText = `display: grid; gap: 1vw; grid-template-columns: repeat(2, 1fr); background-color: var(--light-style)`

    infoContainer.innerHTML = `
        <p class="pokemon-info" id="pokemon-id-name">#${"0".repeat(4 - id.toString().length)}${id} ${name[0].toUpperCase()}${name.slice(1)}</p>
        <p class="pokemon-info" id="pokemon-height">Height: ${(height * 0.1).toFixed(1)} m</p>
        <p class="pokemon-info" id="pokemon-weight">Weight: ${(weight * 0.1).toFixed(1)} kg</p>
    `

    showPokemonTypes(types)
    showPokemonAbilities(abilities)
    showPokemonStats(stats, types)
    // showPokemonMoves(moves)
}

const fetchPokemonData = async (pokemonNameOrId) => {
    
    if (Number.isInteger(parseInt(pokemonNameOrId))) {
        pokemonNameOrId = parseInt(pokemonNameOrId)
    } 

    const pokeApi = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}/`

    const errorMessage = () => {
        throw new Error("404\nPok\u00e9mon\nnot found!")
    }

    try {
        const res = await fetch(pokeApi);
        
        if (!res.ok || pokeApi === "https://pokeapi.co/api/v2/pokemon//") {
            errorMessage()
        }

        const data = await res.json();
        showPokemon(data);
        // console.log(data);
        searchInput.value = ""
        
    } catch (err) {

        container.style.cssText = ""
        pokedexTitle.style.cssText = ""
        searchInput.value = ""
        searchInput.placeholder = "Enter pok\u00e9mon name or id"
        spriteContainer.innerHTML = `<iframe src="https://giphy.com/embed/SsjyaYH2gkNCE" style="top: 0; left: 0; width: 100%; height: 100%; border: none;" class="giphy-embed" allowfullscreen></iframe>`
        infoContainer.innerText = err.message
        infoContainer.style.cssText = "display: flex; justify-content: center; align-items: center; text-align: center; width: 100%; height: 100%; font-size: calc(3vw + 24px); font-color: var(--dark-style)";
        statsContainer.innerHTML = ``

        console.log(err);
    }
}

// event handling functions

function handleSelectInputElement() {
    this.removeAttribute("placeholder")
}
function handleDeselectInputElement() {
    if (!this.value.trim()) {
        this.setAttribute("placeholder", "Enter pok\u00e9mon name or id")
    }
    // returns empty string regardless of whitespace characters
    // but placeholder text doesn't reappear
}

function handleSearchButtonClick(event) {
    event.preventDefault()
        
    const searchParams = searchInput.value.trim().toLowerCase()
    fetchPokemonData(searchParams)
    console.log("searchButton clicked");

    disableButtons()

    container.style.cssText = ""
    pokedexTitle.style.cssText = ""
    spriteContainer.innerHTML = ``
    spriteContainer.style.cssText = ""
    infoContainer.innerText = ""
    infoContainer.style.cssText = ""
    statsContainer.innerHTML = ``
}

function handleSurpriseMeButtonClick(event) {
    event.preventDefault()
    
    fetchPokemonData(randomId(1, 1025))
    console.log("surpriseMeButton clicked");

    disableButtons()

    container.style.cssText = ""
    pokedexTitle.style.cssText = ""
    spriteContainer.innerHTML = ``
    spriteContainer.style.cssText = ""
    infoContainer.innerText = ""
    infoContainer.style.cssText = ""
    statsContainer.innerHTML = ``
}

// event listeners

searchInput.addEventListener("focus", handleSelectInputElement)
searchInput.addEventListener("blur", handleDeselectInputElement)

searchButton.addEventListener("click", handleSearchButtonClick)
surpriseMeButton.addEventListener("click", handleSurpriseMeButtonClick)