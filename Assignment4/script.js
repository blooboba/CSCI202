//Holds a dictionary/array of sculpture data: image, title, artist name, and a fact/fun fact
const sculptures = [
    {
      id: 1,
      image: "images/rockring.jpg",
      title: "Stone Enclosure: Rock Rings",
      artist: "Nancy Holt",
      fact: "Installed in 1977, this sculpture was created from the side of Red Mountain (Lillooet Mountain Range)."
    },
    {
      id: 2,
      image: "images/manus.jpg",
      title: "Manus",
      artist: "Magdalena Abakanowicz",
      fact: "Magdalena specifically chose the location of the sculpture to link the trees of Sehome Hill with the human activity of the campus."
    },
    {
      id: 3,
      image: "images/garapata.jpg",
      title: "Garapata",
      artist: "John Keppelman",
      fact: "Inspired by origami paper, John named it 'after a dramatic California setting, a river and canyon which intersects with the Pacific Ocean'."
    },
    {
      id: 4,
      image: "images/steamwork.jpg",
      title: "Untitled (Steam Work for Bellingham)",
      artist: "Robert Morris",
      fact: "The steam's flowing source comes from Western's Steam Plant."
    },
    {
      id: 5,
      image: "images/untitled.jpg",
      title: "Untitled",
      artist: "Donald Judd",
      fact: "This sculpture was removed from campus in 2014 due to serious corrosion, but returned in 2019 after a conservation plan was developed in 2018."
    },
  ];
  
  let currentIndex = 0; //This helps track which sculpture the user is on
  
  // The welcome screen 
  function renderWelcome() {
    document.getElementById("main-content").innerHTML = `
      <div class="text-center">
        <h1 class="mb-4">WWU Sculpture Scavenger Hunt</h1>
        <img src="images/wwu.png" class="img-fluid rounded mb-4 shadow" alt="Welcome Image">
        <p class="mb-4">Can you recognize these campus sculptures from just a close-up?</p>
        <button class="btn btn-primary btn-lg" onclick="renderZoomedIn()">Start the Hunt</button>
      </div>
    `;
  }
  
  // Holds the photo of the sculpture and button when the sculpture is found
  function renderZoomedIn() {
    const sculpture = sculptures[currentIndex];
    document.getElementById("main-content").innerHTML = `
      <div class="text-center">
        <h4 class="mb-3">Can you find this sculpture on campus?</h4>
        <img src="${sculpture.image}" class="img-fluid rounded mb-4 shadow" alt="Zoomed-in sculpture">
        <button class="btn btn-success" onclick="renderReveal()">Found It!</button>
      </div>
    `;
  }
  
  // Reveals the sculpture and includes the information of the sculpture
  function renderReveal() {
    const sculpture = sculptures[currentIndex];
    document.getElementById("main-content").innerHTML = `
      <div class="text-center">
        <h4 class="found-text mb-3">You found it!</h4>
        <img src="${sculpture.image}" class="img-fluid rounded mb-4 shadow" alt="Zoomed-in sculpture">
        <h5 class="reveal-title">${sculpture.title}</h5>
        <p><strong>Artist:</strong> ${sculpture.artist}</p>
        <p><em>${sculpture.fact}</em></p>
        <button class="btn btn-primary mt-3" onclick="${currentIndex < sculptures.length - 1 ? 'nextSculpture()' : 'renderGallery()'}">
          ${currentIndex < sculptures.length - 1 ? 'Next Sculpture' : 'Finish Hunt'}
        </button>
      </div>
    `;
  }
  
  // Function that moves to the next sculpture
  function nextSculpture() {
    currentIndex++;
    renderZoomedIn();
  }
  
  //Moves onto the gallery that holds cards of each sculpture that can be clicked on
  function renderGallery() {
    let galleryHTML = `
      <div class="text-center mb-4">
        <h2 class="text-primary">🎉 Congratulations!</h2>
        <p class="lead">You've found all the sculptures!</p>
      </div>
      <div class="row row-cols-1 row-cols-sm-2 g-4">
    `;
  
    // Same as 'renderReveal()' function that holds the information of the sculpture when the gallery photo is clicked on
    sculptures.forEach((sculpture, index) => {
      galleryHTML += `
        <div class="col">
          <div class="card h-100 shadow-sm" onclick="renderSculptureDetail(${index})" style="cursor: pointer;">
            <img src="${sculpture.image}" class="card-img-top" alt="${sculpture.title}">
            <div class="card-body">
              <h5 class="card-title">${sculpture.title}</h5>
              <p class="card-text">${sculpture.artist}</p>
            </div>
          </div>
        </div>
      `;
    });
  
    galleryHTML += `
      </div>
      <div class="text-center mt-4">
        <button class="btn btn-primary" onclick="restartHunt()">Restart Hunt</button>
      </div>
    `;
  
    document.getElementById("main-content").innerHTML = galleryHTML;
  }
  
  // Same as 'renderReveal()' function that holds the information of the sculpture when the gallery photo is clicked on
  function renderSculptureDetail(index) {
    const sculpture = sculptures[index];
    document.getElementById("main-content").innerHTML = `
      <div class="text-center mb-4">
        <img src="${sculpture.image}" class="img-fluid rounded mb-3 shadow" alt="${sculpture.title}">
        <h2 class="text-primary">${sculpture.title}</h2>
        <p class="text-white">${sculpture.artist}</p>
        <p class="lead">${sculpture.fact}</p>
        <button class="btn btn-secondary mt-3" onclick="renderGallery()">Back to Gallery</button>
      </div>
    `;
  }
  
  function restartHunt() {
    currentIndex = 0;
    renderWelcome();
  }
  
  document.addEventListener("DOMContentLoaded", renderWelcome);
  
