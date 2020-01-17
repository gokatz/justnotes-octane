import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

const DEBOUNCE_TIMEOUT = 500;

export default class RecentNotesComponent extends Component {

  @service('note') noteStore;

  @reads('noteStore.notes')
  notes;

  @tracked searchText;

  @task(function* () {
    yield timeout(DEBOUNCE_TIMEOUT);

    yield this.noteStore.fetchNotes.perform(this.searchText);
  }).restartable()
  handleNotesSearch;
}
