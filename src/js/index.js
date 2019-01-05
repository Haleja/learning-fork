// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
const state = {};


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

const controlSearch = async () => {
    const query = searchView.getInput();
    console.log(query)
    if (query) {
        state.search = new Search(query);
        //prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);
        //search for recipes
        try {
        await state.search.getResults();
        // render results
        console.log(state.search.recipes)
        searchView.renderResults(state.search.recipes)
        clearLoader();
        }catch (error){
            alert(error)
            clearLoader();
        }
    }
}

elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage)
    }
})


//const search = new Search('pizza');
//search.getResults();


//RECIPE CONTROLLER

//const r = new Recipe(47746);
//r.getRecipe();
//console.log(r);

const controlRecipe = async () =>{
    const id = window.location.hash.replace('#','');

    if (id) {
        
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if (state.search) searchView.highlightSelected(id);



        state.recipe = new Recipe(id);

        try {
        await state.recipe.getRecipe();

        state.recipe.calcTime();
        state.recipe.calcServings();
            state.recipe.parseIngredients();

            //renderRec
            clearLoader();
            console.log(state)
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        }catch(error){
            alert(error)
        }
    }
}





const controlList = () => {
    //create new list if non exist
    if (!state.list) state.list = new List();

    // add each ingredient to list

    state.recipe.ingredients.forEach(el =>{
       const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    })

    //handle delete and update events

    elements.shopping.addEventListener('click', e =>{
        const id = e.target.closest('.shopping__item').dataset.itemid;
        //handle Delete
        if(e.target.matches('.shopping__delete, .shopping__delete *')){
            //DELETE FROM UI AND ALSO STATE OBJ!!!!!
            listView.deleteItem(id);
            state.list.deleteItem(id);

            //handle count update
        }else if (e.target.matches('.shopping__count-value')) {
            const val = parseFloat(e.target.value,10);
            state.list.updateCount(id,val);
        }
    })
}


const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //if current recipe is not liked
    if(!state.likes.isLiked(currentID)){
        //add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );  
        //toggle like button
            likesView.toggleLikeBtn(true);
        //add like to UI
            likesView.renderLike(newLike);
    //if current recipe IS liked
    } else {
        // remove like from state
        state.likes.deleteLike(currentID);
        //toggle like button
        likesView.toggleLikeBtn(false);
        //remove like from UI
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes())
}











//window.addEventListener('hashchange',controlRecipe)
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings > 1){
             state.recipe.updateServings('dec');
             recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //call like controller
        controlLike();
    }



})

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like))
    console.log("likesloaded")
    console.log(state)
})