import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { bool } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default class UserService extends Service {

  @service router;
  @service store;
  @service meta;

  @tracked email;
  @tracked name;
  @tracked canShowProfile = false;

  @bool('email')
  isAuthenticated;

  @action 
  logoutAndRedirectToSignIn() {
    window.document.cookie = 'jsessionid=;';
    window.document.cookie = 'justpass=;';
    this.router.transitionTo('/signin');
  }

  // async handleAuth(transition) {
  //   let { targetName } = transition;
  //   let isAuthenticated = this.user.isAuthenticated;
  //   let isProtectedPage = this.meta.isProtectedPage(targetName);

  //   if (isAuthenticated && !isProtectedPage) {
  //     this.transitionTo('/note');
  //   }

  //   if (!isAuthenticated && isProtectedPage) {
  //     this.user.logoutAndRedirectToSignIn();
  //   }
  // }

  @task(function* () {
    try {
      yield this.store.makeRequest('/meta').then((response = {}) => {
        let {
          data: { 
            name,
            email
          }
        } = response;
        this.email = email;
        this.name = name;
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Authentication error : ', error);
      throw error;
    }
  })
  authenticateUser;

  @action
  toggleProfile() {
    this.canShowProfile = !this.canShowProfile;
  }

  @action
  deleteAccount() {
    this.meta.showConfirm({
      message: 'Are you sure? If you delete your account, you cannot get yur access back. Hope you know what you are doing here!'
    }).then(() => {
      alert('Account Deleted');
    });
  }
}
