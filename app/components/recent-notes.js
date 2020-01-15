import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RecentNotesComponent extends Component {

  @service('note') noteStore;

  @reads('noteStore.notes')
  notes;

  @tracked searchText;

  @action
  handleNotesSearch() {
    if (!this.notes.length) {
      return;
    }

    this.noteStore.fetchNotes({
      searchQuery: this.searchText
    });
  }
}
