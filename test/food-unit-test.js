const assert    = require('chai').assert
const app       = require('../server')
const request   = require('request')
const environment    = process.env.NODE_ENV || 'test'
const configuration  = require('../knexfile')[environment]
const database  = require('knex')(configuration)
const Food     = require('../lib/models/food')

const pry = require('pryjs')

describe('Food', () => {
  beforeEach((done) => {
    database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Banana', 50, new Date])
    .then(() => {
    database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Donut', 500, new Date])
    .then(() => done())})
  })
  afterEach((done) => {
    database.raw('TRUNCATE foods RESTART IDENTITY')
    .then(() => done())
  })

  it('find function returns correct food', (done) =>{
      Food.find(1).then((food)=>{
        let foundFood = food[0]
        assert.equal(foundFood.id, 1)
        assert.equal(foundFood.name, 'Banana')
        assert.equal(foundFood.calories, 50)
      })
    done()
  })
  it('find function returns empty array if food not found', (done) =>{
      Food.find(3).then((food)=>{
        assert.typeOf(food, 'array')
        assert.equal(food.length, 0)
      })
    done()
  })
  it('create function inserts food into database', (done) =>{
      Food.create('Orange', 75).then((food)=>{
        let createdFood = food[0]
        assert.equal(createdFood.id, 3)
        assert.equal(createdFood.name, 'Orange')
        assert.equal(createdFood.calories, 75)
      })
    done()
  })
  it('create function returns empty array if food not created', (done) =>{
      Food.create('Banana', 75).then((food)=>{
        assert.typeOf(food, 'array')
        assert.equal(food.length, 0) 
      })
    done()
  })
  it('delete function returns number 1 if food deleted', (done) =>{
      Food.destroy(1).then((food)=>{
        assert.typeOf(food, 'number')
        assert.equal(food, 1)
      })
    done()
  })
  it('delete function returns number 0 if no food is deleted', (done) =>{
      Food.destroy(3000).then((food)=>{
        assert.typeOf(food, 'number')
        assert.equal(food, 0)
      })
    done()
  })
  it('update function returns updated food if update took place', (done) =>{
      Food.update(1, 'Fudge', 1000).then((food)=>{
        let updatedFood = food[0]
        assert.equal(updatedFood.id, 1)
        assert.equal(updatedFood.name, 'Fudge')
        assert.equal(updatedFood.calories, 1000)
      })
    done()
  })
  it('update function returns empty array if no update occurred', (done) =>{
      Food.update(300, 'Fudge', 1000).then((food)=>{
        assert.typeOf(food, 'array')
        assert.equal(food.length, 0)
      })
    done()
  })
  it('search function returns array of matched foods', (done) =>{
      Food.search('n').then((food)=>{
        assert.typeOf(food, 'array')
        assert.equal(food.length, 2)

        let foodA = food[0]
        let foodB = food[1]

        assert.equal(foodA.id, 1)
        assert.equal(foodA.name, 'Banana')
        assert.equal(foodA.calories, 50)
        assert.equal(foodB.id, 2)
        assert.equal(foodB.name, 'Donut')
        assert.equal(foodB.calories, 500)
      })
    done()
  })
  it('search function returns number 0 if no matches exist', (done) =>{
      Food.search('z').then((food)=>{

        assert.typeOf(food, 'array')
        assert.equal(food.length, 0)
      })
    done()
  })
})
