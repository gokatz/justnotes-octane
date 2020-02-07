import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

const isMobileDevice = window.innerWidth <= 500;

Router.map(function() {
  this.route('note', isMobileDevice ? undefined : { path: '/' });
  this.route('search', isMobileDevice ? { path: '/' } : undefined);
  this.route('signin');
  this.route('register');
  this.route('oauth', { path: '/oauth2/:provider' });
  this.route('archive');
});
