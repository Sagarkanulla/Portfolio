// Main JavaScript file for portfolio website

// --- NEW: Password Protection Variables and Functions ---
const ADMIN_USERNAME = "kvs"; // The predefined username
const ADMIN_PASSWORD = "5488"; // The predefined password
const IS_ADMIN_LOGGED_IN_KEY = "isAdminLoggedIn"; // Key for sessionStorage

/**
 * Checks if the admin is currently logged in.
 * @returns {boolean} True if logged in, false otherwise.
 */
function checkAdminLoginStatus() {
    return sessionStorage.getItem(IS_ADMIN_LOGGED_IN_KEY) === 'true';
}

/**
 * Prompts the user for the admin password.
 * If correct, sets the login status in sessionStorage and provides feedback.
 * @returns {boolean} True if password is correct, false otherwise.
 */
function promptForAdminPassword() {
    const enteredUsername = prompt("Please enter the admin username:");
    if (enteredUsername === null) return false; // User cancelled
    const enteredPassword = prompt("Please enter the admin password to modify content:");
    if (enteredPassword === null) return false; // User cancelled

    if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
        sessionStorage.setItem(IS_ADMIN_LOGGED_IN_KEY, 'true');
        alert("Login successful! You can now modify content.");
        return true;
    } else {
        alert("Incorrect username or password. Modification not allowed.");
        return false;
    }
}
// --- END NEW ---

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the database
    initDB().then(() => {
        // Load all data from the database
        loadAllData();
    }).catch(error => {
        console.error('Error initializing database:', error);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a.nav-link, a.scrollto').forEach(link => {
        if (link.hash && link.hash !== '') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.hash.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 60,
                        behavior: 'smooth'
                    });

                    // Update URL hash
                    history.pushState(null, null, this.hash);
                }
            });
        }
    });

    // Add event listeners for edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            openEditModal(section);
        });
    });

    // Add event listeners for add buttons
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            openAddModal(section);
        });
    });

    // Save changes button in modal
    document.getElementById('saveChanges').addEventListener('click', function() {
        const modalType = document.getElementById('editModal').getAttribute('data-modal-type');
        const sectionType = document.getElementById('editModal').getAttribute('data-section');

        if (modalType === 'edit') {
            saveEditedContent(sectionType);
        } else if (modalType === 'add') {
            addNewContent(sectionType);
        }
    });
});

