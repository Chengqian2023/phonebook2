import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notifyMessage, setNotifyMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching persons:", error);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    console.log("Button clicked", event.target);
    const nameExists = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );
    if (
      nameExists &&
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      const person = persons.find(
        (n) => n.name.toLowerCase() === newName.toLowerCase()
      );
      const updatedPerson = { ...person, number: newNumber };
      personService
        .update(person.id, updatedPerson)
        .then(() =>
          personService.getAll().then((response) => {
            setPersons(response.data);
            setNotifyMessage(`Changed ${newName}'s number as ${newNumber}`);
            setTimeout(() => {
              setNotifyMessage(null);
            }, 5000);
            setNewName("");
            setNewNumber("");
          })
        )
        .catch((error) => {
          setErrorMessage(
            `the person ${newName} was already deleted from server`
          );
        });
      return;
    }
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    personService
      .create(newPerson)
      .then((response) => {
        setPersons(persons.concat(newPerson));

        setNotifyMessage(`Added ${newName}`);
        setTimeout(() => {
          setNotifyMessage(null);
        }, 5000);
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.log("Error creating person:", error);
      });
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    if (personToDelete && window.confirm(`Delete ${personToDelete.name} ?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting person", error);
        });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };
  const filteredPersons = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Notification message={notifyMessage} error={errorMessage} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
