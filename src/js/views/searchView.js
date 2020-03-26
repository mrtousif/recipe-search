import {
    doms
} from './base'


export const getInput = () => {
    return doms.searchInput.value
}

export const clearResults = () => {
    doms.resultsList.innerHTML = ``
    doms.resultsPage.innerHTML = ``
}

export const highlightSelected = (id) => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'))
    resultsArr.forEach(element => {
        element.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
}

export const renderBtn = (page, numOfRes, resultsPerPage = 10) => {
    const pages = Math.ceil(numOfRes / resultsPerPage)
    let btn
    if (page === 1 && pages > 1) {
        //go to next page
        btn = createBtn(page, 'next')
    } else if (page < pages) {
        btn = `
            ${createBtn(page, 'prev')},
            ${createBtn(page, 'next')}
        `
    } else if (page === pages && pages > 1) {
        //go to prev page
        btn = createBtn(page, 'prev')
    }

    doms.resultsPage.insertAdjacentHTML("afterbegin", btn)
}


export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    const start = (page - 1) * resultsPerPage
    const end = page * resultsPerPage
    recipes.slice(start, end).forEach(renderRecipe)

    renderBtn(page, recipes.length, resultsPerPage)
}


const createBtn = (page, type) => {
    return `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
            <span>Page ${type === 'prev' ? page-1 : page+1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `
}


const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length
        }, 0)
        // return the result
        return `${newTitle.join(' ')} ...`
    }
    return title
}


const renderRecipe = (recipe) => {
    let markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `
    doms.resultsList.insertAdjacentHTML("beforeend", markup)
}