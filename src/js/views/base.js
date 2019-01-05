export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchResults: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parentElement => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        <svg>
    </div>
    `;
    parentElement.insertAdjacentHTML('afterBegin',loader)
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`)
    if (loader) loader.parentElement.removeChild(loader);

}