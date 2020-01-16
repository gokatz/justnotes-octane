import Component from '@glimmer/component';
import { reads } from '@ember/object/computed';
import { getTags } from '../utils';

export default class PreviewTileComponent extends Component {
  @reads('args.note.title')
  title;

  @reads('args.note.content')
  content;

  get lastModifiedTime() {
    return new Date(this.args.note.lastModifiedTime).toDateString();
  }

  // @reads('args.note.tags')
  // tags;

  get tags() {
    return getTags(this.content); 
  }
}
