import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ArchiveController extends Controller {

  @tracked notes;
  @tracked hasMorePages;
  @tracked page = 1;
  @tracked selectedArchive;

  @service store;
  @service meta;
  @service router;
  @service('note') noteService;

  async setInitialNotes() {
    let { notes, has_more_pages } = await this.fetchArchives.perform() || {};
    this.notes = notes;
    this.hasMorePages = has_more_pages;
  }

  @task(function* () {
    let params = {
      page: this.page,
      per_page: 30
    }
    let { data } = yield this.store.makeRequest('/archive', {
      params
    });
    return data;
  })
  fetchArchives;

  @action
  async loadMore() {
    this.page++;
    let { notes } = await this.fetchArchives.perform();
    this.notes = this.notes.concat(notes);
  }

  @action 
  showPreview(note) {
    this.selectedArchive = note;
  }

  @action 
  closePreview() {
    this.selectedArchive = null;
  }

  @action
  async deleteArchive(note = {}) {

    let { id } = note;

    if (!id) {
      return;
    }
    await this.meta.showConfirm({
      message: 'Sure want to delete? You cannot retrieve this note ever if you proceed',
      primaryBtnLabel: 'Sure. Proceed'
    });

    await this.deleteArchiveTask.perform(id);
    this.meta.showToast('Note deleted permanently');
  }

  @task(function* (id) {
    try {
      yield this.store.makeRequest(`/archive/${id}`, { method: 'delete' });
      this.selectedArchive = null;
      this.page = 1;
      this.setInitialNotes();
    } catch (error) {
      let { error_msg = 'Error while deleteing this note from archive. Try after sometime.' } = error;
      this.meta.showToast.error(error_msg);
    }
  })
  deleteArchiveTask;

  @action
  async putBack(note = {}) {

    let { id } = note;

    if (!id) {
      return;
    }
    await this.meta.showConfirm({
      message: 'Sure want to retrieve this note?',
      primaryBtnLabel: 'Sure. Proceed'
    });

    await this.retrieveTask.perform(id);

    try {
      await this.meta.showConfirm({
        message: 'Retrieved the note successfully. Do you want to view that note?',
        primaryBtnLabel: 'Yes, Show me'
      });
      // in order to populate the recently retrieved note onto client cache
      this.noteService.fetchNotes.perform();
      this.transitionToRoute('note', { queryParams: { note_id: id } });

    } catch (error) {
      this.meta.showToast('Retrieved the note successfully');
    }

  }

  @task(function* (id) {
    try {
      yield this.store.makeRequest(`/retrieve/${id}`, { method: 'put' });
      this.selectedArchive = null;
      this.page = 1;
      this.setInitialNotes();
    } catch (error) {
      let { error_msg = 'Error while retrieve this note. Try after sometime.' } = error;
      this.meta.showToast.error(error_msg);
    }
  })
  retrieveTask;
}
