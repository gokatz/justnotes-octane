import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchController extends Controller {
  @service('note') noteStore;

  queryParams = ['search_term']
  
  @tracked search_term = ''

  @action
  goToNote({ id } = {}) {
    this.transitionToRoute('note', { queryParams: { note_id: id } })
  }
}
