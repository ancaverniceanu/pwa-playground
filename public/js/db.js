// Offline data
db.enablePersistence().catch((err) => {
  if (err.code === 'failed-precondition') {
    // Probably multiple tabs open at once
    console.log('Persistence failed!');
  } else if (err.code === 'unimplemented') {
    // No browser support
    console.log('Persistence is not available!');
  }
});

// Realtime listener
db.collection('todos').onSnapshot((snapshot) => {
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach((change) => {
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === 'added') {
      // add the document data to the web page
      renderTodo(change.doc.data(), change.doc.id);
    }
    if (change.type === 'removed') {
      // remove the document data from the web page
      removeTodo(change.doc.id);
    }
  });
});

// Add new todo
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const todo = {
    title: form.title.value,
    description: form.description.value,
  };

  db.collection('todos')
    .add(todo)
    .catch((err) => console.log('Error submitting form', err));

  form.title.value = '';
  form.description.value = '';
});

// Delete a todo
const todoContainer = document.querySelector('.todos');
todoContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'I') {
    const id = event.target.getAttribute('data-id');
    db.collection('todos').doc(id).delete();
  }
});
