const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('postBody',(req,res) => {
    return JSON.stringify(req.body)
})

morgan.format('custom', ':method :url :status :res[content-length] - :response-time ms :postBody')


app.use(morgan('custom'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: "1"
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: "2"
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: "3"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${now.toString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const randomInt = Math.floor(Math.random() * 1000000)
    return String(randomInt)
}

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
    } else if (persons.find((person) => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const id = generateId()
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})