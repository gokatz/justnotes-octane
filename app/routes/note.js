import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class NoteRoute extends Route {

  queryParams = {
    note_id: {
      refreshModel: true
    }
  }

  @service('note') noteStore;
  @service meta;

  activate() {
    this.noteStore.fetchNotes.perform();
  }

  async model(params = {}) {
    let { note_id } = params;
    if (note_id) {
      try {
        let note = await this.noteStore.getNote(note_id);
        if (!note) {
          throw {
            error_msg: `cannot find this note (id = ${note_id}) in the system`
          }
        }
        return note;  
      } catch (error) {
        let { error_msg = 'Error while fetching the selected note' } = error;
        this.meta.showToast.error(error_msg, { autoclear: false });
      }
    }
    return {
      title: '',
      content: ''
    };
  }

  // setupController() {
  //   super.setupController(...arguments);
  //   // Lazily fetch notes;
  //   this.noteStore.initialNoteFetch.perform();
  // }
}
