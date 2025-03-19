document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;

    updateActiveCard();

    prevButton.addEventListener('click', showPrevCard);
    nextButton.addEventListener('click', showNextCard);

    function showPrevCard() {
        currentIndex = (currentIndex === 0) ? projectCards.length - 1 : currentIndex - 1;
        updateActiveCard();
    }

    function showNextCard() {
        currentIndex = (currentIndex === projectCards.length - 1) ? 0 : currentIndex + 1;
        updateActiveCard();
    }

    function updateActiveCard() {
        projectCards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    setInterval(showNextCard, 5000);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            showPrevCard();
        } else if (event.key === 'ArrowRight') {
            showNextCard();
        }
    });
});