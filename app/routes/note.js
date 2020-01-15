import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class NoteRoute extends Route {

  @service note;

  setupController() {
    // super(...arguments);
    // Lazily fetch notes;
    this.note.fetchNotes.perform();
  }
}
