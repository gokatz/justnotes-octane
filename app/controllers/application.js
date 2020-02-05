import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service meta;
  @service user;
  @service router;

  get canShowSideNav() {
    let { currentRouteName } = this.router;
    let isProtectedPage = this.meta.isProtectedPage(currentRouteName);

    return isProtectedPage;
  }
}
