require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())


morgan.token('postBody', (req, res) => {
    return JSON.stringify(req.body)
})

morgan.format('custom', ':method :url :status :res[content-length] - :response-time ms :postBody')

app.use(morgan('custom'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>
        response.json(persons)
    )
})

app.get('/info', (request, response) => {
    const now = new Date()
    Person.find({}).then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
        <p>${now.toString()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(request.params.id).then(person => {
        if (!person) {
            response.status(404).end()
        } else {
            response.status(200).json(person)
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(200).json(result)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || body.name.length === 0) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number || body.number.length === 0) {
        return response.status(400).json({
            error: 'number missing'
        })
        // } else if (persons.find((person) => person.name === body.name)) {
        //     return response.status(400).json({
        //         error: 'name must be unique'
        //     })
        // }
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})