// Database handling for portfolio website

// Initialize the database
function initDB() {
    return new Promise((resolve, reject) => {
        // Check if localStorage is supported
        if (typeof(Storage) === 'undefined') {
            reject('Local storage is not supported by your browser');
            return;
        }
        
        // Initialize data if it doesn't exist
        if (!localStorage.getItem('portfolioData')) {
            // Create initial data
            const initialData = {
                skills: [
                    { id: 'skill1', name: 'Machine Learning', level: 90 },
                    { id: 'skill2', name: 'Prompt Engineering', level: 85 },
                    { id: 'skill3', name: 'AI Tools Proficiency', level: 80 },
                    { id: 'skill4', name: 'Tableau', level: 75 },
                    { id: 'skill5', name: 'Web Development', level: 80 },
                    { id: 'skill6', name: 'Data Analyst', level: 85 }
                ],
                education: [
                    { 
                        id: 'edu1', 
                        institution: 'Lakireddy Bali Reddy College of Engineering',
                        degree: 'Bachelor of Technology in Artificial Intelligence and Data Science',
                        year: 'Expected: April 2026',
                        grade: 'CGPA: 7.04'
                    },
                    { 
                        id: 'edu2', 
                        institution: 'Sri Sarada Junior College, Nuzvid',
                        degree: 'Intermediate in MPC',
                        year: 'April 2022',
                        grade: 'Percentage: 66.6%'
                    },
                    { 
                        id: 'edu3', 
                        institution: 'Leah Jones High School',
                        degree: 'SSC',
                        year: 'April 2020',
                        grade: 'Percentage: 99.33%'
                    }
                ],
                projects: [
                    {
                        id: 'proj1',
                        title: 'Café Chat Web Page',
                        description: 'Designed a web page on Café Chat using HTML, CSS, Eclipse, and MySQL'
                    },
                    {
                        id: 'proj2',
                        title: 'Agricultural ML Models',
                        description: 'Developed four machine learning models: Crop Prediction, Fertilizer Prediction, Organic Fertilizer Prediction, and Organic Farming Land Suitability'
                    },
                    {
                        id: 'proj3',
                        title: 'College Quality Prediction',
                        description: 'Developed a machine learning model using RandomForestClassifier to predict the quality of a college based on placement, higher studies, and student performance data'
                    },
                    {
                        id: 'proj4',
                        title: 'Smart Robotic Vehicle',
                        description: 'Integrated AI and IoT-Based Smart Robotic Vehicle for Obstacle Avoidance, Remote Surveillance, and Voice-Activated Assistance.'
                    }
                ],
                certifications: [
                    {
                        id: 'cert1',
                        title: 'Full Stack Web Development',
                        issuer: 'Infosys'
                    },
                    {
                        id: 'cert2',
                        title: 'Programming using Java',
                        issuer: 'Infosys'
                    },
                    {
                        id: 'cert3',
                        title: 'HTML5 - The Language',
                        issuer: 'Infosys'
                    },
                    {
                        id: 'cert4',
                        title: 'JavaScript',
                        issuer: 'Infosys'
                    },
                    {
                        id: 'cert5',
                        title: 'Data Analytics with Python',
                        issuer: 'NPTEL'
                    },
                    {
                        id: 'cert6',
                        title: 'The Joy of Computing using Python',
                        issuer: 'NPTEL'
                    },
                    {
                        id: 'cert7',
                        title: 'Data Analytics and Visualization Job Simulation',
                        issuer: 'Accenture'
                    },
                    {
                        id: 'cert8',
                        title: 'Data Visualization – Empowering Business with Effective Insights',
                        issuer: 'TATA'
                    }
                ],
                experience: [
                    {
                        id: 'exp1',
                        company: 'Smart Home and Industrial Solutions',
                        position: 'AI/IoT Intern – Smart Robotic Vehicle Development',
                        period: 'May 2025 – June 2025, Vijayawada, India',
                        description: 'Developed an AI-powered robotic vehicle using Raspberry Pi, integrating ultrasonic sensors and Python for smart navigation. Implemented voice command automation and real-time surveillance features.'
                    },
                    {
                        id: 'exp2',
                        company: 'Bist Technologies',
                        position: 'Machine Learning Intern',
                        period: 'June 2024 – July 2024, Vijayawada, India',
                        description: 'Developed a face detection model that identifies whether the face is positioned to the left, center, or right using machine learning techniques. Collaborated on machine learning workflows and model training.'
                    }
                ],
                activities: [
                    {
                        id: 'act1',
                        description: 'Awarded III Prize in Paper Presentation on Global Recycling Day organized by PRAKRUTHI (March 2025)'
                    },
                    {
                        id: 'act2',
                        description: 'I actively participate in competitions and events. Whether I win or lose, I always give 100% effort.'
                    },
                    {
                        id: 'act3',
                        description: 'Participated in Ideathon, Hackathon, club events'
                    }
                ],
                workshops: [
                    {
                        id: 'workshop1',
                        description: 'Attended a workshop and hackathon on Data Science using Python, organized by Lakireddy Bali Reddy College of Engineering in collaboration with BRAIN O Vision in 2022.'
                    },
                    {
                        id: 'workshop2',
                        description: 'Attended a workshop and hackathon on Python using Flask at Lakireddy Bali Reddy College of Engineering in 2025'
                    }
                ]
            };
            
            // Save initial data to localStorage
            localStorage.setItem('portfolioData', JSON.stringify(initialData));
        }
        
        resolve();
    });
}

