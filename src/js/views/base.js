export const doms = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResult: document.querySelector('.results__list'),
    resultsList: document.querySelector('.results__list'),
    resultsPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesField: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

export const renderLoader = (parent) => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `
    parent.insertAdjacentHTML('afterbegin', loader)
}

export const clearLoader = () => {
    const loader = document.querySelector('.loader')
    if (loader) {
        loader.parentElement.removeChild(loader)
    }
}