const environment    = process.env.NODE_ENV || 'development'
const configuration  = require('../../knexfile')[environment]
const database  = require('knex')(configuration)

function find (id) {
return database.raw('SELECT * FROM foods WHERE id = ? LIMIT 1', [id])
}

function all () {
  return database.raw('SELECT * FROM foods')
}
function create (name, calories) {
   return database('foods').returning(['id', 'name','calories']).insert({name: name, calories: calories, created_at: new Date})
   .catch(function(error) {
     return [];
   })
}

function destroy (id) {
  return database('foods').where('id', id).del()
  .catch(function(error){
    return 0
  })
}

function update (id, name, calories){
  return database('foods').returning(['id', 'name', 'calories']).where('id', '=', id).update({name: name, calories: calories})
  .catch(function(error){
    return []
  })
}

function search (searchName){
  var searchParam = '%' + searchName + '%'
  return database('foods').returning(['id', 'name', 'calories']).where('name', 'ilike', searchParam )
  .catch(function(error){
    return 0
  })
}

module.exports = {
  find: find,
  all: all,
  create: create,
  destroy: destroy,
  update: update,
  search: search
}
