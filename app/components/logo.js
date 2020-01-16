import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LogoComponent extends Component {
  @action
  handleClick() {
    this.args.onClick && this.args.onClick()
  }
}
