const Person = ({ person, handleDelete }) => (
  <div>
    {person.name} {person.number}
    <button type="button" onClick={() => handleDelete(person.id)}>
      delete
    </button>
  </div>
);
export default Person;
