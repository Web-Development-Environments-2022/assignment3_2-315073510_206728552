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
    let res;
    try{
    res=await DButils.execQuery(`select * from Recipes
                                where uid='${uid}' `)
    }
    catch (e){
        console.log(e.message)
    }
    return res;
}
async function setWatch(uid,rid){
    let current_rids=await getWatch(uid)
    if(current_rids.includes(rid)){
        await DButils.execQuery(`delete from user_watched where uid='${uid}' and rid='${rid}'`)
    } 
    res=await DButils.execQuery(`insert into user_watched values ('${uid}','${rid}','${Date.now()}') `)
    console.log(await DButils.execQuery(`select * from user_watched
    where uid='${uid}' `))
    return 'OK';
}
async function getWatch(uid){
    let res=await DButils.execQuery(`select * from user_watched
                                    where uid='${uid}' `)
    res=res.sort((a,b)=>{ return (+(a.date))-(+(b.date));}).reverse()
    return res.map(o=>o.rid);
}
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastSearch=getLastSearch
exports.getMyRecepies=getMyRecepies
exports.setWatch=setWatch
exports.getWatch=getWatch