// Data loading functions
function loadSkills() {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const skills = data.skills;
    
    const container1 = document.getElementById('skills-container-1');
    const container2 = document.getElementById('skills-container-2');
    
    // Clear containers
    container1.innerHTML = '';
    container2.innerHTML = '';
    
    // Split skills into two columns
    const halfLength = Math.ceil(skills.length / 2);
    
    // First column
    skills.slice(0, halfLength).forEach(skill => {
        container1.innerHTML += `
            <div class="skill-item" data-id="${skill.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="skill">${skill.name}</span>
                    <span>${skill.level}%</span>
                </div>
                <div class="progress-bar-wrap">
                    <div class="progress-bar" role="progressbar" style="width: ${skill.level}%" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="skill-actions">
                    <button class="btn btn-sm btn-primary" onclick="openEditModal('skills', '${skill.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('skills', '${skill.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    // Second column
    skills.slice(halfLength).forEach(skill => {
        container2.innerHTML += `
            <div class="skill-item" data-id="${skill.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="skill">${skill.name}</span>
                    <span>${skill.level}%</span>
                </div>
                <div class="progress-bar-wrap">
                    <div class="progress-bar" role="progressbar" style="width: ${skill.level}%" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="skill-actions">
                    <button class="btn btn-sm btn-primary" onclick="openEditModal('skills', '${skill.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('skills', '${skill.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function loadEducation() {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const education = data.education;
    
    const container = document.getElementById('education-container');
    
    // Clear container
    container.innerHTML = '';
    
    education.forEach(edu => {
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="education-item" data-id="${edu.id}">
                    <h4>${edu.institution}</h4>
                    <h5>${edu.degree}</h5>
                    <p>${edu.year}</p>
                    <p>Grade: ${edu.grade}</p>
                    <div class="education-actions">
                        <button class="btn btn-sm btn-primary" onclick="openEditModal('education', '${edu.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('education', '${edu.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

function loadProjects() {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const projects = data.projects;
    
    const container = document.getElementById('projects-container');
    
    // Clear container
    container.innerHTML = '';
    
    projects.forEach(project => {
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="project-item" data-id="${project.id}">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="project-actions">
                        <button class="btn btn-sm btn-primary" onclick="openEditModal('projects', '${project.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('projects', '${project.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

function loadCertifications() {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const certifications = data.certifications;
    
    const container = document.getElementById('certifications-container');
    
    // Clear container
    container.innerHTML = '';
    
    certifications.forEach(cert => {
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="certification-item" data-id="${cert.id}">
                    <h4>${cert.title}</h4>
                    <p>${cert.issuer}</p>
                    <div class="certification-actions">
                        <button class="btn btn-sm btn-primary" onclick="openEditModal('certifications', '${cert.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('certifications', '${cert.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

function loadExperience() {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const experience = data.experience;
    
    const container = document.getElementById('experience-container');
    
    // Clear container
    container.innerHTML = '';
    
    experience.forEach((exp, index) => {
        container.innerHTML += `
            <li>
                <div class="timeline-image">
                    <h4>${index + 1}</h4>
                </div>
                <div class="timeline-panel" data-id="${exp.id}">
                    <div class="timeline-heading">
                        <h4 class="subheading">${exp.position}</h4>
                        <p>${exp.company}</p>
                        <p class="text-muted">${exp.period}</p>
                    </div>
                    <div class="timeline-body">
                        <p>${exp.description}</p>
                    </div>
                    <div class="experience-actions">
                        <button class="btn btn-sm btn-primary" onclick="openEditModal('experience', '${exp.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('experience', '${exp.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </li>
        `;
    });
}

function loadActivities() {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const activities = data.activities;
    
    const container = document.getElementById('activities-container');
    
    // Clear container
    container.innerHTML = '';
    
    activities.forEach(activity => {
        container.innerHTML += `
            <div class="col-md-6 mb-4">
                <div class="activity-item" data-id="${activity.id}">
                    <p>${activity.description}</p>
                    <div class="activity-actions">
                        <button class="btn btn-sm btn-primary" onclick="openEditModal('activities', '${activity.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('activities', '${activity.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

function loadWorkshops() {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const workshops = data.workshops;
    
    const container = document.getElementById('workshops-container');
    
    // Clear container
    container.innerHTML = '';
    
    workshops.forEach(workshop => {
        container.innerHTML += `
            <div class="col-md-6 mb-4">
                <div class="workshop-item" data-id="${workshop.id}">
                    <p>${workshop.description}</p>
                    <div class="workshop-actions">
                        <button class="btn btn-sm btn-primary" onclick="openEditModal('workshops', '${workshop.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('workshops', '${workshop.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
}

// CRUD Operations for each section

// About section
function updateAbout(content) {
    console.log("About section updated with:", content);
    // No need to update localStorage for the about section as it's static
}

// Skills section
function addSkill(name, level) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const newSkill = {
        id: 'skill' + generateId(),
        name: name,
        level: parseInt(level)
    };
    
    data.skills.push(newSkill);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload skills
    loadSkills();
}

function updateSkill(id, name, level) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const skillIndex = data.skills.findIndex(skill => skill.id === id);
    
    if (skillIndex !== -1) {
        data.skills[skillIndex].name = name;
        data.skills[skillIndex].level = parseInt(level);
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // Reload skills
        loadSkills();
    }
}

// Education section
function addEducation(institution, degree, year, grade) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const newEducation = {
        id: 'edu' + generateId(),
        institution: institution,
        degree: degree,
        year: year,
        grade: grade
    };
    
    data.education.push(newEducation);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload education
    loadEducation();
}

function updateEducation(id, institution, degree, year, grade) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const eduIndex = data.education.findIndex(edu => edu.id === id);
    
    if (eduIndex !== -1) {
        data.education[eduIndex].institution = institution;
        data.education[eduIndex].degree = degree;
        data.education[eduIndex].year = year;
        data.education[eduIndex].grade = grade;
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // Reload education
        loadEducation();
    }
}

// Projects section
function addProject(title, description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const newProject = {
        id: 'proj' + generateId(),
        title: title,
        description: description
    };
    
    data.projects.push(newProject);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload projects
    loadProjects();
}

function updateProject(id, title, description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const projIndex = data.projects.findIndex(project => project.id === id);
    
    if (projIndex !== -1) {
        data.projects[projIndex].title = title;
        data.projects[projIndex].description = description;
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // Reload projects
        loadProjects();
    }
}

// Certifications section
function addCertification(title, issuer) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const newCert = {
        id: 'cert' + generateId(),
        title: title,
        issuer: issuer
    };
    
    data.certifications.push(newCert);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload certifications
    loadCertifications();
}

function updateCertification(id, title, issuer) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const certIndex = data.certifications.findIndex(cert => cert.id === id);
    
    if (certIndex !== -1) {
        data.certifications[certIndex].title = title;
        data.certifications[certIndex].issuer = issuer;
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // Reload certifications
        loadCertifications();
    }
}

// Experience section
function addExperience(company, position, period, description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const newExp = {
        id: 'exp' + generateId(),
        company: company,
        position: position,
        period: period,
        description: description
    };
    
    data.experience.push(newExp);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload experience
    loadExperience();
}

function updateExperience(id, company, position, period, description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const expIndex = data.experience.findIndex(exp => exp.id === id);
    
    if (expIndex !== -1) {
        data.experience[expIndex].company = company;
        data.experience[expIndex].position = position;
        data.experience[expIndex].period = period;
        data.experience[expIndex].description = description;
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // Reload experience
        loadExperience();
    }
}

// Activities section
function addActivity(description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const newActivity = {
        id: 'act' + generateId(),
        description: description
    };
    
    data.activities.push(newActivity);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload activities
    loadActivities();
}

function updateActivity(id, description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const actIndex = data.activities.findIndex(act => act.id === id);
    
    if (actIndex !== -1) {
        data.activities[actIndex].description = description;
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // Reload activities
        loadActivities();
    }
}

// Workshops section
function addWorkshop(description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const newWorkshop = {
        id: 'workshop' + generateId(),
        description: description
    };
    
    data.workshops.push(newWorkshop);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload workshops
    loadWorkshops();
}

function updateWorkshop(id, description) {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const workshopIndex = data.workshops.findIndex(workshop => workshop.id === id);
    
    if (workshopIndex !== -1) {
        data.workshops[workshopIndex].description = description;
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // Reload workshops
        loadWorkshops();
    }
}

// Contact section
function updateContact(email, phone, address, linkedin) {
    // Update DOM elements
    document.querySelector('.contact-info a[href^="mailto:"]').setAttribute('href', `mailto:${email}`);
    document.querySelector('.contact-info a[href^="tel:"]').setAttribute('href', `tel:${phone}`);
    document.querySelector('#contact p').textContent = `Address: ${address}`;
    document.querySelector('.contact-info a[href^="https://www.linkedin.com"]').setAttribute('href', linkedin);
}

// Delete item from any section
function deleteItem(section, id) {
    // --- MODIFIED: Add password check ---
    // Assuming checkAdminLoginStatus and promptForAdminPassword are globally available from main.js, and promptForAdminPassword now handles username.
    if (!checkAdminLoginStatus()) {
        if (!promptForAdminPassword()) {
            return; // Stop deletion if password is incorrect
        }
    }
    if (confirm('Are you sure you want to delete this item?')) {
        const data = JSON.parse(localStorage.getItem('portfolioData'));
        
        // Find and remove the item from the appropriate section
        const index = data[section].findIndex(item => item.id === id);
        
        if (index !== -1) {
            data[section].splice(index, 1);
            localStorage.setItem('portfolioData', JSON.stringify(data));
            
            // Reload the appropriate section
            switch (section) {
                case 'skills':
                    loadSkills();
                    break;
                case 'education':
                    loadEducation();
                    break;
                case 'projects':
                    loadProjects();
                    break;
                case 'certifications':
                    loadCertifications();
                    break;
                case 'experience':
                    loadExperience();
                    break;
                case 'activities':
                    loadActivities();
                    break;
                case 'workshops':
                    loadWorkshops();
                    break;
            }
        }
    }
}
