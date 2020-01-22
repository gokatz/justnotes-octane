import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SearchRoute extends Route {

  @service('note') noteStore;

  queryParams = {
    per_page: {
      refreshModel: true
    }
  }

  async model(params = {}) {
    let { search_term, page = 1, per_page = 30 } = params;

    try {
      await this.noteStore.fetchNotes.perform(search_term, {
        page, per_page
      });
      return {
        page,
        per_page
      }
    } catch (error) {
      let { error_msg = 'Error while fetching your notes. Please try again after sometime' } = error;
      this.meta.showToast.error(error_msg);
    }
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);
    
    if (isExiting) {
      controller.search_term = ''
    }
  }
}
