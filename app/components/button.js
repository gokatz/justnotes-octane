import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

let sizeClass = {
  'sm': 'p-1 text-sm'
}

let typeClass = {
  'secondary': 'text-blue-500',
  'danger': 'bg-red-400 text-white'
}

export default class ButtonComponent extends Component {

  get loading() {
    return this.args.loading || this._loading;
  }

  // get _size() {
  //   return this.args.size || ''
  // }

  @tracked 
  _loading;

  get sizeClass() {
    return sizeClass[this.args.size] || 'p-2';
  }

  get typeClass() {
    return typeClass[this.args.type] || 'bg-teal-300 text-black';
  }

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
