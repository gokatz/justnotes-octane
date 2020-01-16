import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { setProperties } from '@ember/object';

export default class NoteService extends Service {
  @tracked notes = [];
  @service store;

  @task(function*(searchQuery = '') {
    let params = {}
    if (searchQuery) {
      params.search_text = searchQuery;
    }
    let recentNotes = yield this.getNotes(params);
    this.notes = recentNotes;
  }).restartable()
  fetchNotes;

  async getNotes(params = {}) {
    params.per_page = 30;
    params.page = 1;
    let { data } = await this.store.makeRequest('/note', {
      params
    });
    return data;
  }

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
