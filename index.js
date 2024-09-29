const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')

app.use(cors())

morgan = require('morgan')
app.use(morgan('tiny'))

persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })


  app.get('/api/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br> ${Date()}`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(note => note.id === id)

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

  app.post('/api/persons', (request, response) => {
    const { name, number } = request.body
    const newperson = 
        { 
            "id": Math.floor(Math.random() * 100),
            "name": name,
            "number": number
          }
          if (!number || !name){
            response.status(400).send('name or number missing')
          }
          else if (persons.filter(person => person.name !== name)){
            response.status(400).send('name must be unique')
          } else{
            persons = persons.concat(newperson)
            response.json(newperson)
          }
       
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })