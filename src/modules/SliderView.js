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

    getCardWidth() {
        const GAP_SIZE = parseFloat(getComputedStyle(this.elements.postsSlider).gap) || 0;
        const cardRect = document.querySelector('.posts__card')?.getBoundingClientRect();
        return cardRect ? cardRect.width + GAP_SIZE : 0;
    }

    updateSliderPosition(offset) {
        this.elements.postsSlider.style.transform = `translateX(${-offset}px)`;
    }

    setButtonState(button, disabled) {
        button.disabled = disabled;
    }

    setEventListeners(onNext, onPrev, onResize) {
        this.elements.buttonNext.addEventListener('click', onNext);
        this.elements.buttonPrev.addEventListener('click', onPrev);
        window.addEventListener('resize', onResize);
    }
}