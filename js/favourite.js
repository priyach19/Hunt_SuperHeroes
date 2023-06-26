// Selecting the card container from the DOM
let cardContainer = document.getElementById('container');

// Event listener attached to dom which is executed when the page is loaded
window.addEventListener("load", function () {
     // Getting the favourites array fom localStorage
     let favourites = localStorage.getItem("favouriteCharacters");

     // if favourites is null the we display nothing and return from there 
     if (favourites == null) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>"
          return;
     }
     // if NOT NULL the paring it to convert it to array
     else {
          favourites = JSON.parse(this.localStorage.getItem("favouriteCharacters"));
     }

     // if all the characters are deleted from favourites and not character left
     if (favourites.length == 0) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>";
          return;
     }

     cardContainer.innerHTML = "";
     // console.log(favourites)
     favourites.forEach(character => {
          // console.log(character);
          cardContainer.innerHTML +=
               `
               <div class="flex-col card">
                    <img src="${character.portraitImage}" height="220px" alt="">
                    <span class="name">${character.name}</span>
                    <span class="id">Id : ${character.id}</span>
                    <span class="comics">Comics : ${character.comics}</span>
                    <span class="series">Series : ${character.series}</span>
                    <span class="stories">Stories : ${character.stories}</span>
                    <a class="character-info" href="./super_hero.html">
                         <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button>
                    </a>
                    <button class="btn remove-btn"><i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites</button>
               </div>
          `

     })
     addEvent();
})

// Function for attacthing eventListener to buttons
function addEvent() {
     let removeBtn = document.querySelectorAll(".remove-btn");
     removeBtn.forEach((btn) => btn.addEventListener("click", removeCharacterFromFavourites))

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click",addInfoLocally));
}


function removeCharacterFromFavourites() {
     
     // Storing the Id of character 
     let idOfCharacterToBeDeleted = this.parentElement.children[2].innerHTML.substring(5);
     let favourites = JSON.parse(localStorage.getItem("favouriteCharacters")); // get favourites array stores objects of character  
     let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));// get favouritesCharacterIDs to delete the character which is deleted from favourites
     favouritesCharacterIDs.delete(`${idOfCharacterToBeDeleted}`);// delete id from favouritesCharacterId map


     // deleting the character form array whose id is matched 
     favourites.forEach(function (favourite, index) {
          if (favourite.id == idOfCharacterToBeDeleted) {
               // console.log(favourite)
               favourites.splice(index, 1);
          }
     });

     // when all characters are deleted from favourites and no character left 
     if (favourites.length == 0) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>";
     }
     // console.log(favourites);

     // Updating the new arrays in localStorage
     localStorage.setItem("favouriteCharacters", JSON.stringify(favourites));
     localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));

     // Removing the element from DOM
     this.parentElement.remove();
     document.querySelector(".remove-toast").setAttribute("data-visiblity", "show");// show "Removed from favourites" toast in DOM
     setTimeout(function () {
          document.querySelector(".remove-toast").setAttribute("data-visiblity", "hide"); // hide "Removed from favourites" toast from DOM
     }, 1000);
}


// Function which stores the info object of character for which user want to see the info 
function addInfoLocally() {
       
     let heroInfo = {
          name: this.parentElement.children[7].children[1].innerHTML,
          description: this.parentElement.children[7].children[5].innerHTML,
          comics: this.parentElement.children[7].children[2].innerHTML,
          series: this.parentElement.children[7].children[3].innerHTML,
          stories: this.parentElement.children[7].children[4].innerHTML,
          portraitImage: this.parentElement.children[7].children[7].innerHTML,
          id: this.parentElement.children[7].children[0].innerHTML,
          landscapeImage: this.parentElement.children[7].children[6].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
