document.addEventListener("DOMContentLoaded", () => {
    // Login + toggle Admin/Visiteur
    const token = localStorage.getItem("token");
    window.isAdmin = false;
    // Vérification locale du token
    function verifyTokenLocally() {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const now = Date.now() / 1000;
            return payload.exp && payload.exp > now;
        } catch (e) {
            return false;
        }
    }
    async function verifyToken() {
        return verifyTokenLocally();
    }
    const editBar = document.querySelector(".edit-bar");
    const adminHeader = document.querySelector(".admin-header");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    // Ouverture page login
    loginBtn.addEventListener("click", () => {
        window.location.href = "login.html";
    });
    verifyToken().then(isValid => {
        window.isAdmin = isValid;
        if (window.isAdmin) {
            // Mode admin
            editBar.classList.remove("hidden");
            adminHeader.classList.remove("hidden");
            logoutBtn.classList.remove("hidden");
            loginBtn.classList.add("hidden");
            galleryAdmin.classList.remove("hidden");
            publicTitle.classList.add("hidden");
            initModal();
        } else {
            // Mode visiteur
            localStorage.removeItem("token");
            editBar.classList.add("hidden");
            adminHeader.classList.add("hidden");
            logoutBtn.classList.add("hidden");
            loginBtn.classList.remove("hidden");
            galleryAdmin.classList.add("hidden");
            publicTitle.classList.remove("hidden");
        }
        initApp();
    });
    // Déconnexion
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.reload();
    });
    // Récupération works et categories dans l'api
    async function fetchProjects() {
        const answerRequest = await fetch("http://localhost:5678/api/works");
        return await answerRequest.json();
    }
    async function fetchFilters() {
        const answerRequest = await fetch("http://localhost:5678/api/categories");
        return await answerRequest.json();
    }
    // Gallerie publique
    function displayPublicGallery(projects) {
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
                buttons.forEach(b => b.classList.remove("active"));
                button.classList.add("active");
                if (id === "all") {
                    displayPublicGallery(projects);
                } else {
                    const filtered = projects.filter(p => p.categoryId == id);
                    displayPublicGallery(filtered);
                }
            });
        });
    }
    
    function createFilters(filterBtn, projects) {
        const filtersContainer = document.querySelector(".filters");
        filtersContainer.innerHTML = "";
        const allBtn = document.createElement("button");
        allBtn.textContent = "Tous";
        allBtn.dataset.id = "all";
        allBtn.classList.add("filter-btn", "active");
        filtersContainer.appendChild(allBtn);
        filterBtn.forEach(filter => {
            const btn = document.createElement("button");
            btn.textContent = filter.name;
            btn.dataset.id = filter.id;
            btn.classList.add("filter-btn");
            filtersContainer.appendChild(btn);
        });
        activateFilters(projects);
    }
    // Gallerie admin + modale
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalGalleryWrapper = document.getElementById("modal-gallery-wrapper");
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const backBtn = document.getElementById("back-to-gallery-btn");
    const addPhotoBtn = document.getElementById("add-photo-btn");
    const publicTitle = document.querySelector(".public-title");
    const galleryAdmin = document.getElementById("gallery-admin");
    const addPhotoForm = document.getElementById("add-photo-form");
    const imageInput = document.getElementById("image-input");
    const previewImage = document.getElementById("preview-image");
    const titleInput = document.getElementById("title-input");
    const categoryInput = document.getElementById("category-input");
    const validateBtn = document.querySelector(".validate-btn");
    
    function displayAdminGallery(works) {
        const adminGallery = document.getElementById("gallery-admin");
        const modalGallery = document.getElementById("modal-gallery");
        adminGallery.innerHTML = "";
        modalGallery.innerHTML = "";
        works.forEach(work => {
            // Gallerie Admin
            const figAdmin = document.createElement("figure");
            const imgAdmin = document.createElement("img");
            imgAdmin.src = work.imageUrl;
            imgAdmin.alt = work.title;
            const captionAdmin = document.createElement("figcaption");
            captionAdmin.textContent = work.title;
            figAdmin.appendChild(imgAdmin);
            figAdmin.appendChild(captionAdmin);
            adminGallery.appendChild(figAdmin);
            // Gallerie modale
            const figModal = document.createElement("figure");
            const imgModal = document.createElement("img");
            imgModal.src = work.imageUrl;
            imgModal.alt = work.title;
            const deleteIcon = document.createElement("span");
            deleteIcon.textContent = "🗑️";
            deleteIcon.classList.add("delete-icon");
            deleteIcon.dataset.id = work.id;
            figModal.appendChild(imgModal);
            figModal.appendChild(deleteIcon);
            modalGallery.appendChild(figModal);
        });
        document.querySelectorAll(".delete-icon").forEach(icon => {
            icon.addEventListener("click", () => {
                deleteWork(icon.dataset.id);
            });
        });
    }
    async function deleteWork(id) {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            initApp();
        } else {
            console.log("Erreur lors de la suppression :", response.status);
        }
    }
    
    function resetModalState() {
        addPhotoForm.reset();
        previewImage.src = "";
        previewImage.classList.add("hidden");
        modalTitle.textContent = "Galerie photo";
        addPhotoForm.classList.add("hidden");
        modalGalleryWrapper.classList.remove("hidden");
        backBtn.classList.add("hidden");
        validateBtn.disabled = true;
        validateBtn.classList.remove("active");
        categoryInput.value = "";
    }
    
    function initModal() {
        validateBtn.disabled = true;
        validateBtn.classList.remove("active");
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
        addPhotoBtn.addEventListener("click", () => {
            modalTitle.textContent = "Ajout photo";
            modalGalleryWrapper.classList.add("hidden");
            addPhotoForm.classList.remove("hidden");
            backBtn.classList.remove("hidden");
            if (categoryInput.options.length === 0) {
                loadCategories();
            }
        });
        backBtn.addEventListener("click", () => {
            modalTitle.textContent = "Galerie photo";
            addPhotoForm.classList.add("hidden");
            modalGalleryWrapper.classList.remove("hidden");
            backBtn.classList.add("hidden");
        });
        imageInput.addEventListener("change", () => {
            const file = imageInput.files[0];
            if (file) {
                previewImage.src = URL.createObjectURL(file);
                previewImage.classList.remove("hidden");
            }
            checkFormCompletion();
            console.log("ah");
        });
        titleInput.addEventListener("input", checkFormCompletion);
        categoryInput.addEventListener("change", checkFormCompletion);
        addPhotoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const image = imageInput.files[0];
            const title = titleInput.value.trim();
            const category = categoryInput.value;
            if (!image || !title || !category) {
                alert("Veuillez remplir tous les champs.");
                return;
            }
            if (!image.type.startsWith("image/")) {
                alert("Le fichier doit être une image");
                return;
            }
            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", title);
            formData.append("category", category);
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            if (response.ok) {
                initApp();
                resetModalState();
            } else {
                alert("Erreur lors de l’ajout du projet.");
            }
        });
    }
    
    function checkFormCompletion() {
        const titleFilled = titleInput.value.trim() !== "";
        const categoryFilled = categoryInput.value !== "";
        const fileFilled = imageInput.files.length > 0;
        if (titleFilled && categoryFilled && fileFilled) {
            validateBtn.classList.add("active");
            validateBtn.disabled = false;
        } else {
            validateBtn.classList.remove("active");
            validateBtn.disabled = true;
        }
    }
    async function loadCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        const categorySelect = document.getElementById("category-input");
        categorySelect.innerHTML = "";
        // Option vide par défaut
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "";
        emptyOption.disabled = true;
        emptyOption.selected = true;
        categorySelect.appendChild(emptyOption);
        // Catégories réelles
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    }
    // Initialisation 
    async function initApp() {
        const projects = await fetchProjects();
        if (window.isAdmin) {
            displayAdminGallery(projects);
        } else {
            const filters = await fetchFilters();
            displayPublicGallery(projects);
            createFilters(filters, projects);
        }
    }
});