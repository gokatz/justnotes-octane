import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SearchRoute extends Route {

  @service('note') noteStore;

  setupController() {
    this.noteStore.fetchNotes.perform();
  }

  @action
  goToNote({ id } = {}) {
    this.transitionToRoute('/note', { queryParams: { note_id: id } })
  }
}
