import { doms } from "./base";

export const toggleLikeBtn = isliked => {
  const iconString = isliked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `./img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numOfLikes => {
  doms.likesField.style.visibility = numOfLikes > 0 ? "visible" : "hidden";
};

export const renderLike = likedItem => {
  const markup = `
        <li>
            <a class="likes__link" href="#${likedItem.id}">
                <figure class="likes__fig">
                    <img src="${likedItem.img}" alt="${likedItem.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${likedItem.title}</h4>
                    <p class="likes__author">${likedItem.publisher}</p>
                </div>
            </a>
        </li>
    `;
  doms.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = id => {
  const element = document.querySelector(`.likes__link[href*="#${id}"]`)
    .parentElement;
  if (element) {
    element.parentElement.removeChild(element);
  }
};
