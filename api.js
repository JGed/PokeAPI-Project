let baseURL1 = "https://pokeapi.co/api/v2/pokemon/"
let baseURL2 = "https://pokeapi.co/api/v2/pokemon-species/"
const Colors = {
  normal : "#AAB09F",
  fire : "#EA7A3C",
  bug : "#94BC4A",
  dark : "#736C75",
  dragon : "#6A7BAF",
  electric : "#E5C531",
  fairy : "#E397D1",
  fighting : "#CB5F48",
  flying : "#7DA6DE",
  ghost : "#846AB6",
  grass : "#71C558",
  ground : "#CC9F4F",
  ice : "#70CBD4",
  poison : "#B468B7",
  psychic : "#E5709B",
  rock : "#B2A061",
  steel : "#89A1B0",
  water : "#539AE2"
}
function displayPokemonCard(pokemon) {
    //creating the elements for the pokemon card
    let displayArea = document.querySelector(".wrapper");
    let card = document.createElement("div");
    let name = document.createElement("h1");
    let idNumber = document.createElement("h3");
    let idDiv = document.createElement("div");
    let imageContainer = document.createElement("div");
    let cardImage = document.createElement("img");
    let typeDiv = document.createElement("div");
    let typeName = document.createElement("h3");


    //adding css styling to the newly created elements
    card.classList.add("card");
    name.classList.add("name");
    idNumber.classList.add("id-number");
    imageContainer.classList.add("image-container");
    cardImage.classList.add("card-image");
    typeDiv.classList.add("type");
    typeName.classList.add("type-name");
    idDiv.classList.add("type")

    //filling in the pokemon information into the html elements
    name.innerText = pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1);
    idNumber.innerText = "#" + pokemon.id.toString().padStart(3, "0");
    cardImage.src = pokemon.sprites.other["official-artwork"].front_default;
    typeName.innerText = pokemon.types[0].type.name;
    card.style.background = Colors[typeName.innerText];
    // adding event listender so that more pokemon information will be displayed when the card is clicked
    card.addEventListener("click", displayPokemonInfo);

    //appending the elements to the card, and the card to the page
    imageContainer.appendChild(cardImage);

    typeDiv.appendChild(typeName); /// new line
    idDiv.appendChild(idNumber);
    card.appendChild(name);
    card.appendChild(imageContainer);
    card.appendChild(idDiv);
    card.appendChild(typeDiv); // ****** typeName
    
    displayArea.appendChild(card);
}

async function display() {
    for(let i = 1; i <= 151; i++) {
        const pokemon = await fetch(baseURL1 + i).then(response => response.json());
        displayPokemonCard(pokemon); 
    }
}
function displayPokemonImage() {
    let imageContainer = document.createElement("div");
    let id = this.firstChild.nextSibling.nextSibling.innerText.substring(1);
    let regex = new RegExp("^0+(?!$)", "g");
    id = id.replaceAll(regex, "");
    imageContainer.classList.add("image-container");
    let image = document.createElement("img");
    image.classList.add("card-image");
    imageContainer.appendChild(image);
    fetch(baseURL1 + id)
    .then(response => response.json())
    .then(pokemon => {
        image.src =   pokemon.sprites.other["official-artwork"].front_default;
        this.removeChild(this.firstChild.nextSibling);
        this.insertBefore(imageContainer, this.firstChild.nextSibling);
    });

    this.removeEventListener("click", displayPokemonImage);
    this.addEventListener("click", displayPokemonInfo);
}

function displayPokemonInfo() {
    let id = this.firstChild.nextSibling.nextSibling.innerText.substring(1);
    let regex = new RegExp("^0+(?!$)", "g");
    id = id.replaceAll(regex, "");
    let textDiv = document.createElement("div");
    textDiv.classList.add("flavor-text-container");
    let paragraph = document.createElement("p");
    textDiv.appendChild(paragraph);
    fetch(baseURL2 + id)
    .then(response => response.json())
    .then(pokemon => {
        let textEntries = pokemon.flavor_text_entries;
        let text;
        for(entry of textEntries){
            if(entry.language.name === "en"){
                text = entry.flavor_text;
                paragraph.innerText = text.replace(/(\r\n|\n|\r|\f)/gm, " ");
                break;
            }
        }
        let utter1 = new SpeechSynthesisUtterance();
        utter1.lang = "en-US";
        utter1.pitch = 0.65;
        utter1.rate = 1.08;
        utter1.text = pokemon.name;
        let utter2 = new SpeechSynthesisUtterance();
        utter2.lang = "en-US";
        utter2.text = text;
        utter2.pitch = 0.65;
        utter2.rate = 1.08;
        window.speechSynthesis.speak(utter1);
        window.speechSynthesis.speak(utter2);

        this.removeChild(this.firstChild.nextSibling);
        this.insertBefore(textDiv, this.firstChild.nextSibling);
    });

    this.removeEventListener("click", displayPokemonInfo);
    this.addEventListener("click", displayPokemonImage);
}

display();