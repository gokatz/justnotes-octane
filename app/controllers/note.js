import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task, didCancel, timeout } from 'ember-concurrency';
import { reads } from '@ember/object/computed';
import { action } from '@ember/object';

export default class NoteController extends Controller {

  @service meta;
  @service store;
  @service('note') noteStore;

  @reads('noteStore.notes')
  notes;

  queryParams = ['note_id'];

  @tracked note_id = '';
  @tracked canShowSlider = false;
  @tracked lastSavedNote = {};

  @action
  async saveCurrentNote({ allowNoteRemoval = false } = {}) {
    // TODO: UpdateLocalState - Use any libraries like OrbitJS
    let { title, content } = this.model;
    let { note_id } = this;
    let params = {
      title,
      content
    };

    let isNewNote = this.isNewNote;

    let isNoteRemoval =  !title && !content;

    if (isNoteRemoval && !allowNoteRemoval) {      
      this.handleNoteContentRemoval({ allowNoteRemoval: false });
      return;
    }

    // check if the content has been updated
    let {
      title: savedTitle,
      content: savedContent
    } = this.lastSavedNote;
    if (title === savedTitle && content === savedContent) {
      return;
    }

    let savedNote;
    try {
      if (isNewNote) {
        savedNote = await this.createNoteTask.perform(params);
        // Need to update the id to new one if this is a new note
        let { id } = savedNote || {};
        this.note_id = id;
        params.content = this.model.content;
        params.title = this.model.title;
      } else {
        savedNote = await this.updateNoteTask.perform(note_id, params);
        this.lastSavedNote = savedNote;
      }


      // TODO: need to get saved data from server @varun
      Object.assign(savedNote, params);
      // Update the notes list
      // We will not wait for the response as it be handled in the background
      this.noteStore.updateNotesList(savedNote, { operation: isNoteRemoval ? 'delete' : 'update' });

      return savedNote;
    } catch (error) {
      if (!didCancel(error)) {
        // TODO: Retry save
        this.meta.showToast.error('Oops. Error while saving this note. Try again in sometime');
        throw error;
      }
      // TODO: Retry Saving
      // throw error;
    }
  }

  @task(function* (note_id, params) {
    yield timeout(800);

    let savedNote = yield this.updateNote(note_id, params);
    return savedNote;
  }).restartable()
  updateNoteTask;

  @task(function*(params) {
    yield timeout(300);

    let savedNote = yield this.createNote(params);
    // if (this.isNewNote) {
    //   // Need to update the id to new one if this is a new note
    //   let { id } = savedNote || {};
    //   this.note_id = id;
    // }    
    return savedNote;
  }).drop()
  createNoteTask;

  get isNoteSaving() {
    return this.createNoteTask.isRunning || this.updateNoteTask.isRunning;
  }

  get isEmptyNote() {
    return !this.model.title && !this.model.content;
  }

  @action
  async saveAndAddNew() {

    if (this.isNewNote) {
      return;
    }

    let isEmptyNote = this.isEmptyNote;
    if (isEmptyNote && !this.isNewNote) {
      try {
        await this.meta.showConfirm({
          message: 'You have deleted all the content of the current note. Switching to an another note or creating a new note will delete this note. Are you sure?'
        })  
      } catch (error) {
        return;
      }
    }

    this.meta.showToast('Saving the current note...');
    await this.saveCurrentNote(true); // allowNoteRemoval
    this.meta.showToast('New note created successfully!');
    this.setNoteContent(); // clear out the note content
  }

  get isNewNote() {
    return !this.note_id || this.note_id === 'new';
  }

  handleNoteContentRemoval({ allowNoteRemoval = true } = {}) {
    // Removing a note from list if it don't have any title and content
    this.noteStore.updateNotesList({ id: this.note_id }, { operation: 'delete' });

    if (allowNoteRemoval) {
      this.meta.showToast(
        'The last note has been moved to Archives since you\'ve cleared it\'s content. This can be recovered at anytime', {
          autoclear: false
        }
      );
    }

  }

  async createNote(payload) {
    let { data } = await this.store.makeRequest('/note', {
      method: 'post',
      data: payload
    });
    return data;
  }

  async updateNote(noteId, payload) {
    let { data } = await this.store.makeRequest(`/note/${noteId}`, {
      method: 'PUT',
      data: payload
    });
    return data;
  }

  @action
  async deleteNote(noteId) {
    if (this.isNewNote) {
      this.meta.showToast('Chill. You don\'t need to delete an empty note');
      return;
    }
    await this.meta.showConfirm({ message: 'Are you sure to delete this note? If you proceed, this note will be archived' });
    try {
      await this.store.makeRequest(`/note/${noteId}`, {
        method: 'DELETE'
      });
      this.noteStore.updateNotesList({ id: noteId }, { operation: 'delete' });
      // this.meta.showToast('Note deleted successfully and moved to Archive if you need to retrieve 😉');
      this.meta.showToast('Note deleted successfully moved to archive folder');
      this.setNoteContent();
    } catch (error) {
      this.meta.showToast.error('Error white deleting the note. Try after sometime');
    }
  }

  @action
  handleNoteSelection(note = {}) {
    let { title, content } = this.model;

    if (!this.isNewNote && !title && !content) {
      this.handleNoteContentRemoval({ allowNoteRemoval: true });
    }
    
    let {
      content: contentToBeUpdated,
      title: titleToBeUpdated,
      id: idToBeUpdated
    } = note;

    this.setNoteContent({
      title: titleToBeUpdated,
      content: contentToBeUpdated,
      id: idToBeUpdated
    });
    // notesContentElement.current.focus();
  }

  setNoteContent(note = {}) {
    let { id = '' } = note;
    // this.model.title = title;
    // this.model.content = content;
    this.note_id = id;
  }

  @action
  toggleSlider() {
    this.canShowSlider = !this.canShowSlider;
  }
}
