const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}


//async function getRecipesPreview

async function exractPreviewRecipeDetails(recipes_info){
    //return (recipes_info.length)
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })
}


async function getRandomRecipes(){
    const response = await axios.get(`${api_domain}/random`, {
        params:{
            number: 10,
            apiKey: process.env.spooncular_apiKey
        }
    })
    return response;
}
async function getRandomQuantityRecipes(quantity){
    let random_pool = await getRandomRecipes();
    let filtered_random_recipes = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image)) //TODO: figure whats missing here
    if(filtered_random_recipes.length < 3){
        return getRandomQuantityRecipes(quantity)
    }
    let new_filtered_random_recipes = filtered_random_recipes.slice(0, quantity)
    return exractPreviewRecipeDetails(new_filtered_random_recipes)
}



exports.getRecipeDetails = getRecipeDetails;
exports.getRandomQuantityRecipes = getRandomQuantityRecipes;



