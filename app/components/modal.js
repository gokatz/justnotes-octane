import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ModalComponent extends Component {

  @tracked startAnimate;

  constructor() {
    super(...arguments);
    setTimeout(() => {
      this.startAnimate = true;
    }, 0);
  }
}
