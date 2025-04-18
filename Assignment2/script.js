// Get all card elements on page and store them in a NodeList
const cards = document.querySelectorAll('.card');

// Loop through NodeList/Cards
cards.forEach((card) => {
    //Click event that toggles the 'flipped' class
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

//Keyboard event that toggles the 'flipped' class depending on number
document.addEventListener('keydown', (event) => {
    //Reads which value key is pressed down
    switch (event.key) {
        //First case checking if '1' was pressed
      case '1': 
        //Flips first card in NodeList
        cards[0].classList.toggle('flipped');
        break;

        //Second case checking if '2' was pressed
      case '2':
        //Flips second card in NodeList
        cards[1].classList.toggle('flipped');
        break;

        //Third case checking if '3' was pressed
      case '3':
        //Flips third card in NodeList
        cards[2].classList.toggle('flipped');
        break;

        //Fourth case checking if '4' was pressed
      case '4':
        //Flips fourth card in NodeList
        cards[3].classList.toggle('flipped');
        break;
    }
});
