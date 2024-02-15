const flipCard = document.querySelector('.flip-card');
const studyCards = document.querySelector('.study-cards');
const slider = document.querySelector('.slider');
const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back');
const frontTitle = cardFront.querySelector('h1');
const backTitle = cardBack.querySelector('h1');
const backExample = cardBack.querySelector('span');
const buttonNext = document.querySelector('#next');
const buttonBack = document.querySelector('#back');
const wordsProgress = document.querySelector('#words-progress');
const wordCurrent = document.querySelector('#current-word');
const shuffleWords = document.querySelector('#shuffle-words');
const buttonTesting = document.querySelector('#exam');
const exam = document.querySelector('#exam-cards');
const studyMode = document.querySelector('#study-mode');
const examMode = document.querySelector('#exam-mode');
const examProgress = document.querySelector('#exam-progress');
const correctPercent = document.querySelector('#correct-percent');
const time = document.querySelector('#time');
const motivation = document.querySelector('.motivation');


class Cards {
    constructor(title, translation, example) {
        this.title = title;
        this.translation = translation;
        this.example = example;
    }
}

const card1 = new Cards('Dog', 'Собака', 'There are no dogs in the world with the same nose print.');
const card2 = new Cards('Rabbit', 'Кролик', 'Rabbits purr when they are satisfied.');
const card3 = new Cards('Hamster', 'Хомяк', 'Most hamsters are single.');
const card4 = new Cards('Donkey', 'Осел', 'Donkeys are the philosophers of the horse world.');
const card5 = new Cards('Parrot', 'Попугай', 'Parrots choose themselves a couple of times and for life.');


const array = [card1, card2, card3, card4, card5];

slider.addEventListener('click', () => {
    if (flipCard.classList.contains('active')) {
        flipCard.classList.remove('active');
    } else {
        flipCard.classList.add('active');
    }
});

let i = 0;

function prepareCard(content) {
    frontTitle.textContent = content.title;
    backTitle.textContent = content.translation;
    backExample.textContent = content.example;
    wordCurrent.textContent = i + 1;
    wordsProgress.value = (i + 1) / array.length * 100;
};

prepareCard(array[i]);

buttonNext.addEventListener('click', function() {
    i++;
    prepareCard(array[i]);
    buttonBack.removeAttribute('disabled');
    if (i == array.length - 1) {
        buttonNext.disabled = true;
    }
});

buttonBack.addEventListener('click', function() {
    i--;
    prepareCard(array[i]);
    buttonNext.removeAttribute('disabled');
    if (i == 0) {
        buttonBack.disabled = true;
    }
});

shuffleWords.addEventListener('click', function() {
    array.sort(() => Math.random() - 0.5);
    prepareCard(array[i]);
});



function createCard(card) {
    const divCard = document.createElement('div');
    divCard.classList.add('card');
    const nameCard = document.createElement('p');
    divCard.append(nameCard);
    nameCard.textContent = card;
    divCard.onclick = () => findTransferCard(divCard);
    return divCard;
};

function addCards() {
    const fragment = new DocumentFragment();
    const newArray = [];
    array.forEach((arr) => {
        newArray.push(createCard(arr.title));
        newArray.push(createCard(arr.translation));
    });
    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    exam.innerHTML = "";
    exam.append(fragment);
};

let timer;
let sec = 0;
let min = 0;

buttonTesting.addEventListener('click', function() {
    studyCards.classList.add('hidden');
    addCards();
    studyMode.classList.add('hidden');
    examMode.classList.remove('hidden');
    timer = setInterval(() => {
        sec++;
        if (sec == 60) {
            sec = 0;
            min++;
        }
        if (sec < 10) {
            time.textContent = `${min}:0${sec}`
        } else {
            time.textContent = `${min}:${sec}`
        }
    }, 1000)
});

let selectedCard = null;
let progressWord = 0;
const sizeArrayWord = array.length;



function addExamProgress(value) {
    const progress = (100 * (value + 1)) / sizeArrayWord;
    return Math.round(progress);
};

function findTransferCard(currentCard) {
    if (!selectedCard) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('correct');
            card.classList.remove('wrong');
        });
        currentCard.classList.add('correct');
        selectedCard = currentCard;
    } else {
        const wordProcess = array.find(word => selectedCard.textContent === word.translation || selectedCard.textContent === word.title);
        if (wordProcess.translation === currentCard.textContent || wordProcess.title === currentCard.textContent) {
            currentCard.classList.add('correct');
            currentCard.classList.add('fade-out');
            selectedCard.classList.add('fade-out');
            correctPercent.textContent = addExamProgress(progressWord) + '%';
            examProgress.value = addExamProgress(progressWord);
            progressWord++;

            if (progressWord == sizeArrayWord) {
                clearInterval(timer);
                motivation.textContent = 'Молодчина! Ты делаешь успехи!';
            }
        } else {
            selectedCard.classList.add('correct');
            currentCard.classList.add('wrong');
            setTimeout(() => {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    card.classList.remove('correct');
                    card.classList.remove('wrong');
                })
            }, 500)
        }
        selectedCard = null;

    }
}