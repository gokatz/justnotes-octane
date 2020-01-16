import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ButtonComponent extends Component {

  get loading() {
    return this.args.loading || this._loading;
  }

  @tracked 
  _loading;

  async handleClick() {
    if (!this.args.onClick || this._loading) {
      return;
    }
    let onClickMethod = this.args.onClick();
    let isPromise = onClickMethod instanceof Promise;

    if (isPromise) {
      this._loading = true;
      onClickMethod.finally(() => this._loading = false);
    }
  }
}
