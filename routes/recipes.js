var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");



router.get("/test", async(req, res) =>{
  res.send("test")
})


/**
 * This path returns q random recipies
 * sends skinnyRecipe array
 */ 
 router.get("/randomRecipes", async (req, res, next) => {  
    let quantity=req.query.quantity
    try {
      let random_recipes = await recipes_utils.getRandomQuantityRecipes(quantity);
      res.status(200).send(random_recipes)
    } catch (error) {
      next(error);
    }
  
 });

/**
 * returns recipes that matches the query
 * sends skinnyRecipe array
 */
router.get("/searchRecipe", async (req, res, next) => {
  try {
    // Todo: username should be here?
    // let username=req.query.username
    if(req.session && req.session.user_id){
        req.session.last_searched=req.query.query
    }
    let DEFAULT_QUANTITY=5
    let query=req.query.query
    let numberOfResultsToDisplay=req.query.numberOfResultsToDisplay
    let diet=req.query.diet
    let cuisine=req.query.cuisine
    let intolerances=req.query.intolerances
    let sort=req.query.sort
    let uid=req.session.user_id
    let browser=req.query.browser
    let quantity=req.query.quantity
    quantity=quantity?quantity:DEFAULT_QUANTITY
    let recipes=await recipes_utils.searchRecipe(query,numberOfResultsToDisplay,diet,cuisine,
                                            intolerances,sort,uid,browser);
    
    res.status(200).send(recipes.slice(0,quantity))

  } catch (error) {
    next(error);
  }
});
/**
 * create new recipe
 * sends status
 */ 
router.put("/recipe", async (req, res, next) => { 
  try {
    let detailedRecipeObj=req.body 
    detailedRecipeObj.uid=req.session.user_id
    let status=await recipes_utils.createRecipe(detailedRecipeObj);
    res.send(status)
  } catch (error) {
    next(error);
  }
});
/**
 * This path returns a full details of a recipe by its id
 * sends detailedRecipe
 */
 router.get("/recipe", async (req, res, next) => { //id = 655705
    //let recipeId=req.query.recipeId
    try {
      const recipe = await recipes_utils.getRecipeDetails(req.query.rid);
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
