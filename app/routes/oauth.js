import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class OauthRoute extends Route {

  @service store;
  @service user;
  @service meta;

  async model() {
    let googleAuthParams = new URLSearchParams(window.location.search)
    let params = {
      code: googleAuthParams.get('code'),
      scope: googleAuthParams.get('scope'),
      state: googleAuthParams.get('state'),
    }
    let token;
    try {
      let { data = {}} = await this.store.makeRequest('/login/oauth2/code/google', {
        params
      });
      token = data.token;      
    } catch (error) {
      // alert('Error');
      this.meta.showToast('Error while login you into JustNotes. Please try again');
      this.transitionTo('register');
      throw error;
    }
    this.user.saveToken(token);
    this.transitionTo('application').then(() => {
      window.location.reload();
    });
  }
}
