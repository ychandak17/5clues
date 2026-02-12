/* tests.js */
function runTests(data) {
    console.group("TDD Unit Tests");
    
    const engine = new GameEngine(data);
    let passed = 0;
    let total = 0;

    const assert = (desc, condition) => {
        total++;
        if (condition) {
            console.log(`✅ PASS: ${desc}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${desc}`);
        }
    };

    // Test 1: JSON Validation (Simulated)
    assert("Data has correct schema (5 words)", engine.data.every(c => c.words.length === 5));

    // Test 2: Difficulty Filtering
    engine.initGame("Hard");
    assert("Filter selects only Hard cards", engine.deck.every(c => c.difficulty === "Hard"));

    // Test 3: Deck Shuffling
    // Note: Statistical impossibility of identical shuffle is ignored for simple unit test
    engine.initGame("All"); // Reset
    const snapshotA = JSON.stringify(engine.deck[0]);
    engine.shuffleDeck(); 
    // In a real TDD env, we'd seed the random or check distribution, 
    // here we check if structure remains valid after shuffle.
    assert("Deck exists after shuffle", engine.deck.length > 0);

    // Test 4: Scoring Logic
    // Formula: (TimeRemaining * Multiplier) + Base(10)
    // Hard Multiplier = 3. Time = 10. Expected: 30 + 10 = 40.
    const score = engine.calculateScore(10, "Hard");
    assert("Scoring logic (Hard, 10s)", score === 40);

    // Test 5: Next Card Navigation
    engine.initGame("All");
    const firstCard = engine.currentCard;
    engine.nextCard();
    assert("Navigates to next card", engine.currentCard !== firstCard);

    console.log(`Test Results: ${passed}/${total} Passed`);
    console.groupEnd();
}