// Function to open edit modal
function openEditModal(section, itemId = null) {
    // --- NEW: Admin login check ---
    if (!checkAdminLoginStatus()) {
        if (!promptForAdminPassword()) {
            return; // Stop if login failed
        }
    }

    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('editModalLabel');
    const modalBody = document.getElementById('modalBody');

    // Set modal attributes
    modal.setAttribute('data-modal-type', 'edit');
    modal.setAttribute('data-section', section);
    if (itemId) {
        modal.setAttribute('data-item-id', itemId);
    }

    // Set modal title
    modalTitle.textContent = `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}`;

    // Clear modal body
    modalBody.innerHTML = '';

    // Generate form based on section
    switch (section) {
        case 'about':
            generateAboutForm(modalBody);
            break;
        case 'skills':
            generateSkillForm(modalBody, itemId);
            break;
        case 'education':
            generateEducationForm(modalBody, itemId);
            break;
        case 'projects':
            generateProjectForm(modalBody, itemId);
            break;
        case 'certifications':
            generateCertificationForm(modalBody, itemId);
            break;
        case 'experience':
            generateExperienceForm(modalBody, itemId);
            break;
        case 'activities':
            generateActivityForm(modalBody, itemId);
            break;
        case 'workshops':
            generateWorkshopForm(modalBody, itemId);
            break;
        case 'contact':
            generateContactForm(modalBody);
            break;
    }

    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Function to open add modal
function openAddModal(section) {
    // --- NEW: Admin login check ---
    if (!checkAdminLoginStatus()) {
        if (!promptForAdminPassword()) {
            return; // Stop if login failed
        }
    }

    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('editModalLabel');
    const modalBody = document.getElementById('modalBody');

    // Set modal attributes
    modal.setAttribute('data-modal-type', 'add');
    modal.setAttribute('data-section', section);

    // Set modal title
    modalTitle.textContent = `Add New ${section.charAt(0).toUpperCase() + section.slice(1)}`;

    // Clear modal body
    modalBody.innerHTML = '';

    // Generate form based on section
    switch (section) {
        case 'skills':
            generateSkillForm(modalBody);
            break;
        case 'education':
            generateEducationForm(modalBody);
            break;
        case 'projects':
            generateProjectForm(modalBody);
            break;
        case 'certifications':
            generateCertificationForm(modalBody);
            break;
        case 'experience':
            generateExperienceForm(modalBody);
            break;
        case 'activities':
            generateActivityForm(modalBody);
            break;
        case 'workshops':
            generateWorkshopForm(modalBody);
            break;
    }

    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Function to save edited content
function saveEditedContent(section) {
    const modal = document.getElementById('editModal');
    const itemId = modal.getAttribute('data-item-id');

    switch (section) {
        case 'about':
            const aboutContent = document.getElementById('aboutContent').value;
            document.getElementById('about-content').textContent = aboutContent;
            updateAbout(aboutContent);
            break;
        case 'skills':
            const skillName = document.getElementById('skillName').value;
            const skillLevel = document.getElementById('skillLevel').value;
            updateSkill(itemId, skillName, skillLevel);
            break;
        case 'education':
            const institution = document.getElementById('institution').value;
            const degree = document.getElementById('degree').value;
            const eduYear = document.getElementById('eduYear').value;
            const eduGrade = document.getElementById('eduGrade').value;
            updateEducation(itemId, institution, degree, eduYear, eduGrade);
            break;
        case 'projects':
            const projectTitle = document.getElementById('projectTitle').value;
            const projectDescription = document.getElementById('projectDescription').value;
            updateProject(itemId, projectTitle, projectDescription);
            break;
        case 'certifications':
            const certTitle = document.getElementById('certTitle').value;
            const certIssuer = document.getElementById('certIssuer').value;
            updateCertification(itemId, certTitle, certIssuer);
            break;
        case 'experience':
            const company = document.getElementById('company').value;
            const position = document.getElementById('position').value;
            const expPeriod = document.getElementById('expPeriod').value;
            const expDescription = document.getElementById('expDescription').value;
            updateExperience(itemId, company, position, expPeriod, expDescription);
            break;
        case 'activities':
            const activityDescription = document.getElementById('activityDescription').value;
            updateActivity(itemId, activityDescription);
            break;
        case 'workshops':
            const workshopDescription = document.getElementById('workshopDescription').value;
            updateWorkshop(itemId, workshopDescription);
            break;
        case 'contact':
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const linkedin = document.getElementById('linkedin').value;
            updateContact(email, phone, address, linkedin);
            break;
    }

    // Close modal
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
}

// Function to add new content
function addNewContent(section) {
    switch (section) {
        case 'skills':
            const skillName = document.getElementById('skillName').value;
            const skillLevel = document.getElementById('skillLevel').value;
            addSkill(skillName, skillLevel);
            break;
        case 'education':
            const institution = document.getElementById('institution').value;
            const degree = document.getElementById('degree').value;
            const eduYear = document.getElementById('eduYear').value;
            const eduGrade = document.getElementById('eduGrade').value;
            addEducation(institution, degree, eduYear, eduGrade);
            break;
        case 'projects':
            const projectTitle = document.getElementById('projectTitle').value;
            const projectDescription = document.getElementById('projectDescription').value;
            addProject(projectTitle, projectDescription);
            break;
        case 'certifications':
            const certTitle = document.getElementById('certTitle').value;
            const certIssuer = document.getElementById('certIssuer').value;
            addCertification(certTitle, certIssuer);
            break;
        case 'experience':
            const company = document.getElementById('company').value;
            const position = document.getElementById('position').value;
            const expPeriod = document.getElementById('expPeriod').value;
            const expDescription = document.getElementById('expDescription').value;
            addExperience(company, position, expPeriod, expDescription);
            break;
        case 'activities':
            const activityDescription = document.getElementById('activityDescription').value;
            addActivity(activityDescription);
            break;
        case 'workshops':
            const workshopDescription = document.getElementById('workshopDescription').value;
            addWorkshop(workshopDescription);
            break;
    }

    // Close modal
    const modal = document.getElementById('editModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
}

// Form generation functions with examples and help text

function generateAboutForm(container) {
    const content = document.getElementById('about-content').textContent.trim();

    container.innerHTML = `
        <div class="mb-3">
            <label for="aboutContent" class="form-label">
                <span>About Content</span>
                <span class="text-muted small">(e.g., Brief summary about yourself)</span>
            </label>
            <textarea class="form-control" id="aboutContent" rows="5" placeholder="e.g., I am a passionate AI and Data Science student...">${content}</textarea>
            <div class="form-text">Write a short description about yourself.</div>
        </div>
    `;
}

function generateSkillForm(container, itemId = null) {
    let skill = { name: '', level: 50 };

    if (itemId) {
        // Get skill data from DOM or database
        const skillElement = document.querySelector(`.skill-item[data-id="${itemId}"]`);
        if (skillElement) {
            skill.name = skillElement.querySelector('.skill').textContent.trim();
            skill.level = parseInt(skillElement.querySelector('.progress-bar').style.width) || 50;
        }
    }

    container.innerHTML = `
        <div class="mb-3">
            <label for="skillName" class="form-label">
                <span>Skill Name</span>
                <span class="text-muted small">(e.g., Python programming)</span>
            </label>
            <input type="text" class="form-control" id="skillName" value="${skill.name}" placeholder="e.g., Python programming">
            <div class="form-text">Enter the skill, e.g., Python programming or HTML5.</div>
        </div>
        <div class="mb-3">
            <label for="skillLevel" class="form-label">
                <span>Skill Level (0-100)</span>
                <span class="text-muted small">(e.g., 80%)</span>
            </label>
            <input type="range" class="form-range" id="skillLevel" min="0" max="100" value="${skill.level}">
            <output for="skillLevel">${skill.level}%</output>
            <div class="form-text">Drag slider to indicate your proficiency, e.g., 80%.</div>
        </div>
    `;

    container.querySelector('#skillLevel').addEventListener('input', function() {
        container.querySelector('output').textContent = this.value + '%';
    });
}

function generateEducationForm(container, itemId = null) {
    let education = { institution: '', degree: '', year: '', grade: '' };

    if (itemId) {
        const eduElement = document.querySelector(`.education-item[data-id="${itemId}"]`);
        if (eduElement) {
            education.institution = eduElement.querySelector('h4').textContent.trim();
            education.degree = eduElement.querySelector('h5').textContent.trim();
            const details = eduElement.querySelectorAll('p');
            education.year = details[0]?.textContent.trim() || '';
            education.grade = (details[1]?.textContent.trim() || '').replace('Grade: ', '');
        }
    }

    container.innerHTML = `
        <div class="mb-3">
            <label for="institution" class="form-label">
                <span>Institution</span>
                <span class="text-muted small">(e.g., University of Agriculture)</span>
            </label>
            <input type="text" class="form-control" id="institution" value="${education.institution}" placeholder="e.g., University of Agriculture">
            <div class="form-text">Enter the name of your institution.</div>
        </div>
        <div class="mb-3">
            <label for="degree" class="form-label">
                <span>Degree/Course</span>
                <span class="text-muted small">(e.g., B.Sc. in Agriculture)</span>
            </label>
            <input type="text" class="form-control" id="degree" value="${education.degree}" placeholder="e.g., B.Sc. in Agriculture">
            <div class="form-text">Enter your degree or course name.</div>
        </div>
        <div class="mb-3">
            <label for="eduYear" class="form-label">
                <span>Year/Period</span>
                <span class="text-muted small">(e.g., 2017 - 2021)</span>
            </label>
            <input type="text" class="form-control" id="eduYear" value="${education.year}" placeholder="e.g., 2017 - 2021">
            <div class="form-text">Enter the years or period attended.</div>
        </div>
        <div class="mb-3">
            <label for="eduGrade" class="form-label">
                <span>Grade/Percentage</span>
                <span class="text-muted small">(e.g., 85%)</span>
            </label>
            <input type="text" class="form-control" id="eduGrade" value="${education.grade}" placeholder="e.g., 85%">
            <div class="form-text">Enter your grade or percentage.</div>
        </div>
    `;
}

function generateProjectForm(container, itemId = null) {
    let project = { title: '', description: '' };

    if (itemId) {
        const projectElement = document.querySelector(`.project-item[data-id="${itemId}"]`);
        if (projectElement) {
            project.title = projectElement.querySelector('h4').textContent.trim();
            project.description = projectElement.querySelector('p').textContent.trim();
        }
    }

    container.innerHTML = `
        <div class="mb-3">
            <label for="projectTitle" class="form-label">
                <span>Project Title</span>
                <span class="text-muted small">(e.g., Crop Prediction App)</span>
            </label>
            <input type="text" class="form-control" id="projectTitle" value="${project.title}" placeholder="e.g., Crop Prediction App">
            <div class="form-text">Enter the title of your project.</div>
        </div>
        <div class="mb-3">
            <label for="projectDescription" class="form-label">
                <span>Project Description</span>
                <span class="text-muted small">(e.g., Developed a web app for predicting crop yields.)</span>
            </label>
            <textarea class="form-control" id="projectDescription" rows="3" placeholder="e.g., Developed a web app for predicting crop yields.">${project.description}</textarea>
            <div class="form-text">Describe your project briefly.</div>
        </div>
    `;
}

function generateCertificationForm(container, itemId = null) {
    let certification = { title: '', issuer: '' };

    if (itemId) {
        const certElement = document.querySelector(`.certification-item[data-id="${itemId}"]`);
        if (certElement) {
            certification.title = certElement.querySelector('h4').textContent.trim();
            certification.issuer = certElement.querySelector('p').textContent.trim();
        }
    }

    container.innerHTML = `
        <div class="mb-3">
            <label for="certTitle" class="form-label">
                <span>Certification Title</span>
                <span class="text-muted small">(e.g., Data Science Professional Certificate)</span>
            </label>
            <input type="text" class="form-control" id="certTitle" value="${certification.title}" placeholder="e.g., Data Science Professional Certificate">
            <div class="form-text">Enter the certification title.</div>
        </div>
        <div class="mb-3">
            <label for="certIssuer" class="form-label">
                <span>Issuer</span>
                <span class="text-muted small">(e.g., Coursera)</span>
            </label>
            <input type="text" class="form-control" id="certIssuer" value="${certification.issuer}" placeholder="e.g., Coursera">
            <div class="form-text">Enter the name of the certification issuer.</div>
        </div>
    `;
}

function generateExperienceForm(container, itemId = null) {
    let experience = { company: '', position: '', period: '', description: '' };

    if (itemId) {
        const expElement = document.querySelector(`.timeline-panel[data-id="${itemId}"]`);
        if (expElement) {
            experience.position = expElement.querySelector('.subheading').textContent.trim();
            experience.company = expElement.querySelector('.timeline-heading p').textContent.trim();
            experience.period = expElement.querySelector('.text-muted').textContent.trim();
            experience.description = expElement.querySelector('.timeline-body p').textContent.trim();
        }
    }

    container.innerHTML = `
        <div class="mb-3">
            <label for="company" class="form-label">
                <span>Company/Organization</span>
                <span class="text-muted small">(e.g., Infosys)</span>
            </label>
            <input type="text" class="form-control" id="company" value="${experience.company}" placeholder="e.g., Infosys">
            <div class="form-text">Enter the name of the company or organization.</div>
        </div>
        <div class="mb-3">
            <label for="position" class="form-label">
                <span>Position</span>
                <span class="text-muted small">(e.g., Machine Learning Intern)</span>
            </label>
            <input type="text" class="form-control" id="position" value="${experience.position}" placeholder="e.g., Machine Learning Intern">
            <div class="form-text">Your job title or role.</div>
        </div>
        <div class="mb-3">
            <label for="expPeriod" class="form-label">
                <span>Period</span>
                <span class="text-muted small">(e.g., Jan 2023 - Dec 2023)</span>
            </label>
            <input type="text" class="form-control" id="expPeriod" value="${experience.period}" placeholder="e.g., Jan 2023 - Dec 2023">
            <div class="form-text">Duration of employment.</div>
        </div>
        <div class="mb-3">
            <label for="expDescription" class="form-label">
                <span>Description</span>
                <span class="text-muted small">(e.g., Developed ML models for predictive analytics.)</span>
            </label>
            <textarea class="form-control" id="expDescription" rows="3" placeholder="e.g., Developed ML models for predictive analytics.">${experience.description}</textarea>
            <div class="form-text">Summarize your work and achievements.</div>
        </div>
    `;
}

function generateActivityForm(container, itemId = null) {
    let activity = { description: '' };

    if (itemId) {
        const activityElement = document.querySelector(`.activity-item[data-id="${itemId}"]`);
        if (activityElement) {
            activity.description = activityElement.querySelector('p').textContent.trim();
        }
    }

    container.innerHTML = `
        <div class="mb-3">
            <label for="activityDescription" class="form-label">
                <span>Activity Description</span>
                <span class="text-muted small">(e.g., Debate Club President)</span>
            </label>
            <textarea class="form-control" id="activityDescription" rows="3" placeholder="e.g., Debate Club President">${activity.description}</textarea>
            <div class="form-text">Describe your extra-curricular or community activities.</div>
        </div>
    `;
}

function generateWorkshopForm(container, itemId = null) {
    let workshop = { description: '' };

    if (itemId) {
        const workshopElement = document.querySelector(`.workshop-item[data-id="${itemId}"]`);
        if (workshopElement) {
            workshop.description = workshopElement.querySelector('p').textContent.trim();
        }
    }

    container.innerHTML = `
        <div class="mb-3">
            <label for="workshopDescription" class="form-label">
                <span>Workshop Description</span>
                <span class="text-muted small">(e.g., AI in Agriculture Workshop)</span>
            </label>
            <textarea class="form-control" id="workshopDescription" rows="3" placeholder="e.g., AI in Agriculture Workshop">${workshop.description}</textarea>
            <div class="form-text">Describe workshops or training you have attended.</div>
        </div>
    `;
}

function generateContactForm(container) {
    const emailLink = document.querySelector('.contact-info a[href^="mailto:"]')?.getAttribute('href').replace('mailto:', '') || '';
    const phoneLink = document.querySelector('.contact-info a[href^="tel:"]')?.getAttribute('href').replace('tel:', '') || '';
    const addressElement = document.querySelector('#contact p');
    const address = addressElement ? addressElement.textContent.replace('Address: ', '') : '';
    const linkedinLink = document.querySelector('.contact-info a[href^="https://www.linkedin.com"]')?.getAttribute('href') || '';

    container.innerHTML = `
        <div class="mb-3">
            <label for="email" class="form-label">
                <span>Email</span>
                <span class="text-muted small">(e.g., you@example.com)</span>
            </label>
            <input type="email" class="form-control" id="email" value="${emailLink}" placeholder="e.g., you@example.com">
            <div class="form-text">Enter your contact email.</div>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">
                <span>Phone</span>
                <span class="text-muted small">(e.g., +91 98765 43210)</span>
            </label>
            <input type="text" class="form-control" id="phone" value="${phoneLink}" placeholder="e.g., +91 98765 43210">
            <div class="form-text">Enter your phone number.</div>
        </div>
        <div class="mb-3">
            <label for="address" class="form-label">
                <span>Address</span>
                <span class="text-muted small">(e.g., Edara, India 521211)</span>
            </label>
            <input type="text" class="form-control" id="address" value="${address}" placeholder="e.g., Edara, India 521211">
            <div class="form-text">Enter your address or location.</div>
        </div>
        <div class="mb-3">
            <label for="linkedin" class="form-label">
                <span>LinkedIn URL</span>
                <span class="text-muted small">(e.g., https://linkedin.com/in/yourprofile)</span>
            </label>
            <input type="text" class="form-control" id="linkedin" value="${linkedinLink}" placeholder="e.g., https://linkedin.com/in/yourprofile">
            <div class="form-text">Enter your LinkedIn profile URL.</div>
        </div>
    `;
}

// Function to load all data
function loadAllData() {
    loadSkills();
    loadEducation();
    loadProjects();
    loadCertifications();
    loadExperience();
    loadActivities();
    loadWorkshops();
}

// Utility function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}