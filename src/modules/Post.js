export default class Post {
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