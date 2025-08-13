const DATA_URL = "https://jsonplaceholder.typicode.com/posts";
const MAX_POSTS = 100;
const VISIBLE_POSTS = 5;
const POSTS_LIMIT = 10;

class ApiModel {
    static async fetchPosts(url, limit = 10, start = 0) {
        const res = await fetch(`${url}?_limit=${limit}&_start=${start}`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        return res.json();
    }
}

class Post {
    constructor(userId, id, title, content) {
        this.userId = userId;
        this.id = id;
        this.title = title;
        this.content = content;
    }

    static fromJson(json) {
        return new Post(json.userId, json.id, json.title, json.body);
    }
}

class SliderModel {
    constructor() {
        this.posts = [];
        this.totalAppended = 0;
        this.currentIndex = VISIBLE_POSTS;
        this.offset = 0;
        this.isLoading = false;
    }

    async loadPosts(limit = POSTS_LIMIT) {
        if (this.isLoading || this.totalAppended >= MAX_POSTS) {
            return [];
        }

        this.isLoading = true;
        try {
            const rawPosts = await ApiModel.fetchPosts(DATA_URL, limit, this.totalAppended);
            const posts = rawPosts.map(postData => Post.fromJson(postData));

            this.posts.push(...posts);
            this.totalAppended += posts.length;

            return posts;
        } finally {
            this.isLoading = false;
        }
    }

    canMoveNext(cardWidth) {
        return this.offset < cardWidth * (this.posts.length - VISIBLE_POSTS);
    }

    canMovePrev() {
        return this.offset > 0;
    }

    shouldLoadMore() {
        return this.currentIndex >= this.totalAppended - 2 &&
            this.totalAppended < MAX_POSTS &&
            !this.isLoading;
    }

    moveNext(cardWidth) {
        if (this.canMoveNext(cardWidth)) {
            this.offset += cardWidth;
            this.currentIndex++;
            return true;
        }
        return false;
    }

    movePrev(cardWidth) {
        if (this.canMovePrev()) {
            this.offset = Math.max(0, this.offset - cardWidth);
            this.currentIndex = Math.max(VISIBLE_POSTS, this.currentIndex - 1);
            return true;
        }
        return false;
    }

    resetPosition() {
        this.offset = 0;
        this.currentIndex = VISIBLE_POSTS;
    }

    getOffset() {
        return this.offset;
    }

    getIsLoading() {
        return this.isLoading;
    }
}

class PostCard {
    constructor(post) {
        this.element = this.create(post.userId, post.id, post.title, post.content);
    }

    create(userId, id, title, content) {
        const containerElement = document.createElement('article');
        containerElement.classList.add("posts__card");

        const titleElement = document.createElement('h3');
        titleElement.classList.add("posts__card-title");
        titleElement.textContent = title;
        containerElement.appendChild(titleElement);

        const contentElement = document.createElement('p');
        contentElement.classList.add('posts__card-content');
        contentElement.textContent = content;
        containerElement.appendChild(contentElement);

        const userElement = document.createElement('p');
        userElement.classList.add("posts__card-user");
        userElement.textContent = `User id: ${userId}`;
        containerElement.appendChild(userElement);

        const idElement = document.createElement('p');
        idElement.classList.add('posts__card-post-id');
        idElement.textContent = `Post id: ${id}`;
        containerElement.appendChild(idElement);

        return containerElement;
    }
}

class SliderView {
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

class SliderController {
    constructor(sliderElements) {
        this.model = new SliderModel();
        this.view = new SliderView(sliderElements);
    }

    async handleNext() {
        if (this.model.getIsLoading()) return;

        const cardWidth = this.view.getCardWidth();

        const moved = this.model.moveNext(cardWidth);
        if (moved) {
            this.view.updateSliderPosition(this.model.getOffset());
        }

        if (this.model.shouldLoadMore()) {
            this.view.setButtonState(this.view.elements.buttonNext, true);

            try {
                const newPosts = await this.model.loadPosts();
                if (newPosts.length > 0) {
                    this.view.appendCards(newPosts);
                }
            } catch (error) {
                console.error("Error loading posts:", error);
            } finally {
                this.view.setButtonState(this.view.elements.buttonNext, false);
            }
        }
    }

    handlePrev() {
        const cardWidth = this.view.getCardWidth();

        const moved = this.model.movePrev(cardWidth);
        if (moved) {
            this.view.updateSliderPosition(this.model.getOffset());
        }
    }

    handleResize() {
        this.model.resetPosition();
        this.view.updateSliderPosition(this.model.getOffset());
    }

    async init() {
        try {
            const initialPosts = await this.model.loadPosts();
            this.view.appendCards(initialPosts);

            this.view.setEventListeners(
                () => this.handleNext(),
                () => this.handlePrev(),
                () => this.handleResize()
            );

        } catch (error) {
            console.error("Error initializing slider:", error);
        }
    }
}

const sliderElements = {
    buttonNext: document.querySelector('.button_next'),
    buttonPrev: document.querySelector('.button_prev'),
    postsSlider: document.querySelector('.posts__slider'),
};

const sliderController = new SliderController(sliderElements);
sliderController.init().finally(() => console.debug("Slider initialized successfully."));