document.addEventListener('DOMContentLoaded', function () {
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });

  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });
});

// Render todo
const renderTodo = (data, id) => {
  const { title, description } = data;
  const todos = document.querySelector('.todos');
  const html = `
    <div class="card-panel todo white row" data-id="${id}">
      <div class="todo-details">
        <div class="todo-title">${title}</div>
        ${description}
      </div>
      <div class="btn btn-small grey todo-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
    </div>
  `;
  todos.innerHTML += html;
};

// Remove todo from DOM
const removeTodo = (id) => {
  const todo = document.querySelector(`.todo[data-id=${id}]`);
  todo.remove();
};
