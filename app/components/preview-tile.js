import Component from '@glimmer/component';
import { reads } from '@ember/object/computed';

export default class PreviewTileComponent extends Component {
  @reads('args.note.title')
  title;

  @reads('args.note.content')
  content;

  get lastModifiedTime() {
    return this.args.note.lastModifiedTime;
  }

  @reads('args.note.tags')
  tags;
}
