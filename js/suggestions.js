document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    attachKeyPressEvent();
    attachDocumentClickEvent(); // Ajouter cette ligne pour gérer le clic hors de la zone de suggestions
});

// Attache un événement de clic au document pour fermer les suggestions si on clique en dehors
function attachDocumentClickEvent() {
    document.addEventListener('click', function (event) {
        const suggestionsBox = document.getElementById('suggestions-box');
        const searchInput = document.getElementById('search-input');
        // Vérifier si le clic n'était ni sur l'input ni sur la boîte de suggestions
        if (!suggestionsBox.contains(event.target) && !searchInput.contains(event.target)) {
            suggestionsBox.classList.remove('visible'); // Cacher la boîte de suggestions
        }
    });
}

// Initializes the search input with saved values if they exist
function initializeSearch() {
    // Clear the search input and any stored values initially
    const searchInput = document.getElementById('search-input');
    searchInput.value = ""; // Clears any previous text
    searchInput.dataset.selectedId = ""; // Clears any stored ID

    // Optionally clear the localStorage items if they should not persist after the page is reloaded
    localStorage.removeItem('selectedRecipeName');
    localStorage.removeItem('selectedRecipeId');
}

// Attaches key press event to handle 'Enter' key
function attachKeyPressEvent() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', handleKeyPress);
}

// Handles the 'Enter' key press to trigger search
function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Prevents the default form submit behavior
        performSearch();
    }
}

// Performs the search using selected recipe ID or alerts if none is selected
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const selectedId = searchInput.dataset.selectedId || localStorage.getItem('selectedRecipeId');
    if (selectedId) {
        window.location.href = `detail.html?id=${selectedId}`;
    } else {
        alert("Please select a recipe from the suggestions or enter a valid recipe name.");
    }
}

// Fetches all recipes on focus if no input is provided
function updateSuggestions(inputText) {
    if (inputText.length < 1) {
        fetchAllRecipes();
        return;
    }
    fetch(`https://dummyjson.com/recipes/search?q=${inputText}`)
        .then(response => response.json())
        .then(data => {
            displaySortedRecipes(data.recipes, inputText);
        });
}

// Fetches all recipes from the API
function fetchAllRecipes() {
    fetch(`https://dummyjson.com/recipes`)
        .then(response => response.json())
        .then(data => {
            displaySortedRecipes(data.recipes);
        });
}

function normalizeText(text) {
    return text.toLowerCase(); // Convertit simplement en minuscules sans retirer les caractères
}

// Affichage des recettes triées et paramétrage des événements de clic
function displaySortedRecipes(recipes, inputText = '') {
    let suggestionsHTML = '';
    if (recipes.length > 0) {
        recipes.sort((a, b) => sortRecipes(a, b, inputText));
        recipes.forEach(recipe => {
            const prepTimeIcon = getPrepTimeIcon(recipe.prepTimeMinutes);
            suggestionsHTML += `<div onclick="selectRecipe('${recipe.id}', '${recipe.name}')">
                <span>${recipe.name}</span>
                <span>${prepTimeIcon}</span>
            </div>`;
        });
    } else {
        suggestionsHTML = '<div>No results found</div>';
    }
    const suggestionsBox = document.getElementById('suggestions-box');
    suggestionsBox.innerHTML = suggestionsHTML;
    suggestionsBox.classList.add('visible');
}

// Trie les recettes basées sur le texte d'entrée et l'ordre alphabétique
function sortRecipes(a, b, inputText) {
    const nameA = normalizeText(a.name);
    const nameB = normalizeText(b.name);
    const searchText = normalizeText(inputText);
    if (searchText) {
        if (nameA.startsWith(searchText) && !nameB.startsWith(searchText)) {
            return -1;
        } else if (!nameA.startsWith(searchText) && nameB.startsWith(searchText)) {
            return 1;
        }
    }
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
}

// Selects a recipe and sets the input field
function selectRecipe(id, name) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = name;
    searchInput.dataset.selectedId = id;
    document.getElementById('suggestions-box').classList.remove('visible');
}
