// Admin JavaScript functionality
class AdminApp {
    constructor() {
        this.apiBase = '/api';
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        
        // Add disease button
        document.getElementById('addDiseaseBtn').addEventListener('click', () => this.showDiseaseForm());
        
        // Disease form
        document.getElementById('diseaseFormElement').addEventListener('submit', (e) => this.handleDiseaseSubmit(e));
        
        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideDiseaseForm());
    }

    async checkAuthStatus() {
        try {
            const response = await fetch(`${this.apiBase}/admin/check`);
            const data = await response.json();
            
            if (data.authenticated) {
                this.showDashboard();
                this.loadDiseases();
            } else {
                this.showLogin();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showLogin();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch(`${this.apiBase}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                this.showDashboard();
                this.loadDiseases();
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }

    async handleLogout() {
        try {
            await fetch(`${this.apiBase}/admin/logout`, { method: 'POST' });
            this.showLogin();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    showLogin() {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
        document.getElementById('loginForm').reset();
    }

    showDashboard() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
    }

    showDiseaseForm(disease = null) {
        const form = document.getElementById('diseaseForm');
        const title = document.getElementById('formTitle');
        
        if (disease) {
            title.textContent = 'Edit Disease';
            document.getElementById('diseaseId').value = disease.id;
            document.getElementById('diseaseName').value = disease.name;
            document.getElementById('diseaseDescription').value = disease.description || '';
            document.getElementById('diseaseSymptoms').value = disease.symptoms || '';
            document.getElementById('diseaseTreatment').value = disease.treatment;
            this.currentEditingId = disease.id;
        } else {
            title.textContent = 'Add New Disease';
            document.getElementById('diseaseFormElement').reset();
            document.getElementById('diseaseId').value = '';
            this.currentEditingId = null;
        }
        
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }

    hideDiseaseForm() {
        document.getElementById('diseaseForm').style.display = 'none';
        document.getElementById('diseaseFormElement').reset();
        this.currentEditingId = null;
    }

    async handleDiseaseSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const diseaseData = {
            name: formData.get('name'),
            description: formData.get('description'),
            symptoms: formData.get('symptoms'),
            treatment: formData.get('treatment')
        };

        try {
            let response;
            if (this.currentEditingId) {
                // Update existing disease
                response = await fetch(`${this.apiBase}/admin/diseases/${this.currentEditingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(diseaseData)
                });
            } else {
                // Add new disease
                response = await fetch(`${this.apiBase}/admin/diseases`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(diseaseData)
                });
            }

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                this.hideDiseaseForm();
                this.loadDiseases();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Disease save error:', error);
            alert('Failed to save disease. Please try again.');
        }
    }

    async loadDiseases() {
        try {
            const response = await fetch(`${this.apiBase}/diseases`);
            const diseases = await response.json();
            this.renderDiseases(diseases);
        } catch (error) {
            console.error('Failed to load diseases:', error);
        }
    }

    renderDiseases(diseases) {
        const container = document.getElementById('diseasesGrid');
        
        if (diseases.length === 0) {
            container.innerHTML = '<p class="no-diseases">No diseases found. Add your first disease!</p>';
            return;
        }

        container.innerHTML = diseases.map(disease => `
            <div class="disease-card">
                <div class="disease-header">
                    <h4>${this.escapeHtml(disease.name)}</h4>
                    <div class="disease-actions">
                        <button class="btn btn-sm btn-secondary" onclick="adminApp.editDisease(${disease.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="adminApp.deleteDisease(${disease.id})">Delete</button>
                    </div>
                </div>
                <div class="disease-content">
                    ${disease.description ? `<p><strong>Description:</strong> ${this.escapeHtml(disease.description)}</p>` : ''}
                    ${disease.symptoms ? `<p><strong>Symptoms:</strong> ${this.escapeHtml(disease.symptoms)}</p>` : ''}
                    <p><strong>Treatment:</strong> ${this.escapeHtml(disease.treatment)}</p>
                </div>
            </div>
        `).join('');
    }

    async editDisease(id) {
        try {
            const response = await fetch(`${this.apiBase}/diseases/${id}`);
            const disease = await response.json();
            this.showDiseaseForm(disease);
        } catch (error) {
            console.error('Failed to load disease for editing:', error);
            alert('Failed to load disease details.');
        }
    }

    async deleteDisease(id) {
        if (!confirm('Are you sure you want to delete this disease? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/admin/diseases/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                alert('Disease deleted successfully.');
                this.loadDiseases();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete disease. Please try again.');
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the admin app
const adminApp = new AdminApp();