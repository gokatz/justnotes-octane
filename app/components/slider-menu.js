import Component from '@glimmer/component';

export default class SliderMenuComponent extends Component {
  menus = [
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings'
    },
    {
      id: 'archives',
      title: 'Archives',
      icon: 'archive'
    },
    {
      id: 'help',
      title: 'Help',
      icon: 'help',
      action: this.goToHelp
    }
  ];

  goToHelp() {
    window.open('https://www.google.com/search?q=just+notes+help', '_blank');
  }
}
