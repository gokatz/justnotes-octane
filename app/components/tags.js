import Component from '@glimmer/component';

export default class TagsComponent extends Component {

  get tags() {
    let allTags = (this.args.note || '').match(/#[A-Za-z0-9]*/g) || [];
    return allTags.filter(tagName => tagName !== '#');
  }

}

