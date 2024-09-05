const dialogues = [
    {
        text: "안녕! 나는 곰이야! 오늘 맛있는 걸 먹고 싶은데, 함께 갈래?",
        choices: ["그럼, 맛집을 찾아보자!", "오늘은 다른 곳에 가고 싶어."],
    },
    {
        text: "여기 근처에 유명한 빵집이 있어. 가볼까?",
        choices: ["네, 빵집으로 가요!", "아니요, 다른 곳이 좋아요."],
        minigame: "find_the_cookie"
    },
    {
        text: "아이스크림 가게가 있대. 시원하게 아이스크림 먹고 갈래?",
        choices: ["네, 아이스크림 가게로 가요!", "다른 데는 없을까?"],
        minigame: "ice_cream_challenge"
    },
    {
        text: "여기 있는 레스토랑은 멋지고 음식도 맛있대. 가볼까?",
        choices: ["네, 레스토랑으로 가요!", "아니요, 다른 곳이 좋아요."],
        minigame: "restaurant_quiz"
    }
];

let currentDialogueIndex = 0;
let cookieCount = 7; 
let iceCreamRound = 0; 
let correctIceCream = [["초코", "바닐라", "딸기"], ["딸기", "초코", "바닐라"], ["바닐라", "초코", "딸기"]]; 
let correctAnswers = ["초밥", "햄버거"]; 

function updateDialogue() {
    const dialogue = dialogues[currentDialogueIndex];
    document.getElementById('dialogue-text').innerText = dialogue.text;
    document.getElementById('choice1').innerText = dialogue.choices[0];
    document.getElementById('choice2').innerText = dialogue.choices[1];

    document.getElementById('choice1').onclick = () => handleChoice(0);
    document.getElementById('choice2').onclick = () => handleChoice(1);
}

function handleChoice(choiceIndex) {
    const dialogue = dialogues[currentDialogueIndex];
    if (dialogue.minigame) {
        startMinigame(dialogue.minigame);
    } else {
        currentDialogueIndex++;
        if (currentDialogueIndex < dialogues.length) {
            updateDialogue();
        } else {
            showEndMessage();
        }
    }
}

function startMinigame(gameName) {
    document.getElementById('minigame-container').style.display = 'block';
    hideAllMinigames();
    switch (gameName) {
        case 'find_the_cookie':
            document.getElementById('find_the_cookie').style.display = 'block';
            setupFindTheCookieGame();
            break;
        case 'ice_cream_challenge':
            document.getElementById('ice_cream_challenge').style.display = 'block';
            setupIceCreamChallengeGame();
            break;
        case 'restaurant_quiz':
            document.getElementById('restaurant_quiz').style.display = 'block';
            setupRestaurantQuizGame();
            break;
    }
}

function hideAllMinigames() {
    document.querySelectorAll('.minigame').forEach(game => game.style.display = 'none');
}

function setupFindTheCookieGame() {
    const gameArea = document.getElementById('cookie-game-area');
    gameArea.innerHTML = ''; 
    for (let i = 0; i < cookieCount; i++) {
        const cookie = document.createElement('div');
        cookie.classList.add('cookie');
        cookie.style.top = `${Math.random() * 80}%`;
        cookie.style.left = `${Math.random() * 80}%`;
        cookie.style.opacity = '0.2'; 
        cookie.addEventListener('click', () => {
            cookie.style.opacity = '1'; 
            cookie.style.pointerEvents = 'none'; 
            cookieCount--;
            if (cookieCount === 0) {
                alert('모든 쿠키를 찾았어요! 성공!');
                endMinigame();
            }
        });
        gameArea.appendChild(cookie);
    }
}

function setupIceCreamChallengeGame() {
    iceCreamRound = 0; 
    const ingredients = [];
    updateIceCreamInstruction(); 

    document.querySelectorAll('.ingredient-button').forEach(button => {
        button.addEventListener('click', () => {
            if (ingredients.length < 3) {
                ingredients.push(button.dataset.ingredient);
                document.getElementById('ice-cream-result').innerText = `현재 재료: ${ingredients.join(', ')}`;
                if (ingredients.length === 3) {
                    checkIceCreamResult(ingredients);
                }
            }
        });
    });
}

function updateIceCreamInstruction() {
    const hints = { "초코": "검정", "바닐라": "하얀", "딸기": "빨강" };
    const currentHint = correctIceCream[iceCreamRound].map(ingredient => `${hints[ingredient]}-${ingredient}`).join(', ');
    document.getElementById('ice-cream-instruction').innerText = `아이스크림 재료 조합을 맞추세요! 힌트: ${currentHint} (라운드 ${iceCreamRound + 1})`;
}

function checkIceCreamResult(ingredients) {
    if (JSON.stringify(ingredients) === JSON.stringify(correctIceCream[iceCreamRound])) {
        alert('아이스크림 완성! 성공!');
        iceCreamRound++;
        if (iceCreamRound >= 3) {
            endMinigame();
        } else {
            ingredients.length = 0; 
            updateIceCreamInstruction(); 
        }
    } else {
        alert('틀렸어요! 다시 시도해보세요.');
        ingredients.length = 0;
        document.getElementById('ice-cream-result').innerText = '';
    }
}

function setupRestaurantQuizGame() {
    const quizOptions = document.getElementById('quiz-options');
    const quizHint = document.getElementById('quiz-hint');
    quizOptions.innerHTML = ''; 
    const currentAnswers = correctAnswers.slice(0, Math.min(correctAnswers.length + 1, 5)); 
    const allOptions = ['초밥', '햄버거', '샐러드', '스테이크', '파스타']; 
    const hints = {
        "초밥": "연어 좋아",
        "햄버거": "쌓아 먹어요",
        "샐러드": "풀이 싫어",
        "스테이크": "고기가 먹고 싶어",
        "파스타": "오늘은 면이지!"
    }; 
    quizHint.innerText = `힌트: ${currentAnswers.map(answer => `${hints[answer]}`).join(', ')}`;

    currentAnswers.forEach(answer => allOptions.splice(allOptions.indexOf(answer), 1)); 

    const options = [...currentAnswers, ...allOptions.slice(0, currentAnswers.length)];
    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('quiz-button');
        button.textContent = option;
        button.addEventListener('click', () => {
            if (currentAnswers.includes(option)) {
                button.style.backgroundColor = 'green';
                button.disabled = true;
                currentAnswers.splice(currentAnswers.indexOf(option), 1);
                if (currentAnswers.length === 0) {
                    alert('정답입니다! 성공!');
                    endMinigame();
                }
            } else {
                button.style.backgroundColor = 'red';
                alert('틀렸어요! 다시 시도해보세요.');
            }
        });
        quizOptions.appendChild(button);
    });
}

function endMinigame() {
    document.getElementById('minigame-container').style.display = 'none';
    currentDialogueIndex++;
    if (currentDialogueIndex < dialogues.length) {
        updateDialogue();
    } else {
        showEndMessage();
    }
}

function showEndMessage() {
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('end-message').style.display = 'block';
    document.getElementById('restart-button').onclick = restartGame;
}

function restartGame() {
    currentDialogueIndex = 0;
    updateDialogue();
    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('end-message').style.display = 'none';
}

updateDialogue();
