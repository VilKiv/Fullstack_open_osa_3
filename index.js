require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

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

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(request.params.id).then(person => {
        if (!person) {
            response.status(404).end()
        } else {
            response.status(200).json(person)
        }
    })
    .catch(error => {      
        console.log(error)      
        response.status(400).send({ error: 'malformatted id' })    
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((p => p.id === id))
    persons = persons.filter(person => person.id !== id)
    response.status(200).json(person)
})

// const generateId = () => {
//     const randomInt = Math.floor(Math.random() * 1000000)
//     return String(randomInt)
// }

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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})