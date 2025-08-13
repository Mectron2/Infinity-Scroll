export default class SliderController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
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