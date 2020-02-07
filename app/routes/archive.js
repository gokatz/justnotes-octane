import Route from '@ember/routing/route';

export default class ArchiveRoute extends Route {
  setupController(controller) {
    super.setupController(...arguments);
    controller.setInitialNotes();
  }
}
