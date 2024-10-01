const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())
const morgan = require('morgan')
app.use(morgan('tiny'))
require('dotenv').config()
const Person = require('./models/person')


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/info', (request, response) => {
  Person.countDocuments()
  .then(count => {
    response.send(`Phonebook has info for ${count} people <br> ${new Date()}`);
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('body.name:', body.name)
  console.log('body.number:', body.number)

  if (!body.name|| !body.number) {
    console.log('Name and number must be provided')
    return response.status(400).json({ error: 'Name and number must be provided' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log('entered app.delete')
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (!body.name|| !body.number) {
    console.log('body.name:', body.name)
    console.log('body.number:', body.number)
    console.log('Name and number must be provided')
    return response.status(400).json({ error: 'Name and number must be provided' })
  }

  Person.findByIdAndUpdate(request.params.id, { name:body.name, number:body.number }, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

