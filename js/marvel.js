
var marvelContainer = document.getElementById("marvel-container");
var footer = document.getElementById("footer");
var superheroArray=[];

//------------To fetch all the characters from marvel Api and show on homepage------------
window.addEventListener("load", async function (){
     // Get request
     try {
       const response = await fetch(
         "http://gateway.marvel.com/v1/public/characters?ts=1&apikey=ec1a9b92b8914c79a463d25a9a4289dc&hash=2f5b3ab8ca67ce9689d0f1180ae05b3f"
       );
   
       const data = await response.json();
       superheroArray = await data.data.results;
       //console.log("inside fetch")
       showHeroes(superheroArray);
       footer.innerHTML = data.attributionText;
     } catch (err) {
       console.log("Error:", err);
       return;
     }
   })
   
   //function to iterate over superheroes and adding to the DOM
   function showHeroes(superhero) {
     marvelContainer.innerHTML = ``;
     for (let i = 0; i < superhero.length; i++) {
       addElementToDom(superhero[i]);
     }
     return;
   }
   
   //function to add card for each superhero to the UI
   function addElementToDom(hero) {
     const div = document.createElement("div");
     div.id = "super-hero";
     div.className =
       "col-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2 d-flex justify-content-center";
     div.innerHTML = `
        <div id="card-div" class="card mb-3" style="min-width:200px;width:220px">
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" class="card-img"
        alt="${hero.name}picture"
        id="${hero.id}">
        <div class="card-body">
        <h5 class="cart-title">${hero.name}</h5>
     
        </div>
        </div> 
        
        `;
     // append all div as a child  into superheroesContainer
     marvelContainer.appendChild(div);
   }
   
   
   
   


//--------- to show options while searching in the inputfield-------------------------------

let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Add eventListener to search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value));

// function for API call to search for typed superhero
async function searchHeros(textSearched) {

     if (textSearched.length == 0) {
          searchResults.innerHTML = ``;
          return;
     }

     // API call to get the data 
     await fetch(`https://gateway.marvel.com/v1/public/characters?ts=1&nameStartsWith=${textSearched}&apikey=ec1a9b92b8914c79a463d25a9a4289dc&hash=2f5b3ab8ca67ce9689d0f1180ae05b3f`)
          .then(res => res.json()) //Converting the data into JSON format
          .then(data => showSearchedResults(data.data.results)) //sending the searched results characters to show in HTML
}
 

//function that shows search result with photo and links
function showSearchedResults(searchedHero) {
    //character Ids used to check whether present in favourite array or not
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
    // If not got the favouritesCharacterIDs then we initialize it with empty map
    if(favouritesCharacterIDs == null){
         favouritesCharacterIDs = new Map();
    }

    // If got the favouritesCharacterIDs in localStorage then parse it and converting it to map
    else if(favouritesCharacterIDs != null){
         favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }

    searchResults.innerHTML = ``;
    // count is used to display top 5 result from DOM
    let count = 1;
    for (const key in searchedHero) {
         if (count <= 5) {
              let hero = searchedHero[key];
              // Appending the element into DOM
              searchResults.innerHTML +=
                   `
              <li class="flex-row single-search-result">
                   <div class="flex-row img-info">
                        <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
                        <div class="hero-info">
                             <a class="character-info" href="../super_hero.html">
                                  <span class="hero-name">${hero.name}</span>
                             </a>
                        </div>
                   </div>
                   <div class="flex-col buttons">
                        <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                        <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                   </div>
                   <div style="display:none;">
                        <span>${hero.name}</span>
                        <span>${hero.description}</span>
                        <span>${hero.comics.available}</span>
                        <span>${hero.series.available}</span>
                        <span>${hero.stories.available}</span>
                        <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
                        <span>${hero.id}</span>
                        <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
                        <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
                      
                   </div>
              </li>
              `
         }
         count++;
    }
    // Adding the appropritate events to the buttons after they are inserted in dom
    events();
}

function events() {
    let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
    favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

    let characterInfo = document.querySelectorAll(".character-info");
    characterInfo.forEach((character) => character.addEventListener("click", addInfoLocally))
}

//function to add or remove in the favourite Array
function addToFavourites() {

    // If 'Add to favourites' button is cliked then
    if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') {

         // We cretate a new object containg revelent info of hero and push it into favouritesArray
         let heroInfo = {
              name: this.parentElement.parentElement.children[2].children[0].innerHTML,
              description: this.parentElement.parentElement.children[2].children[1].innerHTML,
              comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
              series: this.parentElement.parentElement.children[2].children[3].innerHTML,
              stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
              portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
              id: this.parentElement.parentElement.children[2].children[6].innerHTML,
              landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
              squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
         }

         // array which stores objects of character 
         let favouritesArray = localStorage.getItem("favouriteCharacters");
         
         if (favouritesArray == null) {
              // null if visited first, then create a new array
              favouritesArray = [];
         } else {
              favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
         }

         //check IDs whether present or not then accordingly showing add or remove buttons
         let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

         if (favouritesCharacterIDs == null) {
              favouritesCharacterIDs = new Map();
         } else {
              //getting it from localstorage and parsing it
              favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs"))); 
         }

         // again setting the new favouritesCharacterIDs array to localStorage
         favouritesCharacterIDs.set(heroInfo.id, true);
         // console.log(favouritesCharacterIDs)

         // adding the above created heroInfo object to favouritesArray
         favouritesArray.push(heroInfo);

         // Storing the new favouritesCharactersID map and favouriteCharacters Array to localStorage after converting to string
         localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
         localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));
         //localStorage.setItem("heroInfo",JSON.stringify(heroInfo));

         // Change "Add to Favourites" button to "Remove from Favourites"
         this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
         
         // show "Added to Favourites" toast to DOM
         document.querySelector(".fav-toast").setAttribute("data-visiblity","show");
         // hide "Added to Favourites" toast from DOM after 1 seconds
         setTimeout(function(){
              document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
         },1000);
    }
    // For removing the character form favourites array
    else{
         
         // storing the id of character  
         let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[2].children[6].innerHTML;
          
         let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
         
         let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
         
         // will contain the characters after the deletion
         let newFavouritesArray = [];
         
         //  deleting character using delete function where id of character acts as key in map
         favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);
         
         // creating the new array which does not include the deleted character
         favouritesArray.forEach((favourite) => {
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                   newFavouritesArray.push(favourite);
              }
         });
         
         // console.log(newFavouritesArray)
         
         // Updating the new array in localStorage
         localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
         localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
         //localStorage.setItem("heroInfo",JSON.stringify(heroInfo));
         
         
         // Converting the "Remove from Favourites" button to "Add to Favourites" 
         this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
         
         // Displaying the "Remove from Favourites" toast to DOM
         document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
         // Deleting the "Remove from Favourites" toast from DOM after 1 seconds
         setTimeout(function(){
              document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
         },1000);
         // console.log();
    }     
}



// Function stores the info object of character  
function addInfoLocally() {

    
    // stores in localStorage, When clicked more info button, info page is opened fetches the heroInfo and display the info  
    let heroInfo = {
         name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
         description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
         comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
         series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
         stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
         portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
         id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
        // landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
         squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
    }

    localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}



