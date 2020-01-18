import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MetaService extends Service {

  constructor() {
    super(...arguments);
    this.showToast.error = (message, options = {}) => {
      options.type = 'error';
      this.showToast(message, options);
    };
  }

  @tracked toastMsg = '';
  @tracked toastOptions = {};
  @tracked isSliderMenuOpen = false;
  @tracked isSideBarOpen = false;
  @tracked canShowConfirm = false;
  @tracked confirmOptions = {};

  @service router;

  isProtectedPage(routeName) {
    return !['signin', 'register'].includes(routeName);
  }

  @action 
  showToast(message, options = {}) {
    let { timeout = 3000, autoclear = true, type } = options;
    this.toastMsg = message
    this.toastOptions = {
      timeout, autoclear, type
    };

    if (autoclear) {
      setTimeout(() => {
        this.toastMsg = '';
      }, timeout);
    }
  }

  @action 
  clearToast() {
    this.toastMsg = '';
  }

  @action 
  toggleSlider() {
    this.isSliderMenuOpen = !this.isSliderMenuOpen;
  }

  @action 
  toggleSideBar() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  @action
  showConfirm(options = {}) {
    let { message = 'Are you sure about this action', primaryBtnLabel = 'Yeah. Go ahead', secBtnLabel = 'Nope' } = options;

    return new Promise((resolve, reject) => {
      this.canShowConfirm = true;
      this.confirmOptions = {
        message,
        primaryBtnLabel,
        secBtnLabel,
        onConfirm: (() => {
          resolve();
          this.canShowConfirm = false;
        }).bind(this),
        onReject: (() => {
          reject();
          this.canShowConfirm = false;
        }).bind(this)
      };
    })
  }
}
