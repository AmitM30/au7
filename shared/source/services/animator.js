
import { inject }               from 'aurelia-framework';
import { CssAnimator }          from 'aurelia-animator-css';

@inject(CssAnimator, Element)
export class Animator {

    constructor (animator, element) {
        this.animator = animator;
        this.element = element;
    }

    animateBackground() {
        var list = this.element.querySelector('.aurelia-animators');
        this.animator.animate(list, 'background-animation');
    }
}
