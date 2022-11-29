// SET UP MATERIALIZED COMPONENTS
document.addEventListener("DOMContentLoaded", function() {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

// NAVIGATION & SIDE PANEL (ADD ITEMS)

document.addEventListener("DOMContentLoaded", function () {
  //Nav Menu
  const menus = document.querySelectorAll(".side-menu");
  M.Sidenav.init(menus, { edge: "right" });
  // Add Tasks
  const forms = document.querySelectorAll(".side-form");
  M.Sidenav.init(forms, { edge: "left" });
});

// SELECTS ALL ELEMENTS WITH SAME CLASS
// GRABS TASKS ELEMENT
const tasks = document.querySelector(".tasks");

// WILL SELECT ALL ITEMS W/ .logged out
const loggedOutLinks = document.querySelectorAll(".logged-out");

const loggedInLinks = document.querySelectorAll(".logged-in");

// SETS UP UI ACCORDING TO LOG STATE

const setUpUI = (user) => {
  
  if (user) {

    // TOGGLE UI ELEMENTS ACCORDING TO USER STATE
  loggedOutLinks.forEach((item) => (item.style.display = "none"));

  loggedInLinks.forEach((item) => (item.style.display = "block"));

} else {

  loggedOutLinks.forEach((item) => (item.style.display = "block"));

  loggedInLinks.forEach((item) => (item.style.display = "none"));

}

}



// setupTasks WILL POPULATE LIST WHEN USER IS SIGNNED IN
const setupTasks = (data) => {

  
  let html ="";
  data.forEach((doc) => {
    const task = doc.data();
    const li = `
        <div class="card-panel task white row" data-id ="${task.id}">
        <i class="material-icons check">done</i>
        <div class="task-detail">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
        </div>
        <div class="task-delete">
            <i class="material-icons" data-id ="${task.id}">delete_outline</i>
        </div>
    </div>
    `;

    html += li;

  });

  tasks.innerHTML = html;
}

//------------------------------------- USER LIST ITEMS (WHEN USER IS NOT LOGGED IN)
const renderTask = (data, id) => {
  const html = `
  <div class="card-panel task white row" data-id ="${id}">
            <i class="material-icons check">done</i>
            <div class="task-detail">
                <div class="task-title">${data.title}</div>
                <div class="task-description">${data.description}</div>
            </div>
            <div class="task-delete">
                <i class="material-icons" data-id ="${id}">delete_outline</i>
            </div>
        </div>
  `;
  tasks.innerHTML += html;
};

//remove task from DOM
const removeTask = (id) => {
  const task = document.querySelector(`.task[data-id ="${id}"]`);
  // console.log(task);
  task.remove();
};
