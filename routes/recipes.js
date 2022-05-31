var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 * sends detailedRecipe
 */
router.get("/getRecipe", async (req, res, next) => {
  let recipeId=req.query.recipeId
  // try {
  //   const recipe = await recipes_utils.getRecipeDetails(req.params.id);
  //   res.send(recipe);
  // } catch (error) {
  //   next(error);
  // }
});
/**
 * This path returns q random recipies
 * sends skinnyRecipe array
 */
 router.get("/GetRandomRecepies", (req, res) => {
   let quantity=req.query.quantity

   
 });

/**
 * returns recipes that matches the query
 * sends skinnyRecipe array
 */
router.get("/searchRecipe", async (req, res, next) => {
  try {
    
    let username=req.query.username
    let query=req.query.query
    let numberOfResultsToDisplay=req.query.numberOfResultsToDisplay
    let options=req.query.options
    


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
    let detailedRecipeObj=req.params 

  } catch (error) {
    next(error);
  }
});
/**
 * set recipe to "username"s favorit
 * sends status
 */
 router.post("/setRecipeFavorite", async (req, res, next) => {
  try {
    let recipeId=req.params.recipeId
    let username=req.params.username
  


  } catch (error) {
    next(error);
  }
});
/**
 * get all favorit recipes
 * sends skinnyRecipe array
 */
 router.get("/getFavioriteRecepies", async (req, res, next) => {
  try {
    let username=req.query.username
  


  } catch (error) {
    next(error);
  }
});
/**
 * get all users recipes
 * sends skinnyRecipe array
 */
 router.get("/getMyRecepies", async (req, res, next) => {
  try {
    let username=req.query.username
  

  } catch (error) {
    next(error);
  }
});
/**
 * add recipes to users recipes
 * sends status
 */
 router.post("/setMyRecipies", async (req, res, next) => {
  try {
    let username=req.params.username
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
