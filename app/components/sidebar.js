import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SidebarComponent extends Component {

  @service meta;
  @service user;
  @service router;

  menus = [
    {
      id: 'newnote',
      title: 'Add Note',
      icon: 'plus',
      action: this.gotoPage,
      link: 'note'
    },
    {
      id: 'notes',
      title: 'All Notes',
      icon: 'list',
      action: this.gotoPage,
      link: 'search'
    },
    // {
    //   id: 'archives',
    //   title: 'Archives',
    //   action: this.gotoPage,
    //   icon: 'archive'
    // },
    {
      id: 'divider'
    },
    {
      id: 'use',
      title: 'Profile',
      action: this.openProfile,
      icon: 'user'
    },
    // {
    //   id: 'settings',
    //   title: 'Settings',
    //   action: this.gotoPage,
    //   icon: 'settings'
    // },
    {
      id: 'help',
      title: 'Help',
      action: this.openHelp,
      icon: 'help'
    }
  ];

  @action
  gotoPage(menu = {}) {
    menu.link && this.router.transitionTo(menu.link);
    this.meta.toggleSideBar();
  }

  @action
  onClickOutside() {
    if (this.meta.isSideBarOpen) {
      this.meta.toggleSideBar();
    }
  }

  @action
  logoutUser() {
    this.meta.showConfirm({
      message: 'Are you sure want to logout?'
    }).then(() => {
      this.user.logoutAndRedirectToSignIn();
      this.meta.toggleSideBar();  
    })
  }

  @action
  openProfile() {
    this.user.toggleProfile();
    this.meta.toggleSideBar();  
  }

  @action
  openHelp() {
    this.meta.toggleHelp();
    this.meta.toggleSideBar();  
  }
}
