async function loadGameData() {
    try {
        const response = await fetch('dataset.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Could not load game data:", error);
        return []; // Return empty array on failure
    }
}