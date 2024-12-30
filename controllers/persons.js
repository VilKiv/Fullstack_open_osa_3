const personRouter = require('express').Router()
const Person = require('./../models/person')


personRouter.get('/api/persons', (request, response) => {
  Person.find({}).then(persons =>
    response.json(persons)
  )
})

personRouter.get('/info', (request, response) => {
  const now = new Date()
  Person.find({}).then(persons => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
        <p>${now.toString()}</p>`)
  })
})

personRouter.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (!person) {
      response.status(404).end()
    } else {
      response.status(200).json(person)
    }
  })
    .catch(error => next(error))
})

personRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(200).json(result)
    })
    .catch(error => next(error))
})

personRouter.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

personRouter.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personRouter