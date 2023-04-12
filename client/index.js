//create card for each person
function createCard() {
  const containerEl = document.querySelector(".container");
  const div = document.createElement("div");
  div.innerHTML = `<h2>${person}</h2>`;
  fetch(`http://localhost:3000/api/${person}`)
    .then((response) => response.json())
    .then((person) => {
      console.log(person);
      person.forEach((person) => {});
      containerEl.appendChild(div);
    });
}

createCard();

//   const cardEl = (document.getElementById(
//     "myAnchor"
//   ).href = `'http://localhost:3000/api/${person}'`);
//   cardEl.append(containerEl);

// let searchbutton = document.getElementById("searchbutton");
// let searchInput = document.getElementById("search");

// search.addEventListener("click", () => {
//   let value = searchInput.value;

//   fetch(`http://localhost:3000/person`)
//     .then((response) => response.json())
//     .then((person) => {
//       console.log(person);
//       person.forEach((person) => {
//         containerEl.innerHTML += `<h2>$(person.name)<h2>`;
//       });
//     });
// });
