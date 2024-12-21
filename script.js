import { generateAIResponse } from "./aiService.js";

const ingredientInput = document.getElementById('ingredientInput');
const addBtn = document.getElementById('addBtn');
const ingredientList = document.getElementById('ingredientList');
const recipeList = document.getElementById('recipeList');

let ingredients = [];

addBtn.addEventListener('click', () => {
    const ingredient = ingredientInput.value.trim().toLowerCase();

    if (ingredient && !ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
        addIngredientToUI(ingredient);
        saveIngredientsToLocalStorage(ingredients);
        ingredientInput.value = '';
        generateRecipeSuggestions();  
    } else {
        alert('Please enter a valid, unique ingredient.');
    }
});

document.addEventListener('DOMContentLoaded', loadIngredientsFromLocalStorage);

function loadIngredientsFromLocalStorage() {
    const ingredients = getIngredientsFromLocalStorage();
    ingredients.forEach(ingredient => addIngredientToUI(ingredient));
    generateRecipeSuggestions();  
}

function getIngredientsFromLocalStorage() {
    const ingredients = localStorage.getItem('ingredients');
    return ingredients ? JSON.parse(ingredients) : [];
}

function saveIngredientsToLocalStorage(ingredients) {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

function addIngredientToUI(ingredient) {
    const li = document.createElement('li');
    li.textContent = ingredient;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
        editIngredient(ingredient, li);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        removeIngredient(ingredient);
        li.remove();
        generateRecipeSuggestions();  
    });

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    ingredientList.appendChild(li);
}

function removeIngredient(ingredient) {
    let ingredients = getIngredientsFromLocalStorage();
    ingredients = ingredients.filter(item => item !== ingredient);
    saveIngredientsToLocalStorage(ingredients);
    generateRecipeSuggestions();  
}

function editIngredient(ingredient, li) {
    const newIngredient = prompt('Edit the ingredient:', ingredient);

    if (newIngredient && newIngredient.trim()) {
        let ingredients = getIngredientsFromLocalStorage();
        const ingredientIndex = ingredients.indexOf(ingredient);
        if (ingredientIndex > -1) {
            ingredients[ingredientIndex] = newIngredient.trim();
            saveIngredientsToLocalStorage(ingredients);
            li.firstChild.textContent = newIngredient;
            generateRecipeSuggestions();  
        }
    } else {
        alert('Please enter a valid ingredient.');
    }
}

async function generateRecipeSuggestions() {
    const ingredientString = ingredients.join(', '); 
    if (ingredients.length === 0) {
        recipeList.innerHTML = '<li>No ingredients entered yet. Please add some ingredients to get recipe suggestions.</li>';
        return;
    }


    const prompt = `Please generate recipe suggestions with image based on the following ingredients: ${ingredientString}. Provide a list of three recipes with short descriptions. Format your response with bullet points for each recipe. Make sure the recipes are simple, easy to follow, and suitable for someone with basic cooking skills also don't use any single stat (*) and double star (**) for heiglight.`;
    try {
        const response = await generateAIResponse(prompt); 
        console.log('AI Response:', response);

        const recipes = extractRecipes(response);
        console.log("Recipes:", recipes); 
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error generating recipes:', error);
        recipeList.innerHTML = '<li>Sorry, there was an error generating recipe suggestions.</li>';
    }
}


function extractRecipes(response) {
    const recipe = response.split('**')
    console.log("Extracted recipes:", recipe); 
    return recipe;
}


function displayRecipes(recipes) {
    recipeList.innerHTML = '';

    if (Array.isArray(recipes) && recipes.length > 0) {
        console.log('recipes[0]--',recipes[0]);
        
        for(let i = 0; i < 3; i++){
            recipeList.innerHTML += `<li>
            <strong>${recipes[i+1]}</strong>
            <p>${recipes[i+2]}</p>
            </li>`
        }
    } else {
        recipeList.innerHTML = '<li>No recipes found for the given ingredients.</li>';
    }
}

