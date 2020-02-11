import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { scheduleOnce, later } from '@ember/runloop';

export default class ApplicationRoute extends Route {

  @service user;
  @service meta;
  @service('note') noteStore;
  @service router;

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

    // This entire section handles the overall app logics
    this.router.on('routeWillChange', (transition) => {      
      if (!transition.to.find(route => route.name === this.router.currentRouteName)) {
        this.meta.clearToast();
      }
    })

    function removeSplash() {
      let splashScreen = document.getElementById('splash');
      splashScreen.classList.add('_fade');
      later(() => {
        splashScreen.remove();
      }, 300);
    }
    
    scheduleOnce('afterRender', removeSplash);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(function () { console.log("Service Worker Registered"); });
    }
  }

  async handleAuth(transition) {
    let { targetName } = transition;
    let isAuthenticated = this.user.isAuthenticated;
    let isProtectedPage = this.meta.isProtectedPage(targetName);

    if (targetName.includes('oauth')) {
      return;
    }

    if (isAuthenticated && !isProtectedPage) {
      this.transitionTo('application');
    }

    if (!isAuthenticated && isProtectedPage) {
      this.user.logoutAndRedirectToSignIn();
    }
  }
}
