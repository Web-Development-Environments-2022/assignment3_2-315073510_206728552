var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("yoo hoo"));

router.get("/test", async(req, res) =>{
  res.send("test")
})

/**
 * This path returns a full details of a recipe by its id
 * sends detailedRecipe
 */
router.get("/getRecipe", async (req, res, next) => { //id = 655705
  //let recipeId=req.query.recipeId
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.query.id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});
/**
 * This path returns q random recipies
 * sends skinnyRecipe array
 */ 
 router.get("/GetRandomRecepies", async (req, res, next) => {  //quantity = 5
    //res.send("GetRandomRecepies")
    let quantity=req.query.quantity
    try {
      let random_recipes = await recipes_utils.getRandomQuantityRecipes(quantity);
      res.send(random_recipes)
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

    let query=req.query.query
    let numberOfResultsToDisplay=req.query.numberOfResultsToDisplay
    let diet=req.query.diet
    let cuisine=req.query.cuisine
    let intolerances=req.query.intolerances
    let sort=req.query.sort

    let recipes=await recipes_utils.searchRecipe(query,numberOfResultsToDisplay,diet,cuisine,intolerances,sort);
    
    res.send(recipes)

  } catch (error) {
    next(error);
  }
});
/**
 * create new recipe
 * sends status
 */ 
router.put("/createRecipe", async (req, res, next) => { 
  try {
    let detailedRecipeObj=req.body 
    let status=await recipes_utils.createRecipe(detailedRecipeObj);
    res.send(status)
  } catch (error) {
    next(error);
  }
});


module.exports = router;
