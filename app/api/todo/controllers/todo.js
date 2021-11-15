'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  // Дописываем логику создания объекта и добавляем ему пользователя
  // https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#controllers
  async create(ctx) {
    let entity;
    console.log(JSON.stringify(ctx, null, 2))
    //console.log(JSON.stringify(ctx.state, null, 2))
    const todo = ctx.request.body;
    todo.user = ctx.state.user.id;
    entity = await strapi.services.todo.create(todo);
    return sanitizeEntity(entity, { model: strapi.models.todo });
  },

  // Дописываем логику вывода тудушек
  async find(ctx) {
    let entities;
    let query = {... ctx.query}; // делаем копию запроса
    query.user = ctx.state.user.id;
    /*if (ctx.query._q) {
      entities = await strapi.services.todo.search(query);
    } else {
      entities = await strapi.services.todo.find(query);
    }*/
    entities = await strapi.services.todo.find(query);
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.todo }));
  },

  async top(ctx) {
    let entities;
    const { id } = ctx.state.user.id;
    // https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#queries
    entities = await strapi.query('todo').find({
      _sort: 'created_at:asc',
      user: id,
      done: false,
      _limit: 3,
    });
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.todo }));
  },
};
