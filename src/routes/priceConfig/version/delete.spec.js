/**
 * Tests for delete.js
 */
import request from 'supertest';
import chai from 'chai';
import models from '../../../models';
import server from '../../../app';
import testUtil from '../../../tests/util';

const expectAfterDelete = (err, next) => {
  if (err) throw err;
  setTimeout(() =>
  models.PriceConfig.findAll({
    where: {
      key: 'dev',
      version: 1,
    },
    paranoid: false,
  })
    .then((priceConfigs) => {
      if (priceConfigs.length === 0) {
        throw new Error('Should found the entity');
      } else {
        chai.assert.isNotNull(priceConfigs[0].deletedAt);
        chai.assert.isNotNull(priceConfigs[0].deletedBy);

        chai.assert.isNotNull(priceConfigs[1].deletedAt);
        chai.assert.isNotNull(priceConfigs[1].deletedBy);
        next();
      }
    }), 500);
};


describe('DELETE priceConfig version', () => {
  const priceConfigs = [
    {
      key: 'dev',
      config: {
        test: 'test1',
      },
      version: 1,
      revision: 1,
      createdBy: 1,
      updatedBy: 1,
    },
    {
      key: 'dev',
      config: {
        test: 'test2',
      },
      version: 1,
      revision: 2,
      createdBy: 1,
      updatedBy: 1,
    },
  ];

  beforeEach(() => testUtil.clearDb()
    .then(() => models.PriceConfig.create(priceConfigs[0]))
    .then(() => models.PriceConfig.create(priceConfigs[1]))
    .then(() => Promise.resolve()),
  );
  after(testUtil.clearDb);


  describe('DELETE /projects/metadata/priceConfig/{key}/versions/{version}', () => {
    it('should return 403 if user is not authenticated', (done) => {
      request(server)
        .delete('/v4/projects/metadata/priceConfig/dev/versions/1')
        .expect(403, done);
    });

    it('should return 403 for member', (done) => {
      request(server)
      .delete('/v4/projects/metadata/priceConfig/dev/versions/1')
      .set({
        Authorization: `Bearer ${testUtil.jwts.member}`,
      })
        .expect(403, done);
    });

    it('should return 403 for copilot', (done) => {
      request(server)
      .delete('/v4/projects/metadata/priceConfig/dev/versions/1')
      .set({
        Authorization: `Bearer ${testUtil.jwts.copilot}`,
      })
        .expect(403, done);
    });

    it('should return 403 for manager', (done) => {
      request(server)
      .delete('/v4/projects/metadata/priceConfig/dev/versions/1')
      .set({
        Authorization: `Bearer ${testUtil.jwts.manager}`,
      })
        .expect(403, done);
    });

    it('should return 404 for non-existed key', (done) => {
      request(server)
      .delete('/v4/projects/metadata/priceConfig/dev111/versions/1')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .expect(404, done);
    });

    it('should return 404 for non-existed version', (done) => {
      request(server)
      .delete('/v4/projects/metadata/priceConfig/dev/versions/111')
        .set({
          Authorization: `Bearer ${testUtil.jwts.admin}`,
        })
        .expect(404, done);
    });

    it('should return 204, for admin', (done) => {
      request(server)
      .delete('/v4/projects/metadata/priceConfig/dev/versions/1')
      .set({
        Authorization: `Bearer ${testUtil.jwts.admin}`,
      })
        .expect(204)
        .end(err => expectAfterDelete(err, done));
    });

    it('should return 204, for connect admin', (done) => {
      request(server)
      .delete('/v4/projects/metadata/priceConfig/dev/versions/1')
        .set({
          Authorization: `Bearer ${testUtil.jwts.connectAdmin}`,
        })
        .expect(204)
        .end(err => expectAfterDelete(err, done));
    });
  });
});
