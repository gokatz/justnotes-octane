import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TpAuthComponent extends Component {
  @service store;
  @service user;

  constructor() {
    super(...arguments);
    this.fetchGoogleOAuthURL.perform();
  }

  @tracked googleOAuthURL = '';

  @task(function* () {
    let { data = {} } = yield this.store.makeRequest('/google/authenticate');
    this.googleOAuthURL = data.redirect_url;
  })
  fetchGoogleOAuthURL;

  @action
  openGoogleOAuth() {
    this.user.logout();
    window.location.href = this.googleOAuthURL;
  }
}
