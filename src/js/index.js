// Global app controller
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import {
    doms,
    renderLoader,
    clearLoader
} from './views/base'


/**
 * Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}


/**
 * Search Controller
 */
const ctrlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput()

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query)
        // 3. Prepare ui
        searchView.clearResults()
        renderLoader(doms.searchResult)

        try {
            // 4. Search recipes
            await state.search.getResults()
            // 5. Render result
            clearLoader()
            searchView.renderResults(state.search.result)
        } catch (error) {
            console.error(error)
            clearLoader()
        }

    }
}

doms.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    ctrlSearch()
})

doms.resultsPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})




/**
 * Recipe Controller
 */
const ctrlRecipe = async () => {
    // get id from the url
    const id = parseInt(window.location.hash.replace('#', ''))

    if (id) {
        // create new recipe object
        state.recipe = new Recipe(id)
        // prepare ui for changes
        recipeView.clearRecipe()
        renderLoader(doms.recipe)
        // highlight active recipe in the list
        if (state.search) {
            searchView.highlightSelected(id)
        }

        try {
            // get recipe data
            await state.recipe.getRecipe()
            // parse ingredients
            state.recipe.parseIngredients()
            // calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServing()
            // render result in the ui
            clearLoader()
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))

        } catch (error) {
            console.error(error)
        }
    }
}


['hashchange', 'load'].forEach(event => {
    window.addEventListener(event, ctrlRecipe)
});



/**
 * Shopping List Controller
 */
const ctrlShoppingList = async () => {
    // clear list
    listView.clearList()
    // create list
    if (!state.list) state.list = new List()
    // add each ingredient to the list
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient)
        // show ingredients in the shopping list
        listView.renderItem(item)
    })

}

// handle shopping list items
doms.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id)
        // delete from ui
        listView.deleteItem(id)
        // handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target, 10)
        if (val > 0) state.list.updateCount(id, val)
    }
})



// handling recipe inputs
doms.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredientsQty(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredientsQty(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        ctrlShoppingList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        ctrlLikes()
    }
})


/**
 * Likes Controller
 */
const ctrlLikes = async () => {
    if (!state.likes) state.likes = new Likes()
    const currentID = state.recipe.id
    // user not yet liked the current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.publisher, state.recipe.img)
        // toggle the like button
        likesView.toggleLikeBtn(true)

        // add like to the ui list
        likesView.renderLike(newLike)

        // user liked the current recipe
    } else {
        // remove like to the state
        state.likes.deleteLike(currentID)
        // toggle the like button
        likesView.toggleLikeBtn(false)
        // remove like to the ui list
        likesView.deleteLike(currentID)
    }

    // toggle like menu btn
    likesView.toggleLikeMenu(state.likes.getNumOfLikes())
}

window.addEventListener('load', () => {
    state.likes = new Likes()
    // restore likes
    state.likes.readStorage()
    // toggle like button
    likesView.toggleLikeMenu(state.likes.getNumOfLikes())
    // render existing lights
    state.likes.likes.forEach(like => likesView.renderLike(like))
})