import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SearchController extends Controller {
  @service('note') noteStore;

  @action
  goToNote({ id } = {}) {
    this.transitionToRoute('note', { queryParams: { note_id: id } })
  }
}
