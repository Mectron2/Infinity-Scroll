import ApiModel from "./ApiModel.js";
import Post from "./Post.js";

export default class SliderModel {
    constructor(visiblePosts, postsLimit, maxPosts, dataUrl, fetchThreshold) {
        this.posts = [];
        this.totalAppended = 0;
        this.postsLimit = postsLimit;
        this.maxPosts = maxPosts;
        this.dataUrl = dataUrl;
        this.visiblePosts = visiblePosts;
        this.currentIndex = this.visiblePosts;
        this.offset = 0;
        this.isLoading = false;
        this.fetchThreshold = fetchThreshold;
    }

    async loadPosts(limit = this.postsLimit) {
        if (this.isLoading || this.totalAppended >= this.maxPosts) {
            return [];
        }

        this.isLoading = true;
        try {
            const rawPosts = await ApiModel.fetchPosts(this.dataUrl, limit, this.totalAppended);
            const posts = rawPosts.map(postData => Post.fromJson(postData));

            this.posts.push(...posts);
            this.totalAppended += posts.length;

            return posts;
        } finally {
            this.isLoading = false;
        }
    }

    canMoveNext(cardWidth) {
        return this.offset < cardWidth * (this.posts.length - this.visiblePosts);
    }

    canMovePrev() {
        return this.offset > 0;
    }

    shouldLoadMore() {
        return this.currentIndex >= this.totalAppended - this.fetchThreshold &&
            this.totalAppended < this.maxPosts &&
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
            this.currentIndex = Math.max(this.visiblePosts, this.currentIndex - 1);
            return true;
        }
        return false;
    }

    resetPosition() {
        this.offset = 0;
        this.currentIndex = this.visiblePosts;
    }

    getOffset() {
        return this.offset;
    }

    getIsLoading() {
        return this.isLoading;
    }
}