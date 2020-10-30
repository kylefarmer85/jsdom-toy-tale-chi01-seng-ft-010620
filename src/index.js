// NOTE that I do not use the DOMContentLoaded Event listener
// I chose instead to use the keyword "defer" in the script tag
// "defer" waits for the DOM to load before running the script file
// you can see this on lines 6 and 7 of the index.html file


// DECLARED VARIABLES

// create a variable to use for the toggle function
// use let because we want to be able to change this value
let addToy = false;
// grab the element on the page with the id (#) of "new-toy-btn"
const addBtn = document.querySelector("#new-toy-btn");
// grab the element on the page with the class (.) of "container"
const formContainer = document.querySelector(".container");
// grab the element on the page with the class (.) of "add-toy-form"
const toyForm = document.querySelector(".add-toy-form");
// make a variable for the url where our backend API is hosted
const toysEndpoint = `http://localhost:3000/toys`;
// grab the element on the page with the ID of "toy-collection"
const toyContainer = document.getElementById("toy-collection");



// DEFINED FUNCTIONS

// this function takes in an argument of a single toy
// and renders the single toy
const renderIndividualToy = toy => {
  // save a variable with the toy's likes in a string
  let likeValue = `${toy.likes}`;
  // if the likeValue is "1", the value of ternary is "Like"
  let ternary = likeValue === "1" ? "Like" : "Likes";
  // add onto the existing innerHTML of the toy container
  // set a data-id attribute to be used for updating or deleting the toy card
  toyContainer.innerHTML += `<div class="card" data-id="${toy.id}">
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${likeValue} ${ternary}</p>
    <button class="like-btn">Like <3</button>
  </div>`;
}

// accept an argument of an array of toys
// and render all of those toys
const renderToys = toysArray => {
  // reset the innerHTML of the toys container
  toyContainer.innerHTML = ``;
  // iterate over each of the toys in the toys array
  toysArray.forEach(toy => {
    // call the renderIndividualToy function
    // pass the argument of an individual toy to the function
    renderIndividualToy(toy);
  })
}

// fetch all the toys from the server
const fetchToys = () => {
  fetch(toysEndpoint)
    .then(resp => resp.json())
    .then(toysArray => {
      // when we get the data back, we will call that toysArray
      // call the renderToys function with an argument of the toysArray
      renderToys(toysArray);
    })
    .catch(err => {
      // if an error message comes back from the server
      // render that error in the console
      console.log(err);
    })
}

// callback function that runs when the submit action fires
// take in an event as an argument
const handlePostToy = e => {
  // prevent the default action of the form
  e.preventDefault();
  // assemble an object with the data from the form
  // remember to set the likes value equal to 0
  const formData = {
    name: e.target["name"].value,
    image: e.target["image"].value,
    likes: 0
  }
  // reset the form input fields (clear them out)
  e.target.reset();

  // assemble a request object for the server to receive
  // the data we are sending
  // it is a POST request
  // we are sending the data over as JSON
  // we accept JSON as a response
  // the data we are going to send over needs to be converted
  // to JSON in order for any server to interpret it

  const reqObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  // we are making a POST fetch request
  // send the request object as a second argument to fetch
  fetch(toysEndpoint, reqObj)
    .then(resp => resp.json())
    .then(individualToy => {
      // the response we receive is 1 toy object
      // the toy we just created
      // call the renderIndividualToy function
      // and pass in the new toy as an argument
      renderIndividualToy(individualToy);
    })
    .catch(err => console.log(err))
}

// the function for handling the like button functionality
// this function is called by the click event listener
const handleLikeButton = e => {
  // create a variable to store the toys ID
  // we have access to the toy's ID from the card's attribute of data-id
  const toyId = e.target.parentElement.dataset.id;
  // grab the number of likes of the DOM element
  // turn that number into an integer
  const likeCount = parseInt(e.target.parentElement.children[2].innerText.split(" ")[0]);
  // assemble an object to pass to the patch request
  // send the toy's ID
  // send the current like count and add 1 to account for the new like
  const likeData = {
    likes: likeCount + 1
  }

  // assemble a PATCH request object
  const reqObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(likeData)
  }

  // make a fetch request
  // note that a patch request needs to go to "toys/:id"
  // we have access to the toy's ID to append to the URL
  fetch(toysEndpoint + `/${toyId}`, reqObj)
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      // invoke the fetchToys function to rerender all the toys
      fetchToys();
    })
    .catch(err => console.log(err))

}





// INVOKED FUNCTIONS

// invoke the fetch toys function
fetchToys();



// --------------------EVENT LISTENERS---------------------------------

// listen for when a user clicks the addBtn element
addBtn.addEventListener("click", () => {
  // update the value of addToy to the opposite boolean value
  // if it starts out false, it is set to true
  addToy = !addToy;
  // if addToy is true, display the element on the page
  // if it is false, set the style display to "none"
  // this makes the element hidden from view
  addToy ? formContainer.style.display = "block" : formContainer.style.display = "none";
});

// listen for when the toyForm is submitted
// when it is submitted, call the handlePostToy function
toyForm.addEventListener("submit", handlePostToy);


// listen for when the user clicks anywhere on the page
document.addEventListener("click", (e) => {
  // if the node they clicked has a class="like-btn" attribute
  if (e.target.className === "like-btn") {
    // call the handleLikeButton function and pass in the event as an argument
    handleLikeButton(e);
  }
});
