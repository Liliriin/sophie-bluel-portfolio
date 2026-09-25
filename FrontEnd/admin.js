document.addEventListener("DOMContentLoaded", () => {

    // Récupération du token + vérification


    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Déclaration des variables


    const galleryAdmin = document.getElementById("gallery-admin");
    const modal = document.getElementById("modal");
    const modalGallery = document.getElementById("modal-gallery");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    
    

// Génération des galleries d'images

    async function displayProjects() {

    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    galleryAdmin.innerHTML = "";
    modalGallery.innerHTML = "";

    works.forEach(work => {

        
    // Gallerie admin
    

        
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;      
        img.alt = work.title;         

    
        const caption = document.createElement("figcaption");
        caption.textContent = work.title;

        
        figure.appendChild(img);
        figure.appendChild(caption);
        galleryAdmin.appendChild(figure);



        
     // Gallerie de la modale
        

        const modalFigure = document.createElement("figure");
        const modalImg = document.createElement("img");

        modalImg.src = work.imageUrl;
        modalImg.alt = work.title;
        modalFigure.appendChild(modalImg);

        
        const deleteIcon = document.createElement("span");

        deleteIcon.textContent = "🗑️";                      // A remplacer par du FontAwesome ? 
        deleteIcon.classList.add("delete-icon");
        deleteIcon.dataset.id = work.id;
        modalFigure.appendChild(deleteIcon);
        modalGallery.appendChild(modalFigure);
    });


    
 const deleteIcons = document.querySelectorAll(".delete-icon");

    deleteIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const id = icon.dataset.id;   
            deleteWork(id);               
        });
    });
}

displayProjects();


    

    // --- Ouverture / fermeture modale ---

    
    openModalBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        document.body.classList.add("modal-opened");
    });

    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        document.body.classList.remove("modal-opened");
    });

    
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
            document.body.classList.remove("modal-opened");
        }
    });

    

});

// Suppression d’un projet


    async function deleteWork(id) {
    const url = "http://localhost:5678/api/works/" + id;

    const options = {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    };

    const response = await fetch(url, options);

        if (response.ok) {
        displayProjects();
    } else {
        console.log("Erreur lors de la suppression :", response.status); // Mettre en place une vraie fenêtre d'erreur par la suite ?
    }
    }