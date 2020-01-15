import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class UserService extends Service {

  @service
  router;

  @action 
  logout() {
    window.document.cookie = 'jsessionid=;';
    this.router.transitionTo('/signin');
  }
}
