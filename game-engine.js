/* game-engine.js */
class GameEngine {
    constructor(data) {
        this.data = JSON.parse(JSON.stringify(data)); // Deep copy/Immutable source
        this.deck = [];
        this.currentIndex = 0;
        this.score = 0;
        this.multipliers = { "Easy": 1, "Medium": 2, "Hard": 3 };
        this.baseScore = 10;
    }

    initGame(difficultyFilter = "All") {
        if (difficultyFilter === "All") {
            this.deck = [...this.data];
        } else {
            this.deck = this.data.filter(item => item.difficulty === difficultyFilter);
        }
        this.shuffleDeck();
        this.currentIndex = 0;
        this.score = 0;
    }

    shuffleDeck() {
        // Fisher-Yates Shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    get currentCard() {
        return this.deck[this.currentIndex] || null;
    }

    get hasNext() {
        return this.currentIndex < this.deck.length - 1;
    }

    nextCard() {
        if (this.currentIndex < this.deck.length) {
            this.currentIndex++;
            return this.currentCard;
        }
        return null;
    }

    calculateScore(timeRemaining, difficulty) {
        const mult = this.multipliers[difficulty] || 1;
        return (timeRemaining * mult) + this.baseScore;
    }

    addScore(points) {
        this.score += points;
        return this.score;
    }
}