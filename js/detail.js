document.addEventListener('DOMContentLoaded', () => {
  getRecipeDetails();
});

function getRecipeDetails() {
  // Extraire l'ID de la recette de l'URL
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get('id');

  // Remplacer par l'URL de votre API et ajouter l'ID de la recette à l'URL
  fetch(`https://dummyjson.com/recipes/${recipeId}`)
    .then(response => response.json())
    .then(data => updateRecipeDetails(data))
    .catch(error => console.error('Erreur lors de la récupération des détails de la recette:', error));
}

function updateRecipeDetails(recipe) {

  console.log("Détails de la recette reçus:", recipe);
  // Vérifie si la propriété 'name' existe
  if (recipe.name) {
    document.title = recipe.name;
  } else {
    console.error("La propriété 'name' est manquante dans l'objet recette");
    document.title = "Recette sans nom";
  }

  document.getElementById('recipe-title').textContent = recipe.title || recipe.name; // Assurez-vous que la clé correspond à la réponse de votre API
  document.getElementById('recipe-difficulty').innerHTML += recipe.difficulty || 'Unknown';
  document.getElementById('recipe-image').src = recipe.image;
  document.getElementById('recipe-image').alt = `Image of ${recipe.title || recipe.name}`;
  document.getElementById('prep-time').innerHTML += recipe.prepTimeMinutes + ' minutes' || 'Unknown';
  document.getElementById('cook-time').innerHTML += recipe.cookTimeMinutes + ' minutes' || 'Unknown';
  document.getElementById('servings').innerHTML += recipe.servings || 'Unknown';
  document.getElementById('cuisine').innerHTML += recipe.cuisine || 'Unknown';
  document.getElementById('calories').innerHTML += recipe.caloriesPerServing + ' calories' || 'Unknown';
  document.getElementById('meal-type').innerHTML += recipe.mealType || 'Unknown';
  document.getElementById('rating').innerHTML += recipe.rating + '/5' || 'Unknown';

  const ingredientsList = document.getElementById('ingredients');
  recipe.ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient;
    ingredientsList.appendChild(li);
  });

  const instructionsList = document.getElementById('instructions');
  recipe.instructions.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    instructionsList.appendChild(li);
  });
}
