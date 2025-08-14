export default class SliderController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async loadNextBlock() {
        if (this.model.getIsLoading()) return;

        try {
            this.view.setLoadingState(true);
            const newPosts = await this.model.loadPosts();

            if (newPosts.length > 0) {
                this.view.appendCards(newPosts);
            }
        } catch (error) {
            console.error("Error loading posts:", error);
        } finally {
            this.view.setLoadingState(false);
        }
    }

    setScrollEndEventListener() {
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(async () => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;

                if ((scrollTop + windowHeight >= docHeight - 50) && this.model.canLoadMore()) {
                    await this.loadNextBlock();
                }
            }, 50);
        });
    }

    async init() {
        try {
            const initialPosts = await this.model.loadPosts();
            this.setScrollEndEventListener();
            this.view.appendCards(initialPosts);
        } catch (error) {
            console.error("Error initializing slider:", error);
        }
    }
}