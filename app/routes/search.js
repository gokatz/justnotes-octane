import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SearchRoute extends Route {

  @service('note') noteStore;

  setupController() {
    this.noteStore.fetchNotes.perform();
  }
}
