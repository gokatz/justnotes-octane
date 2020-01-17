import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

// console.log(Route);
 

export default class ApplicationRoute extends Route {

  @service user;
  @service meta;
  @service('note') noteStore;

  async beforeModel(transition) {

    try {
      await this.user.authenticateUser.perform();
    } catch (e) {
      // NoOperation
    }

    // TODO: need to move to service to watch on every route transition.
    this.handleAuth(transition);
  }

  setupController() {
    super.setupController(...arguments);
    this.noteStore.fetchNotes.perform();
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
