import SliderView from "./SliderView.js";
import SliderModel from './SliderModel.js';
import SliderController from './SliderController.js';

const DATA_URL = "https://jsonplaceholder.typicode.com/posts";
const MAX_POSTS = 100;
const POSTS_LIMIT = 10;

const sliderElements = {
    buttonNext: document.querySelector('.button_next'),
    buttonPrev: document.querySelector('.button_prev'),
    postsSlider: document.querySelector('.posts__slider'),
};

const sliderModel = new SliderModel(POSTS_LIMIT, MAX_POSTS, DATA_URL);
const sliderView = new SliderView(sliderElements);
const sliderController = new SliderController(sliderModel, sliderView);
sliderController.init().finally(() => console.debug("Slider initialized successfully."));