import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HelpComponent extends Component {

  @service meta;

  faqs = [{
    question: 'How to add tags?',
    answer: 'Just type in your hashtags in note content itself. It will be automatically added to your note. It\'s that simple ;)'
  }, {
    question: 'Can I retrieve a deleted note?',
    answer: 'This cannot be done from the Web app right now. We are working on to provide this option soon.'
  }, {
    question: 'Is there a limit for notes that can be created in Crosa Notes?',
    answer: 'No, there is no hard limit for the number of notes that can be created in Crosa Notes. Feel free to create as much notes as you need.'
  }, {
    question: 'Where can I request a new feature or report a bug?',
    answer: 'File an issue here - <a href="https://github.com/gokatz/justnotes-octane/issues" class="text-blue-400 cursor-pointer" target="_blank">https://github.com/gokatz/justnotes-octane/issues</a>. We will try to address as soon as possible'
  }, {
    question: 'How to contact support?',
    answer: 'This Crosa Note instance is maintained entirely by a representative from your organization. For any support, contact the administrator of your organization.'
  }]
}
