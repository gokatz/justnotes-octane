import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { setProperties } from '@ember/object';

export default class NoteService extends Service {
  @tracked notes = [];
  @service store;

  OPERATION_DEBOUNCE = 500;

  @task(function*(searchQuery = '', options = {}) {

    yield timeout(this.OPERATION_DEBOUNCE);

    // Param construction
    options.page = options.page || 1;
    options.per_page = options.per_page || 30;
    let params = options;
    searchQuery = searchQuery.trim()
    if (searchQuery) {
      params.search_text = searchQuery;
    }
    
    // Actual API Call
    let { data } = yield this.store.makeRequest('/note', {
      params
    });
    this.notes = data;
  
  }).restartable()
  fetchNotes;

  async getNote(noteId) {
    if (this.fetchNotes.isRunning || !this.fetchNotes.lastSuccessful) {
      let { data } = await this.store.makeRequest(`/note/${noteId}`); 
      return data;
    }
    return this.notes.find(({ id }) => id == noteId);
  }

  @action 
  updateNotesList(noteData = {}, { operation = 'update' } = {}) {
    // Removing an existing note
    if (operation === 'delete') {
      this.notes = this.notes.filter(({ id } = {}) => id != noteData.id);
      return;
    }

    // Updating existing Note
    let noteToBeUpdated = (this.notes || []).find(
      ({ id }) => id === noteData.id
    );

    if (noteToBeUpdated) {
      setProperties(noteToBeUpdated, noteData);
      this.notes = this.notes;
      return;
    }

    // Adding new Note
    this.notes.unshift(noteData);
  }
}
