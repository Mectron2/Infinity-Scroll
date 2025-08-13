const DATA_URL = "https://jsonplaceholder.typicode.com/posts";
const MAX_POSTS = 100;
const VISIBLE_POSTS = 5;
const POSTS_LIMIT = 10;

const buttonNext = document.querySelector('.button_next');
const buttonPrev = document.querySelector('.button_prev');
const postsSlider = document.querySelector('.posts__slider');

class ApiModel {
    static async fetchPosts(url, limit = 10, start = 0) {
        const res = await fetch(`${url}?_limit=${limit}&_start=${start}`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        return res.json();
    }
}

class PostCard {
    constructor(userId, id, title, content) {
        this.element = this.create(userId, id, title, content);
    }

    create(userId, id, title, content) {
        const containerElement = document.createElement('article');
        containerElement.classList.add("posts__card");

        const userElement = document.createElement('p');
        userElement.classList.add("posts__card-user");
        userElement.textContent = userId;
        containerElement.appendChild(userElement);

        const idElement = document.createElement('p');
        idElement.classList.add('posts__card-post-id');
        idElement.textContent = id;
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

async function createAndAppendCards(posts) {
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        fragment.appendChild(new PostCard(post.userId, post.id, post.title, post.body).element);
    }
    postsSlider.appendChild(fragment);
}

async function getCardWidth() {
    const GAP_SIZE = parseFloat(getComputedStyle(postsSlider).gap) || 0;
    const cardRect = document.querySelector('.posts__card').getBoundingClientRect();
    return cardRect.width + GAP_SIZE;
}

let totalAppended = 0;
let current;
let isLoading = false;
let offset = 0;

async function handleNext(maxPostsLength) {
    if (isLoading) return;

    const cardWidth = await getCardWidth();

    if (offset < cardWidth * (maxPostsLength - VISIBLE_POSTS)) {
        offset += cardWidth;
        current++;
        postsSlider.style.transform = `translateX(${-offset}px)`;
    }

    if (current >= totalAppended - 2 && totalAppended < 100) {
        isLoading = true;
        buttonNext.disabled = true;

        const posts = await ApiModel.fetchPosts(DATA_URL, POSTS_LIMIT, totalAppended);
        await createAndAppendCards(posts);
        totalAppended += posts.length;

        isLoading = false;
        buttonNext.disabled = false;
    }
}

async function handlePrev() {
    const cardWidth = await getCardWidth();

    offset = Math.max(0, offset - cardWidth);
    current = Math.max(0, current - 1);
    postsSlider.style.transform = `translateX(${-offset}px)`;
}

async function handleResize() {
    offset = 0;
    current = VISIBLE_POSTS;
    postsSlider.style.transform = `translateX(${-offset}px)`;
}

async function init() {
    const posts = await ApiModel.fetchPosts(DATA_URL, POSTS_LIMIT, totalAppended);
    await createAndAppendCards(posts);
    totalAppended = posts.length; current = VISIBLE_POSTS;

    buttonNext.addEventListener('click', () => handleNext(MAX_POSTS));
    buttonPrev.addEventListener('click', handlePrev);
    window.addEventListener('resize', handleResize);
}

init().catch(console.error);