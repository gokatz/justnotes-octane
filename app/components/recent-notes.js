import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';

export default class RecentNotesComponent extends Component {

  @service('note') noteStore;

  @reads('noteStore.notes')
  notes;

  @tracked searchText;
}
