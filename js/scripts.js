const randomUserUrl =
  "https://randomuser.me/api/?results=12&inc=picture,name,email,location,cell,dob&nat=us";

/**
 * @type {Object}
 */
let employees;

/**
 * @type {number}
 */
let index = 0;

/**
 * Async Function
 *
 * @param {API}  - Receive API link
 */
async function fetchData(randomUserUrl) {
  try {
    const response = await fetch(randomUserUrl);
    const data = await response.json();
    //store generated employees to reuse data
    employees = data.results;
    //Call Function to Initialize page
    generateHTML(data.results);
    popUp(employees);
    searchDisplay(data.results);
  } catch (err) {
    console.log(Error(err));
  }
}

/**
 * Function generate HTML layout &
 * Append it to the gallery Div
 *
 * @param {Object}  - Receive data Object
 */

function generateHTML(data) {
  const gallery = document.querySelector(".gallery");
  const html = data
    .map(
      (person) =>
        `
      <div class="card" data-index-number = ${data.indexOf(person)}>
                    <div class="card-img-container"data-index-number = ${data.indexOf(
                      person
                    )}>
                        <img class="card-img" data-index-number = ${data.indexOf(
                          person
                        )} src="${person.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container" data-index-number = ${data.indexOf(
                      person
                    )}>
                        <h3 id="name" class="card-name cap" data-index-number = ${data.indexOf(
                          person
                        )}>${person.name.first} ${person.name.last}</h3>
                        <p class="card-text" data-index-number = ${data.indexOf(
                          person
                        )}>${person.email}</p>
                        <p class="card-text cap" data-index-number = ${data.indexOf(
                          person
                        )}>${person.location.city}, ${person.location.state}</p>
                    </div>
                </div>
    `
    )
    .join("");
  gallery.insertAdjacentHTML("beforeend", html);
}

/**
 * Function generate modal layout &
 * Append it after the gallery Div
 * @param {Object}  - Receive data Object
 */

function generateModal(data) {
  const gallery = document.querySelector(".gallery");
  const person = data;
  //Phone number reGex to remove special Character
  const phone = person.cell.replace(/[\W+]/g, "");
  //reFormat phone number on desired format
  const phoneNumber = `(${phone.substring(0, 3)}) ${phone.substring(
    3,
    6
  )}-${phone.substring(6, 10)}`;
  //Slice useless character from date of birth & remove special character
  const dob = person.dob.date.slice(0, 10).replace(/[-]/g, "");
  //reformat Birthday on desired format
  const Birthday = `${dob.substring(4, 6)}/${dob.substring(
    6,
    8
  )}/${dob.substring(0, 4)}`;
  //Create modal template
  const modal = `
   <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                        <p class="modal-text">${person.email}</p>
                        <p class="modal-text cap">${person.location.city}</p>
                        <hr>
                        <p class="modal-text">${phoneNumber}</p>
                        <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                        <p class="modal-text">Birthday: ${Birthday}</p>
                    </div>
                </div> 
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
  `;
  //append modal
  gallery.insertAdjacentHTML("afterend", modal);

  /**
   * Event Listener
   * @event click
   * @fires closePopUp()
   * @listens .modal-close-btn
   */
  closeButton = document.querySelector(".modal-close-btn");
  closeButton.addEventListener("click", (e) => closePopUp());
  /**
   * Event Listener
   * @event click
   * @fires nextPopUp()
   * @listens .modal-next
   */
  next = document.querySelector(".modal-next");
  next.addEventListener("click", (e) => nextPopUp());
  /**
   * Event Listener
   * @event click
   * @fires previousPopUp()
   * @listens .modal-prev
   */
  previous = document.querySelector(".modal-prev");
  previous.addEventListener("click", (e) => previousPopUp());
}

/**
 * Function generate modal layout &
 * @function
 * @param {Object}  - Receive data Object
 */
function popUp(data) {
  const card = document.querySelectorAll(".card");
  for (let i = 0; i < card.length; i++) {
    /**
     * Event Listener
     * @event click
     * @fires generateModal()
     * @listens .card
     */
    card[i].addEventListener("click", (e) => {
      //use the index of the employees to generate desired modal
      index = parseInt(e.target.dataset.indexNumber);
      generateModal(data[index]);
      //if index === 0 remove previous button
      if (index === 0) {
        previous = document.querySelector(".modal-prev");
        previous.style.display = "none";
        //if index === 11 remove next button
      } else if (index === data.length - 1) {
        next = document.querySelector(".modal-next");
        next.style.display = "none";
      }
    });
  }
}

/**
 * @function - Remove modal when called
 */
function closePopUp() {
  const body = document.querySelector("body");
  const modal = document.querySelector(".modal-container");
  body.removeChild(modal);
}

/* Exceed Expectation section
     ========================================================================== */

/**
 * @function - Take current index and add 1
 * Close current modal
 * Generate next modal
 * @if last remove next button
 */

function nextPopUp() {
  let nextIndex = parseInt(index) + 1;
  closePopUp();
  generateModal(employees[nextIndex]);
  //update closeButton & index to reuse next & close EventListener
  closeButton = document.querySelector(".modal-close-btn");
  index = nextIndex;
  if (nextIndex === employees.length - 1) {
    next = document.querySelector(".modal-next");
    next.style.display = "none";
  } else {
    next = document.querySelector(".modal-next");
    next.style.display = "";
  }
}

/**
 * @function - Take current index and substract 1
 * Close current modal
 * Generate previous modal
 * @if first remove previous button
 */

function previousPopUp() {
  let previousIndex = parseInt(index) - 1;
  closePopUp();
  generateModal(employees[previousIndex]);
  //update closeButton & index to reuse next & close EventListener
  closeButton = document.querySelector(".modal-close-btn");
  index = previousIndex;
  if (previousIndex === 0) {
    previous = document.querySelector(".modal-prev");
    previous.style.display = "none";
  } else {
    previous = document.querySelector(".modal-prev");
    previous.style.display = "";
  }
}

/**
 * @function - Create search Html
 * @param {Object}
 */
function searchDisplay(data) {
  const searchContainer = document.querySelector(".search-container");
  const html = `
    <form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form>
  `;
  searchContainer.insertAdjacentHTML("beforeend", html);

  /**
   * Event Listener
   * @event keyup
   * @fires searchFunction()
   * @listens .search-input
   */
  const searchInput = document.querySelector(".search-input");
  searchInput.addEventListener("keyup", (e) => searchFunction(data));
}

/**
 * @function - Search Engine
 * @param {Object}
 * Compare between galery data & search Input data
 * first name or last name
 * push valid result into results array
 * Call function with results
 */
const searchFunction = (data) => {
  const gallery = document.querySelector(".gallery");
  const searchInput = document
    .querySelector(".search-input")
    .value.toLowerCase();
  //Empty array to store search result.
  const results = [];

  for (let i = 0; i < data.length; i++) {
    const employeesFirstName = Object.values(data[i].name.first)
      .join("")
      .toLowerCase();
    const employeesLastName = Object.values(data[i].name.last)
      .join("")
      .toLowerCase();
    if (
      (searchInput !== 0 && employeesFirstName.includes(searchInput)) ||
      employeesLastName.includes(searchInput)
    ) {
      results.push(data[i]);
      gallery.textContent = "";
      employees = results;
      generateHTML(results);
      popUp(results);
    }
  } //Return No result.
  if (results == 0) {
    gallery.textContent = `No results found`;
  }
};

//call Async function
fetchData(randomUserUrl);
