const axios = require("axios");
const dbUtils = require("./DButils");
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

//=============================
async function getSkinnyRecipe(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);

    return await exractPreviewRecipeDetails([recipe_info.data])
}
async function getSkinnyRecipes(recipe_id_array) {
    let res=[]
    for(let i=0;i<recipe_id_array.length;i++){
        let tmp=await getSkinnyRecipe(recipe_id_array[i])
        res.push(tmp)
    }
    return res
}
async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    return recipe_info.data
}
async function getRecipesFromDb(recipe_id_array){
    let res=[]
   
    for (let i=0;i<recipe_id_array.length;i++){
        let id=recipe_id_array[i]     
        let resipe=await dbUtils.execQuery(`SELECT * FROM RECIPES WHERE id='${id}';`)
        res.push(resipe)
    }
    return res

}
async function getRandomRecipes(quantity){
    const response = await axios.get(`${api_domain}/random`, {
        params:{
            number: quantity,
            apiKey: process.env.spooncular_apiKey
        }
    })
    return response;
}
async function getRandomQuantityRecipes(quantity){
    let random_pool = await getRandomRecipes(quantity);
    let filtered_random_recipes = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image)) //TODO: figure whats missing here
    if(filtered_random_recipes.length < quantity){
        return getRandomQuantityRecipes(quantity)
    }
    return exractPreviewRecipeDetails(filtered_random_recipes)
}
async function searchRecipe(query,numberOfResultsToDisplay,diet,cuisine,intolerances,sort,uid,browser){
    await dbUtils.execQuery(`DELETE FROM last_searches WHERE user_id='${uid}' and browser='${browser}'`)
    await dbUtils.execQuery(
        `INSERT INTO last_searches VALUES ('${uid}', '${browser}', '${query}');`)

    const resipes = await axios.get(`${api_domain}/complexSearch`, {
        params:{
            query: query,
            number:numberOfResultsToDisplay,
            diet:diet,
            excludeCuisine:cuisine,
            intolerances:intolerances,
            addRecipeInformation:true,
            sort:sort,
            apiKey: process.env.spooncular_apiKey
        }
    })
    res=resipes.data.results.map(r=>{
        return {
            id:r.id,
            title:r.title,
            image:r.image,
            summary:r.summary,
            popularity:r.aggregateLikes,
            preparationMinutes:preparationMinutes,
            instructions:r.analyzedInstructions,
            
        }
    })
    
    return  res;
}
async function createRecipe(detailedRecipe){
   
    const {uid,rid, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,summary,popularity,instructions}=detailedRecipe
    let isExist=false;
    (await getRecipeIdsFromDb()).forEach(el => {
        if(el.rid==rid){
            isExist=true
        }
    });
    if(isExist){
        return 'id exists'
    }
    try{
        await dbUtils.execQuery(
            `INSERT INTO RECIPES VALUES ('${uid}','${rid}', '${title}', '${readyInMinutes}', '${image}','${aggregateLikes}'
            ,${vegan},${vegetarian},${glutenFree},'${summary}','${popularity}','${JSON.stringify(instructions)}');`)
        return 'OK'
       
    }
    catch(e){
        return e
    }
     
 
}
async function getRecipeIdsFromDb(){
    return await dbUtils.execQuery(`SELECT rid FROM RECIPES`)
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRandomQuantityRecipes = getRandomQuantityRecipes;
exports.searchRecipe = searchRecipe;
exports.createRecipe = createRecipe;

exports.getRecipesFromDb = getRecipesFromDb;
exports.getSkinnyRecipes = getSkinnyRecipes;
exports.getSkinnyRecipe = getSkinnyRecipe;
