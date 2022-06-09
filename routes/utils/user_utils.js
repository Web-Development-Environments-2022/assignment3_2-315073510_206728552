const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}','${recipe_id}')`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);

    return recipes_id;
}
async function getLastSearch(user_id,browser){
    let lasts=await DButils.execQuery(`select last_searched from last_searches 
                                where user_id='${user_id}' and browser='${browser}';`)
    return lasts.map(entry=>entry.last_searched)[0];
}
async function getMyRecepies(uid){
    let res=await DButils.execQuery(`select * from Recipes
                                where uid='${uid}' `)
    return res;
}
async function setWatch(uid,rid){
    let res=await DButils.execQuery(`insert into user_watched values ('${uid}','${rid}') `)
    return res;
}
async function getWatch(uid){
    let res=await DButils.execQuery(`select * from user_watched
                                    where uid='${uid}' `)
    return res.map(o=>o.rid);
}
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastSearch=getLastSearch
exports.getMyRecepies=getMyRecepies
exports.setWatch=setWatch
exports.getWatch=getWatch