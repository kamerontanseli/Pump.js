# Pump.js

A small OOP JS framework for for multi-page websites. Inspired by [Stimulus](https://stimulusjs.org/).

```html
<div data-controller="slideshow" data-index="1">
  <button data-action="click->slideshow#previous">←</button>
  <button data-action="click->slideshow#next">→</button>

  <div data-target="slideshow.slide" class="slide">🐵</div>
  <div data-target="slideshow.slide" class="slide">🙈</div>
  <div data-target="slideshow.slide" class="slide">🙉</div>
  <div data-target="slideshow.slide" class="slide">🙊</div>
</div>

<script src="/js/pump.js"></script>
```

```javascript
class SlideshowController extends window.pump.Controller {
  targets () {
    return ['slide'];
  }

  connect() {
    super.connect();
    this.showSlide(this.index);
  }
  
  get index () {
    return Number(this.data.get('index'))
  }

  next() {
    this.showSlide(this.index + 1)
  }

  previous() {
    this.showSlide(this.index - 1)
  }

  showSlide(index) {
    this.data.set('index', index);
    for (const [count, slide] of Object.entries(this.slideTargets)) {
        slide.classList.toggle("slide--current", this.index === Number(count));
    }
  }
}

const app = new window.pump.Application('body');
app.register('slideshow', SlideshowController);
app.start();
```