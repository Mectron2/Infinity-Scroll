const DATA_URL = "https://jsonplaceholder.typicode.com/posts";
const MAX_POSTS = 100;
const VISIBLE_POSTS = 5;
const POSTS_LIMIT = 10;

sliderElements = {
    buttonNext: document.querySelector('.button_next'),
    buttonPrev: document.querySelector('.button_prev'),
    postsSlider: document.querySelector('.posts__slider'),
}

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

class PostCard {
    constructor(post) {
        this.element = this.create(post.userId, post.id, post.title, post.content);
    }

    create(userId, id, title, content) {
        const containerElement = document.createElement('article');
        containerElement.classList.add("posts__card");

        const userElement = document.createElement('p');
        userElement.classList.add("posts__card-user");
        userElement.textContent = `User id: ${userId}`;
        containerElement.appendChild(userElement);

        const idElement = document.createElement('p');
        idElement.classList.add('posts__card-post-id');
        idElement.textContent = `Post id: ${id}`;
        containerElement.appendChild(idElement);

        const titleElement = document.createElement('h3');
        titleElement.classList.add("posts__card-title");
        titleElement.textContent = title;
        containerElement.appendChild(titleElement);

        const contentElement = document.createElement('p');
        contentElement.classList.add('posts__card-content');
        contentElement.textContent = content;
        containerElement.appendChild(contentElement);

        return containerElement;
    }
}

class SliderController {
    constructor(sliderElements) {
        this.sliderElements = sliderElements;
        this.totalAppended = 0;
        this.current = VISIBLE_POSTS;
        this.isLoading = false;
        this.offset = 0;
    }

    async createAndAppendCards(posts) {
        const fragment = document.createDocumentFragment();
        for (const post of posts) {
            fragment.appendChild(new PostCard(Post.fromJson(post)).element);
        }
        this.sliderElements.postsSlider.appendChild(fragment);
    }

    getCardWidth() {
        const GAP_SIZE = parseFloat(getComputedStyle(this.sliderElements.postsSlider).gap) || 0;
        const cardRect = document.querySelector('.posts__card').getBoundingClientRect();
        return cardRect.width + GAP_SIZE;
    }

    async handleNext(maxPostsLength) {
        if (this.isLoading) return;

        const cardWidth = this.getCardWidth();

        if (this.offset < cardWidth * (maxPostsLength - VISIBLE_POSTS)) {
            this.offset += cardWidth;
            this.current++;
            this.sliderElements.postsSlider.style.transform = `translateX(${-(this.offset)}px)`;
        }

        if (this.current >= this.totalAppended - 2 && this.totalAppended < 100) {
            this.isLoading = true;
            this.sliderElements.buttonNext.disabled = true;

            const posts = await ApiModel.fetchPosts(DATA_URL, POSTS_LIMIT, this.totalAppended);
            await this.createAndAppendCards(posts);
            this.totalAppended += posts.length;

            this.isLoading = false;
            this.sliderElements.buttonNext.disabled = false;
        }
    }

    async handlePrev() {
        const cardWidth = this.getCardWidth();

        this.offset = Math.max(0, this.offset - cardWidth);
        this.current = Math.max(0, this.current - 1);
        this.sliderElements.postsSlider.style.transform = `translateX(${-(this.offset)}px)`;
    }

    async handleResize() {
        this.offset = 0;
        this.current = VISIBLE_POSTS;
        this.sliderElements.postsSlider.style.transform = `translateX(${-(this.offset)}px)`;
    }

    async init() {
        const posts = await ApiModel.fetchPosts(DATA_URL, POSTS_LIMIT, this.totalAppended);
        await this.createAndAppendCards(posts);
        this.totalAppended = posts.length;
        this.current = VISIBLE_POSTS;

        this.sliderElements.buttonNext.addEventListener('click', () => this.handleNext(MAX_POSTS));
        this.sliderElements.buttonPrev.addEventListener('click', () => this.handlePrev());
        window.addEventListener('resize', () => this.handleResize());
    }

}

const sliderController = new SliderController(sliderElements);
sliderController.init().catch(error => {
    console.error("Error initializing slider:", error);
});