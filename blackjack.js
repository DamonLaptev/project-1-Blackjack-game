const readline = require("readline"); // Подключение модуля readline для ввода пользователя

// Функция для создания колоды карт
const generateDeck = () => {
  const deck = [];
  const suits = ["Hearts", "Clubs", "Diamonds", "Spades"]; // Масти карт
  const cards = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace", // Номиналы карт
  ];

  // Создание колоды карт
  for (const card of cards) {
    for (const suit of suits) {
      deck.push({ card: card, suit: suit });
    }
  }

  return deck; // Возвращаем готовую колоду
};

// Функция для вытаскивания случайной карты из колоды
const drawCard = (deck) => {
  const randomIndex = Math.floor(Math.random() * deck.length); // Генерация случайного индекса
  const card = deck[randomIndex]; // Извлечение карты по индексу
  deck.splice(randomIndex, 1); // Удаление карты из колоды
  return card; // Возвращаем вытянутую карту
};

// Функция для подсчета очков в руке
const checkScore = (hand) => {
  let total = 0;
  let aceCount = 0;

  for (const cardObject of hand) {
    if (["King", "Queen", "Jack"].includes(cardObject.card)) {
      total += 10; // Все картинки (Валет, Дама, Король) дают 10 очков
    } else if (cardObject.card === "Ace") {
      aceCount += 1;
      total += 11; // Туз может быть 11 очков
    } else {
      total += Number(cardObject.card); // Карты с числами дают свои значения
    }
  }

  // Если сумма очков больше 21 и в руке есть тузы, то меняем их значение на 1
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount -= 1;
  }

  return total; // Возвращаем итоговую сумму очков
};

const myDeck = generateDeck(); // Создаем колоду
const playerHand = []; // Рука игрока
const dealerHand = []; // Рука дилера

// Начальная раздача карт
playerHand.push(drawCard(myDeck));
playerHand.push(drawCard(myDeck));
dealerHand.push(drawCard(myDeck));
dealerHand.push(drawCard(myDeck));

console.log("Начальная рука игрока: ", playerHand);
console.log("Очки игрока: ", checkScore(playerHand));
console.log("Начальная рука дилера: ", dealerHand);
console.log("Очки дилера: ", checkScore(dealerHand));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Функция для запроса ввода пользователя
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Ход игрока
const playerTurn = async () => {
  while (true) {
    const playerScore = checkScore(playerHand);
    const dealerScore = checkScore(dealerHand);

    // Если у игрока больше или равно 21, выход из цикла
    if (playerScore >= 21) break;

    const playerAction = await askQuestion(
      "Хотите взять еще карту ('hit') или остановиться ('stand')? "
    );
    if (playerAction.toLowerCase() === "stand") break; // Если игрок решил остановиться, выход из цикла

    playerHand.push(drawCard(myDeck)); // Игрок берет карту
    console.log("Рука игрока: ", playerHand);
    console.log("Очки игрока: ", checkScore(playerHand));
  }
};

// Ход дилера
const dealerTurn = () => {
  while (checkScore(dealerHand) < 17) {
    dealerHand.push(drawCard(myDeck)); // Дилер берет карты до тех пор, пока у него меньше 17 очков
    console.log("Рука дилера: ", dealerHand);
    console.log("Очки дилера: ", checkScore(dealerHand));
  }
};

// Определение победителя
const determineWinner = () => {
  const playerScore = checkScore(playerHand);
  const dealerScore = checkScore(dealerHand);

  if (playerScore > 21) {
    console.log(
      `Вы проиграли! Ваши очки: ${playerScore}, очки дилера: ${dealerScore}`
    );
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    console.log(
      `Вы выиграли! Ваши очки: ${playerScore}, очки дилера: ${dealerScore}`
    );
  } else if (playerScore === dealerScore) {
    console.log(
      `Ничья! Ваши очки: ${playerScore}, очки дилера: ${dealerScore}`
    );
  } else {
    console.log(
      `Вы проиграли! Ваши очки: ${playerScore}, очки дилера: ${dealerScore}`
    );
  }

  console.log("Конечная рука игрока: ", playerHand);
  console.log("Итоговые очки игрока: ", checkScore(playerHand));
  console.log("Конечная рука дилера: ", dealerHand);
  console.log("Итоговые очки дилера: ", checkScore(dealerHand));
};

// Основная логика игры
const playGame = async () => {
  await playerTurn(); // Ход игрока
  dealerTurn(); // Ход дилера
  determineWinner(); // Определение победителя
  rl.close(); // Закрытие интерфейса readline
};

playGame(); // Запуск игры
