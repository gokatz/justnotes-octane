import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default class DsToastComponent extends Component {
  @service
  meta;

  @reads('meta.toastOptions.type')
  type;

  @reads('meta.toastMsg')
  toastMsg;

  @reads('meta.toastOptions.autoclear')
  autoclear;

  get emoji() {
    let emojiList = this.type === 'error' ? ['😞', '😿'] : ['😎', '👉', '💡'] ;
    return emojiList[Math.floor(Math.random() * emojiList.length)];
  }
}
