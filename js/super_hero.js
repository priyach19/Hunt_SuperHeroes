// Selecting the elements from the DOM
let info = document.getElementById('info-container');

// get heroInfo object, stored when user clicked on more info
let heroInfo = JSON.parse(localStorage.getItem("heroInfo"));

window.addEventListener("load", function () {
    // get favouritesCharacterIDs to display the appropriate button (in favourites)
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
    if (favouritesCharacterIDs == null) {
         favouritesCharacterIDs = new Map();
    } else if (favouritesCharacterIDs != null) {
         favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }
    // adding the information into DOM 
    info.innerHTML =
         `
              <div class="flex-row hero-name">${heroInfo.name}</div>
              <div class="flex-row hero-img-and-more-info">
                   <img id="portraitImage" class="hero-img" src="${heroInfo.portraitImage}" alt="">

                   <div class="flex-col more-info">
                        <div class="flex-row id">
                             <b>ID:</b><span>${heroInfo.id}</span>
                        </div>
                        <div class="flex-row comics">
                             <b>Comics:</b><span>${heroInfo.comics}</span>
                        </div>
                        <div class="flex-row series">
                             <b>Series:</b><span>${heroInfo.series}</span>
                        </div>
                        <div class="flex-row stories">
                             <b>Stories:</b><span>${heroInfo.stories}</span>
                        </div>
                   </div>
              </div>
              <div class="flex-col hero-description">
                   <b>Description:</b>
                   <p>${heroInfo.description != "" ? heroInfo.description : "No Description Available"}</p>
              </div>
              <div style="display:none;">
                   <span>${heroInfo.name}</span>
                   <span>${heroInfo.portraitImage}</span>
                   <span>${heroInfo.landscapeImage}</span>
                   <span>${heroInfo.id}</span>
                   <span>${heroInfo.comics}</span>
                   <span>${heroInfo.series}</span>
                   <span>${heroInfo.stories}</span>
                   <span>${heroInfo.squareImage}</span>
                   <span>${heroInfo.description}</span>
              </div>
              <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${heroInfo.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
         `
    addEvent();
})

// Changing the character image based on the different screen sizes 
window.addEventListener('resize', function () {
    let portraitImage = document.getElementById('portraitImage');
    let landscapeImage = document.getElementById('landscapeImage');

    if (document.body.clientWidth < 678) {
         portraitImage.style.display = "none";
         landscapeImage.style.display = "block";
    } else {
         landscapeImage.style.display = "none";
         portraitImage.style.display = "block";
    }
})

//function to add evenListener to buttons
function addEvent() {
    let favouriteButton = document.querySelector('.add-to-fav-btn');
    favouriteButton.addEventListener("click", addToFavourites);
}
//function to add favorite hero in favourites
function addToFavourites() {

    // If add to favourites button is cliked then
    if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') {
         let heroInfo = {
              name: this.parentElement.children[3].children[0].innerHTML,
              description: this.parentElement.children[3].children[8].innerHTML,
              comics: this.parentElement.children[3].children[4].innerHTML,
              series: this.parentElement.children[3].children[5].innerHTML,
              stories: this.parentElement.children[3].children[6].innerHTML,
              portraitImage: this.parentElement.children[3].children[1].innerHTML,
              id: this.parentElement.children[3].children[3].innerHTML,
              landscapeImage: this.parentElement.children[3].children[2].innerHTML,
              squareImage: this.parentElement.children[3].children[7].innerHTML
         }

         // get the favourites array ,create if it is null 
         let favouritesArray = localStorage.getItem("favouriteCharacters");
         if (favouritesArray == null) {
              favouritesArray = [];
         } else {
              favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
         }
         // favouritesCharacterIDs taken from localStorage for adding ID of the character which is added in favourites
         let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
         if (favouritesCharacterIDs == null) {
              favouritesCharacterIDs = new Map();//if not get initialize new map
         } else {
              favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          
         }

         // set new favouritesCharacterIDs array to localStorage
         favouritesCharacterIDs.set(heroInfo.id, true);
         // console.log(favouritesCharacterIDs)

         // adding the above created heroInfo object to favouritesArray
         favouritesArray.push(heroInfo);

         localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));//parse it to convert into string
         
         localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));// Setting the new favouritesCharacters array 

         // change buttons from add to remove
         this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
         
         
         document.querySelector(".fav-toast").setAttribute("data-visiblity","show");//display toast
         
         setTimeout(function(){
              document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
         },1000);// Delete toast from DOM after 1 seconds
    }
    // removing the character form favourites array
    else{
         
         // storing the id of character in a variable 
         
         let idOfCharacterToBeRemoveFromFavourites = this.parentElement.children[3].children[3].innerHTML;
         
         let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
         
         let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
         
         //  contain the characters which should be present after the deletion of the character  
         let newFavouritesArray = [];
         
         // deleting the character using delete function where id of character acts as key for map
         favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);
         
         // create new array which does not have deleted character
         favouritesArray.forEach((favourite) => {
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                   newFavouritesArray.push(favourite);
              }
         });
         
         // console.log(newFavouritesArray)
         
         // Updating the new array in localStorage
         localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
         localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
         
         this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';//change toasts
         
         document.querySelector(".remove-toast").setAttribute("data-visiblity","show");//show remove toast
        
         setTimeout(function(){
              document.querySelector(".remove-toast").setAttribute("data-visiblity","hide"); // Delete"Remove from Favourites" toast from DOM after 1 seconds
         },1000);
         
    }     
}