var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});

router.get("/", (req, res) => res.send("woo hoo"));

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesFromDb(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns last search
 * sends string that is the last searched term
 */
 router.get("/getLastSearch", async (req, res, next) => {

  try {
    // let user_id=req.query.user_id
    // let browser=req.query.browser
  if(req.session && req.session.user_id){
      res.status(200).send(  req.session.last_searched)
  }
  else{
    res.status(200).send(null)
  }
    // let result=await user_utils.getLastSearch(user_id,browser)
    // res.status(200).send(result)
    
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
    let user_id=req.session.user_id
    let result= await user_utils.getMyRecepies(user_id)
    res.status(200).send(result)
  } catch (error) {
    next(error);
  }
});
/**
 * activated when user watched a recipe
 * sends wathed recipes
 */
 router.post("/watch", async (req, res, next) => {
  try {
    let uid=req.session.user_id
    let rid=req.body.rid
    let result= await user_utils.setWatch(uid,rid)
    res.status(200).send('OK')
  } catch (error) {
    next(error);
  }
});
/**
 * activated when user watched a recipe
 * sends wathed recipes
 */
 router.get("/watch", async (req, res, next) => {
  try {
    let uid=req.session.user_id
    let quantity=req.query.quantity
    quantity=quantity?quantity:Number.POSITIVE_INFINITY
    let recipe_ids= (await user_utils.getWatch(uid)).slice(0,quantity)
    let result=await recipe_utils.getSkinnyRecipes(recipe_ids)
    res.status(200).send(result)
  } catch (error) {
    next(error);
  }
});

module.exports = router;
