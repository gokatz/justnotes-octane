import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

// console.log(Route);
 

export default class ApplicationRoute extends Route {

  @service user;
  @service meta;

  async beforeModel(transition) {

    try {
      await this.user.authenticateUser.perform();
    } catch (e) {
      // NoOperation
    }

    this.handleAuth(transition);
  }

  async handleAuth(transition) {
    let { targetName } = transition;
    let isAuthenticated = this.user.isAuthenticated;
    let isProtectedPage = this.meta.isProtectedPage(targetName);

    if (isAuthenticated && !isProtectedPage) {
      this.transitionTo('application');
    }

    if (!isAuthenticated && isProtectedPage) {
      this.user.logoutAndRedirectToSignIn();
    }
  }
}
