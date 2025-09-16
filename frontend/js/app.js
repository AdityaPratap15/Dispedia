// User interface JavaScript functionality
class SelfTreatApp {
    constructor() {
        this.apiBase = '/api';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadAllDiseases();
    }

    bindEvents() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });

        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => {
            const query = document.getElementById('searchInput').value;
            this.performSearch(query);
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('diseaseModal').addEventListener('click', (e) => {
            if (e.target.id === 'diseaseModal') {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Hide suggestions if query is empty
        if (!query) {
            this.hideSuggestions();
            this.hideSearchResults();
            this.showAllDiseases();
            return;
        }

        // Show suggestions after a delay
        this.searchTimeout = setTimeout(() => {
            this.showSuggestions(query);
        }, 300);
    }

    async showSuggestions(query) {
        if (query.length < 2) return;

        try {
            const response = await fetch(`${this.apiBase}/search?q=${encodeURIComponent(query)}`);
            const diseases = await response.json();
            
            const suggestions = diseases.slice(0, 5); // Show only first 5 suggestions
            this.renderSuggestions(suggestions, query);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        }
    }

    renderSuggestions(diseases, query) {
        const container = document.getElementById('searchSuggestions');
        
        if (diseases.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = diseases.map(disease => `
            <div class="suggestion-item" onclick="app.selectSuggestion('${this.escapeHtml(disease.name)}')">
                <strong>${this.highlightMatch(disease.name, query)}</strong>
                ${disease.description ? `<small>${this.truncateText(disease.description, 80)}</small>` : ''}
            </div>
        `).join('');
        
        container.style.display = 'block';
    }

    selectSuggestion(diseaseName) {
        document.getElementById('searchInput').value = diseaseName;
        this.hideSuggestions();
        this.performSearch(diseaseName);
    }

    hideSuggestions() {
        document.getElementById('searchSuggestions').style.display = 'none';
    }

    async performSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            this.showAllDiseases();
            return;
        }

        this.showLoading();
        this.hideSuggestions();

        try {
            const response = await fetch(`${this.apiBase}/search?q=${encodeURIComponent(query)}`);
            const diseases = await response.json();
            
            this.hideLoading();
            
            if (diseases.length > 0) {
                this.showSearchResults(diseases, query);
                this.hideAllDiseases();
            } else {
                this.showNoResults();
                this.hideAllDiseases();
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.hideLoading();
            this.showNoResults();
        }
    }

    showSearchResults(diseases, query) {
        const section = document.getElementById('searchResults');
        const container = document.getElementById('resultsContainer');
        
        section.querySelector('h2').textContent = `Search Results for "${query}"`;
        container.innerHTML = this.renderDiseaseCards(diseases, query);
        section.style.display = 'block';
        
        document.getElementById('noResults').style.display = 'none';
    }

    hideSearchResults() {
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';
    }

    async loadAllDiseases() {
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBase}/diseases`);
            const diseases = await response.json();
            
            this.hideLoading();
            this.renderAllDiseases(diseases);
        } catch (error) {
            console.error('Failed to load diseases:', error);
            this.hideLoading();
        }
    }

    renderAllDiseases(diseases) {
        const container = document.getElementById('diseasesContainer');
        
        if (diseases.length === 0) {
            container.innerHTML = '<p class="no-diseases">No diseases available at the moment.</p>';
            return;
        }

        container.innerHTML = this.renderDiseaseCards(diseases);
    }

    renderDiseaseCards(diseases, searchQuery = '') {
        return diseases.map(disease => `
            <div class="disease-card user-card" onclick="app.showDiseaseDetails(${disease.id})">
                <div class="disease-header">
                    <h3>${searchQuery ? this.highlightMatch(disease.name, searchQuery) : this.escapeHtml(disease.name)}</h3>
                </div>
                <div class="disease-content">
                    ${disease.description ? `<p class="description">${this.truncateText(disease.description, 120)}</p>` : ''}
                    <p class="treatment-preview"><strong>Treatment:</strong> ${this.truncateText(disease.treatment, 100)}</p>
                </div>
                <div class="disease-footer">
                    <span class="view-details">Click to view details →</span>
                </div>
            </div>
        `).join('');
    }

    async showDiseaseDetails(id) {
        try {
            const response = await fetch(`${this.apiBase}/diseases/${id}`);
            const disease = await response.json();
            
            const modal = document.getElementById('diseaseModal');
            const details = document.getElementById('diseaseDetails');
            
            details.innerHTML = `
                <h2>${this.escapeHtml(disease.name)}</h2>
                ${disease.description ? `
                    <div class="detail-section">
                        <h3>Description</h3>
                        <p>${this.escapeHtml(disease.description)}</p>
                    </div>
                ` : ''}
                ${disease.symptoms ? `
                    <div class="detail-section">
                        <h3>Symptoms</h3>
                        <p>${this.formatText(disease.symptoms)}</p>
                    </div>
                ` : ''}
                <div class="detail-section">
                    <h3>Treatment</h3>
                    <p>${this.formatText(disease.treatment)}</p>
                </div>
                <div class="disclaimer">
                    <p><strong>Disclaimer:</strong> This information is for educational purposes only. Always consult with healthcare professionals for proper medical diagnosis and treatment.</p>
                </div>
            `;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } catch (error) {
            console.error('Failed to load disease details:', error);
            alert('Failed to load disease details. Please try again.');
        }
    }

    closeModal() {
        document.getElementById('diseaseModal').style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    showAllDiseases() {
        document.getElementById('allDiseases').style.display = 'block';
    }

    hideAllDiseases() {
        document.getElementById('allDiseases').style.display = 'none';
    }

    showLoading() {
        document.getElementById('loadingIndicator').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    showNoResults() {
        document.getElementById('noResults').style.display = 'block';
    }

    // Utility functions
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

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return this.escapeHtml(text);
        return this.escapeHtml(text.substring(0, maxLength)) + '...';
    }

    highlightMatch(text, query) {
        const escapedText = this.escapeHtml(text);
        const escapedQuery = this.escapeHtml(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<mark>$1</mark>');
    }

    formatText(text) {
        // Simple text formatting - convert line breaks to paragraphs
        return this.escapeHtml(text).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    }
}

// Initialize the app
const app = new SelfTreatApp();