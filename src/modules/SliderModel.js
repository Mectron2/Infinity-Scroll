import ApiModel from "./ApiModel.js";
import Post from "./Post.js";

export default class SliderModel {
    constructor(postsLimit, maxPosts, dataUrl) {
        this.totalAppended = 0;
        this.postsLimit = postsLimit;
        this.maxPosts = maxPosts;
        this.dataUrl = dataUrl;
        this.isLoading = false;
    }

    async loadPosts(limit = this.postsLimit) {
        if (this.isLoading || this.totalAppended >= this.maxPosts) {
            return [];
        }

        this.isLoading = true;
        try {
            const rawPosts = await ApiModel.fetchPosts(this.dataUrl, limit, this.totalAppended);
            const posts = rawPosts.map(postData => Post.fromJson(postData));

            this.totalAppended += posts.length;

            return posts;
        } finally {
            this.isLoading = false;
        }
    }

    getIsLoading() {
        return this.isLoading;
    }

    canLoadMore() {
        return this.totalAppended < this.maxPosts;
    }
}