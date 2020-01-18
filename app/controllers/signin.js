import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { validate } from '../utils';
import { inject as service } from '@ember/service';
// import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class SigninController extends Controller {
  @tracked email;
  @tracked password;

  @service meta;
  @service store;

  @task(function* () {

    let { email, password } = this;

    try {
      yield validate({ email, password });
    } catch (error) {
      this.meta.showToast.error('Fill in email and password to continue');
      return;
    }

    try {
      let response = yield this.store.makeRequest('/authenticate', {
        method: 'post',
        data: {
          username: email,
          password
        }
      });

      let { data: { token } = {} } = response || {};
      document.cookie = `justpass=${token}`;
      this.transitionToRoute('application');
    } catch (error) {
      let msg =
      (error.response || {}).status === 401
        ? 'Oops. Seems you\'ve mistyped your Email or Password'
        : 'Something went wrong. Please try after some time';

      this.meta.showToast.error(msg, {
        autoclear: false
      });
    }
  }).drop()
  signIn;
}
