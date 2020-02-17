import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { validate } from '../utils';
import { inject as service } from '@ember/service';

export default class RegisterController extends Controller {

  @service store;
  @service meta;

  @task(function* () {

    let { email, password, name } = this;

    try {
      yield validate({ name, email, password });
    } catch (error) {
      this.meta.showToast.error('Please fill in all the fields to continue');
      return;
    }

    try {
      yield this.store.makeRequest('/register', {
        method: 'post',
        data: {
          email,
          password,
          username: name
        }
      });
    } catch (error) {
      let { error_msg = 'Something went wrong. Please try after some time' } = error;
      this.meta.showToast.error(error_msg, {
        autoclear: false
      });
      return;
    }

    this.transitionToRoute('signin');
  }).drop()
  register;
}
