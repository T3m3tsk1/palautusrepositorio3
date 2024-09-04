import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ newFilter, handleFilterChange}) => {
  return (
    <div>
      Filter shown with <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = (
  {
    addName,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange
  }
) => {
  return (
    <>
      <form onSubmit={addName}>
        <div>
          Name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </>
  )
}

const Persons = ({ filteredPersons, deletePerson }) => {
  return (
    <>
      {filteredPersons.map(person => 
        <p key={person.name}>{person.name} {person.number} <button onClick={() => deletePerson(person)}>Delete</button></p>
      )}
    </>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  
  return (
    <div className='message'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(persons => setPersons(persons))
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      setNewName('')
      setNewNumber('')
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        personService.updatePerson(personToUpdate.id, { ...personToUpdate, number: newNumber})
          .then(() => {
            const updatedPersons = persons.map(person => 
              person.id === personToUpdate.id ? { ...person, number: newNumber} : person
            )
            setPersons(updatedPersons)
            setMessage(`Updated ${newName}'s number`)
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })
          .catch(() => {
            setPersons(persons.filter(person => person.name !== newName))
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          })
      }
      return
    }

    const person = { name: newName, number: newNumber }

    personService.createNew(person)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
    })

    setMessage(`Added ${newName}`)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(person.id)
        .then(returnedPerson => {
          setPersons(persons.filter(person => person.id !== returnedPerson.id))
      })
    }
    setMessage(`Deleted ${person.name}`)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />
      <ErrorNotification message={errorMessage} />

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h3>Numbers</h3>

      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )

}

export default App