const Food     = require('../models/food')

function show (request, response){
  Food.find(request.params.id)
  .then((data) => {
    let food = data.rows[0]
    if (!food) {
      return response.sendStatus(404)
    }
    else{
      return response.json(food)
    }
  })
}

function index (request, response){
  Food.all()
  .then((data) => {
    let food = data.rows
    if (!food) {
      return response.sendStatus(404)
    }
    else{
      return response.json(food)
    }
  })
}

function create (request, response){
  Food.create(request.query.name, request.query.calories)
  .then((data) => {
    let newFood = data[0]
    if (data.length == 0) {
      return response.sendStatus(404)
    }
    else {
      return response.json(newFood)
    }
  })
}

function destroy (request, response){
  Food.destroy(request.params.id)
  .then((data) => {
    if (data === 0){
      return response.sendStatus(404)
    }
    else {
      return response.sendStatus(200)
    }
  })
}

function update (request, response){
  Food.update(request.params.id,request.query.name, request.query.calories)
  .then((data) => {
    let updatedFood = data[0]
    if (data.length == 0){
      return response.sendStatus(404)
    }
    else {
      return response.json(updatedFood)
    }
  })
}

function search (request, response){
  Food.search(request.query.searchName)
  .then((data) => {
    let searchResults = data
    if (data.length === 0){
      return response.json(data)
    }
    else {
      return response.json(searchResults)
    }
  })
}

module.exports = {
  show: show,
  index: index,
  create: create,
  destroy: destroy,
  update: update,
  search: search
}
