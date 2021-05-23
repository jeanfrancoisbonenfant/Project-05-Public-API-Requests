const randomUserUrl =
  "https://randomuser.me/api/?results=12&inc=picture,name,email,location,cell,dob&nat=us,dk,fr,gb,ca";
let employees;
async function fetchData(randomUserUrl) {
  const response = await fetch(randomUserUrl);
  const data = await response.json();
  employees = data.results;
  generateHTML(data);
  popup(employees);
  return data;
}
function generateHTML(data) {
  const gallery = document.querySelector(".gallery");
  const html = data.results
    .map(
      (person) =>
        `
      <div class="card" data-index-number = ${data.results.indexOf(person)}>
                    <div class="card-img-container"data-index-number = ${data.results.indexOf(
                      person
                    )}>
                        <img class="card-img" data-index-number = ${data.results.indexOf(
                          person
                        )} src="${person.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container" data-index-number = ${data.results.indexOf(
                      person
                    )}>
                        <h3 id="name" class="card-name cap" data-index-number = ${data.results.indexOf(
                          person
                        )}>${person.name.first} ${person.name.last}</h3>
                        <p class="card-text" data-index-number = ${data.results.indexOf(
                          person
                        )}>${person.email}</p>
                        <p class="card-text cap" data-index-number = ${data.results.indexOf(
                          person
                        )}>${person.location.city}, ${person.location.state}</p>
                    </div>
                </div>
    `
    )
    .join("");
  gallery.insertAdjacentHTML("beforeend", html);
}

function generateModal(data) {
  const body = document.querySelector("body");
  const person = data;
  const phone = person.cell.replace(/[\W+]/g, "");

  const phoneNumber = `(${phone.substring(0, 3)}) ${phone.substring(
    3,
    6
  )}-${phone.substring(6, 10)}`;
  const dob = person.dob.date.slice(0, 10).replace(/[-]/g, "");
  const Birthday = `${dob.substring(4, 6)}/${dob.substring(
    6,
    8
  )}/${dob.substring(0, 4)}`;
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
  body.insertAdjacentHTML("beforeend", modal);
}

function popup(data) {
  const card = document.querySelectorAll(".card");
  for (let i = 0; i < card.length; i++) {
    card[i].addEventListener("click", (e) => {
      let index = e.target.dataset.indexNumber;
      generateModal(employees[index]);

      let closeButton = document.querySelector(".modal-close-btn");
      closeButton.addEventListener("click", (e) => closePopUp());

      let next = document.querySelector(".modal-next");
      function nextPopUp() {
        let nextIndex = parseInt(index) + 1;
        closePopUp();
        generateModal(employees[nextIndex]);
        closeButton = document.querySelector(".modal-close-btn");
        index = nextIndex;
        if (nextIndex === 11) {
          next = document.querySelector(".modal-next");
          next.style.display = "none";
        } else {
          next = document.querySelector(".modal-next");
          next.style.display = "";
        }
      }

      next.addEventListener("click", (e) => nextPopUp());
    });
  }
}

function closePopUp() {
  const body = document.querySelector("body");
  const modal = document.querySelector(".modal-container");
  body.removeChild(modal);
}

fetchData(randomUserUrl);
