import Component from '@glimmer/component';
import { reads } from '@ember/object/computed';

export default class PreviewTileComponent extends Component {
  @reads('args.note.title')
  title;

  @reads('args.note.content')
  content;

  @reads('args.note.last_updated_time_formatted')
  last_updated_time_formatted;

  @reads('args.note.tags')
  tags;
}
