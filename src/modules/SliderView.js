import PostCard from "./PostCard.js";

export default class SliderView {
    constructor(sliderElements) {
        this.elements = sliderElements;
    }

    appendCards(posts) {
        const fragment = document.createDocumentFragment();
        for (const post of posts) {
            fragment.appendChild(new PostCard(post).element);
        }
        this.elements.postsSlider.appendChild(fragment);
    }

    setLoadingState(isLoading) {
        let loader = this.elements.postsSlider.querySelector('.loader');

        if (isLoading) {
            if (!loader) {
                loader = document.createElement('div');
                loader.className = 'loader';
                loader.textContent = 'Loading...';
                this.elements.postsSlider.appendChild(loader);
            }
        } else {
            loader?.remove();
        }
    }
}