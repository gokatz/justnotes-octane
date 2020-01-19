import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SearchRoute extends Route {

  @service('note') noteStore;

  queryParams = {
    page: {
      refreshModel: true
    },
    per_page: {
      refreshModel: true
    }
  }

  model(params = {}) {
    let { search_term, page = 1, per_page = 30 } = params;
    return this.noteStore.fetchNotes.perform(search_term, {
      page, per_page
    });
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);

    if (isExiting) {
      controller.search_term = ''
    }
  }
}
