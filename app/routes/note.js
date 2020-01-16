import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class NoteRoute extends Route {

  queryParams = {
    note_id: {
      refreshModel: true
    }
  }

  @service('note') noteStore;

  async model(params = {}) {
    let { note_id } = params;
    if (note_id) {
      let note = await this.noteStore.getNote(note_id);
      return note;
    }
    return {
      title: '',
      content: ''
    };
  }

  setupController() {
    super.setupController(...arguments);
    // super(...arguments);
    // Lazily fetch notes;
    this.noteStore.fetchNotes.perform();
  }
}
