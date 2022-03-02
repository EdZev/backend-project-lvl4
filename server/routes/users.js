// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      if (Number(id) !== req.user.id) {
        req.flash('error', i18next.t('flash.users.accessError'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .patch('/users/:id', { name: 'user', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      if (Number(id) !== req.user.id) {
        req.flash('error', i18next.t('flash.users.accessError'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
      const user = await app.objection.models.user.query().findById(id);
      try {
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.code(422);
        user.$set(req.user.body);
        reply.render('users/edit', { user, error: data });
      }
      return reply;
    })
    .delete('/users/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      if (Number(id) !== req.user.id) {
        req.flash('error', i18next.t('flash.users.accessError'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
      await app.objection.models.user.query().deleteById(id);
      req.logOut();
      req.flash('success', i18next.t('flash.users.delete.success'));
      reply.redirect(app.reverse('users'));
      return reply;
    });
};
