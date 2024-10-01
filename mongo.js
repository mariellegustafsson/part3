
const { argv } = require('node:process')
require('dotenv').config()
const password = process.argv[2]
const url = `mongodb+srv://mariellegustafsson:${password}@cluster0.ondva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


mongoose.set('strictQuery',false)

mongoose.connect(url)

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', PersonSchema)

if (argv[3]=== undefined){
  console.log('phonebook')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })}
else{
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`${process.argv[3]} number ${process.argv[4]} added to phonebook`)
    mongoose.connection.close()
  })
}
