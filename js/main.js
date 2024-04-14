var cardContainer = document.getElementById("card-container");
var allRecipes = []; // Array to hold all recipes

function drawCard(recipe, index) {
  var card = document.createElement("div");
  card.classList.add("col");
  card.style.display = index < 6 ? 'block' : 'none'; // Show only first 6 cards
  var difficultyColor = getDifficultyColor(recipe.difficulty);
  var prepTimeIcon = getPrepTimeIcon(recipe.prepTimeMinutes); // Get appropriate icon based on prep time
  card.innerHTML = `
      <div class="card h-100 card-settings" data-id="${recipe.id}" data-cuisine="${recipe.cuisine}" data-difficulty="${recipe.difficulty}">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
          <div class="card-body">
              <h5 class="card-title">${recipe.name}</h5>
              <p class="card-text"><strong>Cuisine:</strong> ${recipe.cuisine}</p>
              <p class="card-text"><strong>Rating:</strong> ${recipe.rating}/5  (${recipe.reviewCount} reviews)</p>
              <p class="card-text"><strong>Prep Time:</strong> ${prepTimeIcon}</p>
              <p class="card-text" style="color:${difficultyColor};"><strong>Difficulty:</strong> ${recipe.difficulty}</p>
              <div class="button-align">
                  <button class="btn btn-primary button-recipes">View Recipe</button>
              </div>
          </div>
      </div>
  `;
  cardContainer.appendChild(card);
}

function getDifficultyColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'green';
    case 'medium': return 'orange';
    case 'hard': return 'red';
    default: return 'grey';
  }
}

function getPrepTimeIcon(prepTimeMinutes) {
  if (prepTimeMinutes <= 12) {
    return '<i class="fas fa-star star-icon" title="Quick: less than 12 minutes"></i>';  // 1 star for quick recipes
  } else if (prepTimeMinutes <= 24) {
    return '<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon" title="Medium: 15 to 24 minutes"></i>';  // 2 stars for medium recipes
  } else {
    return '<i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon"></i><i class="fas fa-star star-icon" title="Long: 25 minutes or more"></i>';  // 3 stars for long recipes
  }
}

function toggleRecipesVisibility() {
  const isShowingMore = Array.from(cardContainer.children).slice(6).some(card => card.style.display === 'block');
  Array.from(cardContainer.children).forEach((card, index) => {
    if (index >= 6) { // Only toggle the visibility of recipes beyond the first six
      card.style.display = isShowingMore ? 'none' : 'block';
    }
  });
  document.getElementById('toggleButton').innerText = isShowingMore ? 'See More' : 'See Less';
}

function getRecipesFromAPI(url) {
  fetch(url)
    .then(res => res.json())
    .then(json => {
      allRecipes = json.recipes;
      allRecipes.forEach((recipe, index) => drawCard(recipe, index));
    })
    .finally(attachEventListenersToButtons);
}

function attachEventListenersToButtons() {
  var buttonRecipes = document.getElementsByClassName("button-recipes");
  Array.from(buttonRecipes).forEach(button => {
    button.addEventListener("click", function () {
      var card = button.closest(".card");
      var id = card.getAttribute("data-id");
      var cuisine = card.getAttribute("data-cuisine");
      var difficulty = card.getAttribute("data-difficulty");
      window.location.href = `detail.html?id=${id}&cuisine=${cuisine}&difficulty=${difficulty}`;
    });
  });
}

getRecipesFromAPI('https://dummyjson.com/recipes?limit=100');
