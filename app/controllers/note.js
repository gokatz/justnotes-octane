import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task, didCancel } from 'ember-concurrency';
import { reads } from '@ember/object/computed';
import { action } from '@ember/object';

export default class NoteController extends Controller {

  @service meta;
  @service store;
  @service('note') noteStore;

  @tracked title = '';
  @tracked content = '';

  @reads('noteStore.notes')
  notes;

  queryParams = ['note_id'];
  @tracked note_id = '';

  @action
  async saveCurrentNote({ allowNoteRemoval = false } = {}) {
    // TODO: UpdateLocalState - Use any libraries like OrbitJS
    let { title, content, note_id } = this;
    let params = {
      title,
      content
    };

    return this.updateOrCreateNoteTask.perform(note_id, params, allowNoteRemoval)
      .then(savedNote => {
        if (this.isNewNote) {
          // Need to update the id to new one if this is a new note
          let { id } = savedNote || {};
          this.note_id = id;
        }
      })
      .catch((error) => {
        if (!didCancel(error)) {
          this.meta.showToast.error('Oops. I cannot save your note. Try again in sometime');
          throw error;
        }

      });
  }

  get isEmptyNote() {
    return !this.title && !this.content;
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

    this.meta.showToast('New note created successfully!');
    await this.saveCurrentNote(true); // allowNoteRemoval
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

  @task(function*(noteId = '', params = {}, allowNoteRemoval) {
    let isNewNote = this.isNewNote;
    let { title, content } = params;
    let isNoteRemoval =  !title && !content;

    if (isNoteRemoval && !allowNoteRemoval) {      
      this.handleNoteContentRemoval({ allowNoteRemoval: false });
      return;
    }

    let savedNote;
    try {
      if (isNewNote) {
        savedNote = yield this.createNote(params);
      } else {
        savedNote = yield this.updateNote(noteId, params);
      }

      // TODO: need to get saved data from server @varun
      Object.assign(savedNote, params);
      // Update the notes list
      // We will not wait for the response as it be handled in the background
      this.noteStore.updateNotesList(savedNote, { operation: isNoteRemoval ? 'delete' : 'update' });

      return savedNote;
    } catch (error) {
      // TODO: set Notification about errors
      // Retry Saving
      throw error;      
    }

  }).keepLatest()
  updateOrCreateNoteTask;

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

  handleNoteSelection(note = {}) {
    let { title, content } = this;

    if (!title && !content) {
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
    let { title = '', content = '', id = '' } = note;
    this.title = title;
    this.content = content;
    this.note_id = id;
  }
}
