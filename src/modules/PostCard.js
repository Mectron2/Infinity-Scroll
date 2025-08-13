export default class PostCard {
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

        const infoElement = document.createElement('div');
        infoElement.classList.add('posts__card-info');
        containerElement.appendChild(infoElement);

        const userElement = document.createElement('p');
        userElement.classList.add("posts__card-user");
        userElement.textContent = `User id: ${userId}`;
        infoElement.appendChild(userElement);

        const idElement = document.createElement('p');
        idElement.classList.add('posts__card-post-id');
        idElement.textContent = `Post id: ${id}`;
        infoElement.appendChild(idElement);

        return containerElement;
    }
}