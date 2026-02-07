document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    const engine = new GameEngine(GAME_DATA);
    
    // Run Tests (Dev Mode - Check Console)
    if (typeof runTests === 'function') runTests();

    // DOM Elements
    const views = {
        setup: document.getElementById('setup-panel'),
        game: document.getElementById('game-panel'),
        end: document.getElementById('end-panel')
    };

    const els = {
        score: document.getElementById('score-display'),
        finalScore: document.getElementById('final-score'),
        timer: document.getElementById('timer-display'),
        card: document.getElementById('game-card'),
        clues: document.getElementById('clue-list'),
        diffBadge: document.getElementById('diff-badge'),
        ansName: document.getElementById('answer-name'),
        ansHint: document.getElementById('answer-hint'),
        ansCat: document.getElementById('answer-cat'),
        ansCountry: document.getElementById('answer-country'),
        btnReveal: document.getElementById('btn-reveal'),
        decisionBtns: document.getElementById('decision-buttons')
    };

    // State Flags
    let timerInterval = null;
    let timeRemaining = 30;
    const TIME_LIMIT = 30;
    let isProcessing = false; 

    // --- Navigation Functions ---

    function switchView(viewName) {
        Object.values(views).forEach(el => el.classList.remove('active', 'hidden'));
        views[viewName].classList.add('active');
    }

    function renderCard(card) {
        // Reset card flip
        els.card.classList.remove('is-flipped');
        
        // Populate Front
        els.clues.innerHTML = card.words.map(w => `<li>${w}</li>`).join('');
        els.diffBadge.textContent = card.difficulty;
        
        // Color code badge based on difficulty
        const colors = { 'Easy': '#10b981', 'Medium': '#f59e0b', 'Hard': '#ef4444' };
        els.diffBadge.style.color = colors[card.difficulty] || '#64748b';

        // Populate Back
        els.ansName.textContent = card.name;
        els.ansHint.textContent = card.hint;
        els.ansCat.textContent = card.category;
        els.ansCountry.textContent = card.country;

        // Reset Buttons
        els.btnReveal.classList.remove('hidden');
        els.decisionBtns.classList.add('hidden');
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeRemaining = TIME_LIMIT;
        els.timer.textContent = timeRemaining;
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            els.timer.textContent = timeRemaining;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                revealCard(true); 
            }
        }, 1000);
    }

    function revealCard(timeRunOut = false) {
        clearInterval(timerInterval);
        els.card.classList.add('is-flipped');
        els.btnReveal.classList.add('hidden');
        els.decisionBtns.classList.remove('hidden');
    }

    function handleDecision(isCorrect) {
        if (isProcessing) return;
        isProcessing = true; 

        if (isCorrect) {
            const points = engine.calculateScore(timeRemaining, engine.currentCard.difficulty);
            engine.addScore(points);
            els.score.textContent = engine.score;
        }

        // Delay for visual feedback
        setTimeout(() => {
            if (engine.hasNext) {
                engine.nextCard();
                renderCard(engine.currentCard);
                startTimer();
            } else {
                endGame();
            }
            isProcessing = false; 
        }, 400); // 400ms is snappy enough
    }

    function startGame() {
        // NEW: Get difficulty from the radio buttons (Pills)
        const diffInput = document.querySelector('input[name="difficulty"]:checked');
        const diff = diffInput ? diffInput.value : "All";
        
        engine.initGame(diff);
        
        if (engine.deck.length === 0) {
            alert("No cards found for this difficulty.");
            return;
        }

        els.score.textContent = 0;
        renderCard(engine.currentCard);
        switchView('game');
        startTimer();
    }

    function endGame() {
        clearInterval(timerInterval);
        els.finalScore.textContent = engine.score;
        switchView('end');
    }

    // --- Event Listeners ---

    document.getElementById('btn-start').addEventListener('click', startGame);
    
    document.getElementById('btn-restart').addEventListener('click', () => {
        switchView('setup');
    });

    els.btnReveal.addEventListener('click', () => revealCard(false));

    document.getElementById('btn-correct').addEventListener('click', () => handleDecision(true));
    document.getElementById('btn-wrong').addEventListener('click', () => handleDecision(false));
});