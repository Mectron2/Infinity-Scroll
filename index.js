const DATA_URL = "https://jsonplaceholder.typicode.com/posts";
const buttonNext = document.querySelector('.button_next');
const buttonPrev = document.querySelector('.button_prev');
const postsSlider = document.querySelector('.posts__slider');

async function fetchData(dataUrl, limit = 100, start = 0) {
    const data = await fetch(`${dataUrl}?_limit=${limit}&_start=${start}`);
    return await data.json();
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

async function fetchCards(url, limit = 100, start = 0) {
    const posts = await fetchData(url, limit, start);

    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        fragment.appendChild(new PostCard(post.userId, post.id, post.title, post.body).element);
    }
    document.querySelector('.posts__slider').appendChild(fragment);
    return posts;
}

let totalFetched = 0;
let current;

fetchCards(DATA_URL, 10, 0).then(
    (posts) => {totalFetched = posts.length; current = totalFetched / 2;}
);

let offset = 0;

async function getCardWidth() {
    const GAP_SIZE = parseFloat(getComputedStyle(postsSlider).gap) || 0;
    const cardRect = document.querySelector('.posts__card').getBoundingClientRect();
    return cardRect.width + GAP_SIZE;
}

let isLoading = false;

buttonNext.addEventListener('click', async () => {
    if (isLoading) return;

    const cardWidth = await getCardWidth();

    if (offset < cardWidth * 95) {
        offset += cardWidth;
        current++;
        postsSlider.style.transform = `translateX(${-offset}px)`;
    }

    if (current >= totalFetched - 2 && totalFetched < 100) {
        isLoading = true;
        buttonNext.disabled = true;

        const fetchedBlock = await fetchCards(DATA_URL, 10, totalFetched);
        totalFetched += fetchedBlock.length;

        isLoading = false;
        buttonNext.disabled = false;
    }
});

buttonPrev.addEventListener('click', () => {
    const cardWidth = getCardWidth();

    offset = Math.max(0, offset - cardWidth);
    current = Math.max(0, current - 1);
    postsSlider.style.transform = `translateX(${-offset}px)`;
});
