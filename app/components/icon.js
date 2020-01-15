import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class IconComponent extends Component {
  get iconClass() {
    let roundedNess = this.args.class.includes('rounded') ? '' : 'rounded-full';
    return `p-2 bg-red-100 shadow cursor-pointer ${this.args.class} ${roundedNess}`;
  }

  @action
  handleClick() {
    this.args.onClick && this.args.onClick();
  }
}
