import Component from '@glimmer/component';
import { getTags } from '../utils';

export default class TagsComponent extends Component {

  get tags() {
    return getTags(this.args.content);
  }

}

