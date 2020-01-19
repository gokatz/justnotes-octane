import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchController extends Controller {
  @service('note') noteStore;

  queryParams = ['search_term', 'page', 'per_page'];
  
  @tracked search_term = '';
  @tracked page = 1;
  @tracked per_page = 30;

  @action
  goToNote({ id } = {}) {
    this.transitionToRoute('note', { queryParams: { note_id: id } })
  }

  @action
  loadMore() {
    this.per_page = this.per_page + 20;
  }
}
