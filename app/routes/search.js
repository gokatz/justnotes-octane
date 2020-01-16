import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SearchRoute extends Route {

  @service('note') noteStore;

  model(params = {}) {
    let { search_term } = params;
    return this.noteStore.fetchNotes.perform(search_term);
  }
}
