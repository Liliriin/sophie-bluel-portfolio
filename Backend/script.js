

async function fetchProjects() {
  const answerRequest = await fetch("http://localhost:5678/api/works");
  return await answerRequest.json();
}

async function fetchFilters() {
  const answerRequest = await fetch("http://localhost:5678/api/categories");
  return await answerRequest.json();
}


function displayProjects(projects) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  projects.forEach(project => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const caption = document.createElement("figcaption");
    caption.textContent = project.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

function activateFilters(projects) {
  const buttons = document.querySelectorAll(".filters button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;

      buttons.forEach(button => button.classList.remove("active"));
      button.classList.add("active");

      if (id === "all") {
        displayProjects(projects);
      } else {
        const filtered = projects.filter(p => p.categoryId == id);
        displayProjects(filtered);
      }
    });
  });
}

function createFilters(filterBtn, projects) {

  const filtersContainer = document.querySelector(".filters");

  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.dataset.id = "all";
  filtersContainer.appendChild(allBtn);
  allBtn.classList.add("filter-btn");
  allBtn.classList.add("active");

  
  filterBtn.forEach(filter => {
    const btn = document.createElement("button");
    btn.textContent = filter.name;
    btn.dataset.id = filter.id;
    btn.classList.add("filter-btn");
    filtersContainer.appendChild(btn);
    
  });

  activateFilters(projects);
}




async function init() {
  
  const projects = await fetchProjects();
  const filterBtn = await fetchFilters();

  displayProjects(projects);
  createFilters(filterBtn, projects);
}

init();