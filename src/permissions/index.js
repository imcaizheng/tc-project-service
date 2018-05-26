

const Authorizer = require('tc-core-library-js').Authorizer;
const projectView = require('./project.view');
const projectEdit = require('./project.edit');
const projectDelete = require('./project.delete');
const projectMemberDelete = require('./projectMember.delete');
const projectAdmin = require('./admin.ops');
const connectManagerOrAdmin = require('./connectManagerOrAdmin.ops');

module.exports = () => {
  Authorizer.setDeniedStatusCode(403);

  // anyone can create a project
  Authorizer.setPolicy('project.create', true);
  Authorizer.setPolicy('project.view', projectView);
  Authorizer.setPolicy('project.edit', projectEdit);
  Authorizer.setPolicy('project.delete', projectDelete);
  Authorizer.setPolicy('project.addMember', projectView);
  Authorizer.setPolicy('project.removeMember', projectMemberDelete);
  Authorizer.setPolicy('project.addAttachment', projectEdit);
  Authorizer.setPolicy('project.updateAttachment', projectEdit);
  Authorizer.setPolicy('project.removeAttachment', projectEdit);
  Authorizer.setPolicy('project.downloadAttachment', projectView);
  Authorizer.setPolicy('project.updateMember', projectEdit);
  Authorizer.setPolicy('project.admin', projectAdmin);

  Authorizer.setPolicy('projectTemplate.create', connectManagerOrAdmin);
  Authorizer.setPolicy('projectTemplate.edit', connectManagerOrAdmin);
  Authorizer.setPolicy('projectTemplate.delete', connectManagerOrAdmin);
  Authorizer.setPolicy('projectTemplate.view', true);

  Authorizer.setPolicy('productTemplate.create', connectManagerOrAdmin);
  Authorizer.setPolicy('productTemplate.edit', connectManagerOrAdmin);
  Authorizer.setPolicy('productTemplate.delete', connectManagerOrAdmin);
  Authorizer.setPolicy('productTemplate.view', true);
};
