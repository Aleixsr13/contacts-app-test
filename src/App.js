import './index.css'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  getAllPersons,
  createPerson,
  deletePerson,
  updatePerson,
} from './services/persons'

const Filter = ({ handleSearchChange, searchName }) => {
  return (
    <div>
      Search by name: <input onChange={handleSearchChange} value={searchName} />
    </div>
  )
}

const PersonForm = ({
  handleSubmit,
  handleNameChange,
  handleNumberChange,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, searchName, handleDelete }) => {
  return (
    <ul>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(searchName.toLocaleLowerCase())
        )
        .map((person) => (
          <li className="personsList" key={person.name}>
            {person.name} {person.number}&nbsp;
            <button onClick={() => handleDelete(person.id, person.name)}>
              Delete
            </button>
          </li>
        ))}
    </ul>
  )
}

const SuccessNotification = ({ sucessMessage }) => {
  if (sucessMessage === null) {
    return null
  }

  return <div className="sucessMessage">{sucessMessage}</div>
}

const ErrorNotification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }

  return <div className="errorMessage">{errorMessage}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [successMessage, setSuccesMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    getAllPersons().then((persons) => {
      setPersons(persons)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const personToAddToState = {
      id: uuidv4(),
      name: newName,
      number: newNumber,
    }

    const personExists = persons.find((person) => person.name === newName)

    if (personExists) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the older number with a new one?`
        )
      ) {
        const updatedPerson = { ...personExists, number: newNumber }

        updatePerson(updatedPerson)
          .then((updatedPerson) => {
            setPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            )
            setSuccesMessage(`${personExists.name} number succesfully updated`)
            setTimeout(() => {
              setSuccesMessage(null)
            }, 5000)
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${personExists.name} has already beend removed from the server`
            )
          })
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      } else {
        return
      }
    } else {
      createPerson(personToAddToState).then((newPerson) => {
        setPersons((prevPersons) => [...prevPersons, newPerson])
        setSuccesMessage(`Added ${newPerson.name}`)
      })
      setTimeout(() => {
        setSuccesMessage(null)
      }, 5000)
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchName(event.target.value)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      deletePerson({ id }).then(() => {
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person.id !== id)
        )
      })
    } else {
      setPersons((prevPersons) => prevPersons)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification sucessMessage={successMessage} />
      <ErrorNotification errorMessage={errorMessage} />
      <Filter handleSearchChange={handleSearchChange} searchName={searchName} />
      <h2>Add new contact</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchName={searchName}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App
