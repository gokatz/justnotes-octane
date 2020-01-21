import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HelpComponent extends Component {

  @service meta;

  faqs = [{
    question: 'How to add tags',
    answer: 'Just type in your hashtags in note content itself. It will be automatically added to your note. It\'s that simple ;)'
  }, {
    question: 'How to add tags',
    answer: 'Just type in your hashtags in note content itself. It will be automatically added to your note. It\'s that simple ;)'
  }, {
    question: 'How to add tags',
    answer: 'Just type in your hashtags in note content itself. It will be automatically added to your note. It\'s that simple ;)'
  }, {
    question: 'How to add tags',
    answer: 'Just type in your hashtags in note content itself. It will be automatically added to your note. It\'s that simple ;)'
  }, {
    question: 'How to add tags',
    answer: 'Just type in your hashtags in note content itself. It will be automatically added to your note. It\'s that simple ;)'
  }, {
    question: 'How to add tags',
    answer: 'Just type in your hashtags in note content itself. It will be automatically added to your note. It\'s that simple ;)'
  }]
}
