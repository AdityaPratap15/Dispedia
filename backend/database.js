const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const path = require('path');

class DatabaseManager {
    constructor() {
        this.dbPath = path.join(__dirname, 'data.json');
        this.data = {
            admins: [],
            diseases: [],
            nextId: 1
        };
    }

    async init() {
        try {
            // Try to load existing data
            await this.loadData();
            console.log('Database loaded successfully');
            
            // Create default admin if no admins exist
            if (this.data.admins.length === 0) {
                await this.createDefaultAdmin();
            }
            
            return Promise.resolve();
        } catch (error) {
            // If file doesn't exist, create it with default data
            console.log('Creating new database...');
            await this.createDefaultAdmin();
            await this.saveData();
            console.log('Database initialized successfully');
            return Promise.resolve();
        }
    }

    async loadData() {
        try {
            const fileContent = await fs.readFile(this.dbPath, 'utf8');
            this.data = JSON.parse(fileContent);
        } catch (error) {
            throw error;
        }
    }

    async saveData() {
        try {
            await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
        } catch (error) {
            throw error;
        }
    }

    async createDefaultAdmin() {
        try {
            const hashedPassword = bcrypt.hashSync('medic@10', 10);
            const admin = {
                id: 1,
                username: 'ranigarima',
                password: hashedPassword,
                created_at: new Date().toISOString()
            };
            
            this.data.admins.push(admin);
            console.log('Default admin user created (username: ranigarima, password: medic@10)');
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getAdmin(username) {
        try {
            const admin = this.data.admins.find(a => a.username === username);
            return Promise.resolve(admin);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getAllDiseases() {
        try {
            // Sort diseases alphabetically by name
            const sorted = [...this.data.diseases].sort((a, b) => a.name.localeCompare(b.name));
            return Promise.resolve(sorted);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getDiseaseById(id) {
        try {
            const disease = this.data.diseases.find(d => d.id === parseInt(id));
            return Promise.resolve(disease);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async searchDiseases(query) {
        try {
            const searchTerm = query.toLowerCase();
            const results = this.data.diseases.filter(disease => 
                disease.name.toLowerCase().includes(searchTerm) ||
                (disease.description && disease.description.toLowerCase().includes(searchTerm)) ||
                (disease.symptoms && disease.symptoms.toLowerCase().includes(searchTerm))
            );
            // Sort results alphabetically
            results.sort((a, b) => a.name.localeCompare(b.name));
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async addDisease(name, description, symptoms, treatment) {
        try {
            const disease = {
                id: this.data.nextId++,
                name,
                description: description || '',
                symptoms: symptoms || '',
                treatment,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            this.data.diseases.push(disease);
            await this.saveData();
            return Promise.resolve(disease.id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateDisease(id, name, description, symptoms, treatment) {
        try {
            const diseaseIndex = this.data.diseases.findIndex(d => d.id === parseInt(id));
            if (diseaseIndex === -1) {
                throw new Error('Disease not found');
            }
            
            this.data.diseases[diseaseIndex] = {
                ...this.data.diseases[diseaseIndex],
                name,
                description: description || '',
                symptoms: symptoms || '',
                treatment,
                updated_at: new Date().toISOString()
            };
            
            await this.saveData();
            return Promise.resolve(1); // Return 1 to indicate one record was updated
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async deleteDisease(id) {
        try {
            const diseaseIndex = this.data.diseases.findIndex(d => d.id === parseInt(id));
            if (diseaseIndex === -1) {
                throw new Error('Disease not found');
            }
            
            this.data.diseases.splice(diseaseIndex, 1);
            await this.saveData();
            return Promise.resolve(1); // Return 1 to indicate one record was deleted
        } catch (error) {
            return Promise.reject(error);
        }
    }

    close() {
        // No cleanup needed for JSON file storage
    }
}

module.exports = DatabaseManager;