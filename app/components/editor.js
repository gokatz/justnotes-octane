import Component from '@glimmer/component';
import { action } from '@ember/object';
import Editor from "medium-editor";
import { tracked } from '@glimmer/tracking';

export default class EditorComponent extends Component {
  @tracked editor;

  @action
  handleContentChange(event, contentEditableElement) {
    this.args.handleContentChange(contentEditableElement.innerHTML);
  }

  // Modifiers

  @action
  initializeEditor(content = '', element) {
    this.editor = new Editor(element, {
      autoLink: true, // convert the link text into anchor tags by default
      placeholder: {
        /* This example includes the default options for placeholder,
           if nothing is passed this is what it used */
        text: "Type your notes here...",
        hideOnClick: true
      }
    });
    this.updateContentInEditor(content);
    this.editor.subscribe("editableInput", this.handleContentChange);
  }

  @action
  removeEditor() {
    this.editor.unsubscribe("editableInput", this.handleContentChange);
  }

  @action
  updateContentInEditor() {
    this.editor.setContent(this.args.content);
  }
}
