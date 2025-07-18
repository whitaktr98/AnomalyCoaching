/**
 * Personal Training & Coaching Client Management System
 * Handles client creation, data management, and common operations
 */

class ClientManager {
    constructor() {
      this.clients = [];
      this.nextId = 1;
    }
  
    /**
     * Create a new client
     * @param {Object} clientData - Client information
     * @returns {Object} Created client object
     */
    createClient(clientData) {
      const client = {
        id: this.nextId++,
        personalInfo: {
          firstName: clientData.firstName || '',
          lastName: clientData.lastName || '',
          email: clientData.email || '',
          phone: clientData.phone || '',
          dateOfBirth: clientData.dateOfBirth || '',
          emergencyContact: clientData.emergencyContact || {},
          address: clientData.address || {}
        },
        fitnessProfile: {
          height: clientData.height || '',
          weight: clientData.weight || '',
          fitnessLevel: clientData.fitnessLevel || 'beginner', // beginner, intermediate, advanced
          goals: clientData.goals || [], // weight loss, muscle gain, endurance, etc.
          medicalConditions: clientData.medicalConditions || [],
          injuries: clientData.injuries || [],
          preferences: clientData.preferences || {}
        },
        membership: {
          type: clientData.membershipType || 'basic', // basic, premium, elite
          startDate: clientData.startDate || new Date().toISOString().split('T')[0],
          endDate: clientData.endDate || '',
          status: 'active', // active, inactive, suspended
          trainer: clientData.trainer || ''
        },
        progress: {
          measurements: [],
          workouts: [],
          assessments: [],
          notes: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
  
      this.clients.push(client);
      return client;
    }
  
    /**
     * Get client by ID
     * @param {number} id - Client ID
     * @returns {Object|null} Client object or null if not found
     */
    getClientById(id) {
      return this.clients.find(client => client.id === id) || null;
    }
  
    /**
     * Get all clients
     * @param {Object} filters - Optional filters
     * @returns {Array} Array of client objects
     */
    getAllClients(filters = {}) {
      let filteredClients = this.clients;
  
      if (filters.status) {
        filteredClients = filteredClients.filter(client => 
          client.membership.status === filters.status
        );
      }
  
      if (filters.trainer) {
        filteredClients = filteredClients.filter(client => 
          client.membership.trainer === filters.trainer
        );
      }
  
      if (filters.membershipType) {
        filteredClients = filteredClients.filter(client => 
          client.membership.type === filters.membershipType
        );
      }
  
      return filteredClients;
    }
  
    /**
     * Update client information
     * @param {number} id - Client ID
     * @param {Object} updates - Updated fields
     * @returns {Object|null} Updated client or null if not found
     */
    updateClient(id, updates) {
      const client = this.getClientById(id);
      if (!client) return null;
  
      // Deep merge updates
      if (updates.personalInfo) {
        Object.assign(client.personalInfo, updates.personalInfo);
      }
      if (updates.fitnessProfile) {
        Object.assign(client.fitnessProfile, updates.fitnessProfile);
      }
      if (updates.membership) {
        Object.assign(client.membership, updates.membership);
      }
  
      client.updatedAt = new Date().toISOString();
      return client;
    }
  
    /**
     * Delete client
     * @param {number} id - Client ID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteClient(id) {
      const index = this.clients.findIndex(client => client.id === id);
      if (index === -1) return false;
  
      this.clients.splice(index, 1);
      return true;
    }
  
    /**
     * Add progress entry
     * @param {number} clientId - Client ID
     * @param {string} type - Type of progress (measurement, workout, assessment, note)
     * @param {Object} data - Progress data
     * @returns {boolean} True if added, false if client not found
     */
    addProgress(clientId, type, data) {
      const client = this.getClientById(clientId);
      if (!client) return false;
  
      const progressEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...data
      };
  
      switch (type) {
        case 'measurement':
          client.progress.measurements.push(progressEntry);
          break;
        case 'workout':
          client.progress.workouts.push(progressEntry);
          break;
        case 'assessment':
          client.progress.assessments.push(progressEntry);
          break;
        case 'note':
          client.progress.notes.push(progressEntry);
          break;
        default:
          return false;
      }
  
      client.updatedAt = new Date().toISOString();
      return true;
    }
  
    /**
     * Get client progress
     * @param {number} clientId - Client ID
     * @param {string} type - Type of progress to retrieve
     * @returns {Array|null} Progress entries or null if client not found
     */
    getProgress(clientId, type = 'all') {
      const client = this.getClientById(clientId);
      if (!client) return null;
  
      if (type === 'all') {
        return client.progress;
      }
  
      return client.progress[type] || [];
    }
  
    /**
     * Search clients by name or email
     * @param {string} searchTerm - Search term
     * @returns {Array} Matching clients
     */
    searchClients(searchTerm) {
      const term = searchTerm.toLowerCase();
      return this.clients.filter(client => 
        client.personalInfo.firstName.toLowerCase().includes(term) ||
        client.personalInfo.lastName.toLowerCase().includes(term) ||
        client.personalInfo.email.toLowerCase().includes(term)
      );
    }
  
    /**
     * Get clients with expiring memberships
     * @param {number} daysAhead - Number of days to look ahead
     * @returns {Array} Clients with expiring memberships
     */
    getExpiringMemberships(daysAhead = 30) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);
  
      return this.clients.filter(client => {
        if (!client.membership.endDate) return false;
        const endDate = new Date(client.membership.endDate);
        return endDate <= futureDate && client.membership.status === 'active';
      });
    }
  
    /**
     * Export client data to JSON
     * @returns {string} JSON string of all clients
     */
    exportData() {
      return JSON.stringify(this.clients, null, 2);
    }
  
    /**
     * Import client data from JSON
     * @param {string} jsonData - JSON string of client data
     * @returns {boolean} True if successful
     */
    importData(jsonData) {
      try {
        const data = JSON.parse(jsonData);
        this.clients = data;
        // Update nextId to avoid conflicts
        this.nextId = Math.max(...this.clients.map(c => c.id), 0) + 1;
        return true;
      } catch (error) {
        console.error('Error importing data:', error);
        return false;
      }
    }
  
    /**
     * Get client statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
      return {
        totalClients: this.clients.length,
        activeClients: this.clients.filter(c => c.membership.status === 'active').length,
        membershipTypes: {
          basic: this.clients.filter(c => c.membership.type === 'basic').length,
          premium: this.clients.filter(c => c.membership.type === 'premium').length,
          elite: this.clients.filter(c => c.membership.type === 'elite').length
        },
        fitnessLevels: {
          beginner: this.clients.filter(c => c.fitnessProfile.fitnessLevel === 'beginner').length,
          intermediate: this.clients.filter(c => c.fitnessProfile.fitnessLevel === 'intermediate').length,
          advanced: this.clients.filter(c => c.fitnessProfile.fitnessLevel === 'advanced').length
        }
      };
    }
  }
  
  // Usage example and helper functions
  const clientManager = new ClientManager();
  
  /**
   * Helper function to create a sample client
   */
  function createSampleClient() {
    return clientManager.createClient({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      dateOfBirth: '1990-05-15',
      height: '5\'10"',
      weight: '180 lbs',
      fitnessLevel: 'intermediate',
      goals: ['weight loss', 'muscle gain'],
      membershipType: 'premium',
      trainer: 'Jane Smith',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1-555-0124',
        relationship: 'spouse'
      },
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345'
      }
    });
  }
  
  /**
   * Helper function to validate client data
   */
  function validateClientData(clientData) {
    const errors = [];
    
    if (!clientData.firstName) errors.push('First name is required');
    if (!clientData.lastName) errors.push('Last name is required');
    if (!clientData.email) errors.push('Email is required');
    if (clientData.email && !/\S+@\S+\.\S+/.test(clientData.email)) {
      errors.push('Invalid email format');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  // Export for use in other modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClientManager, validateClientData };
  }
  
  // Example usage:
  /*
  const manager = new ClientManager();
  
  // Create a new client
  const newClient = manager.createClient({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '+1-555-0199',
    height: '5\'6"',
    weight: '140 lbs',
    fitnessLevel: 'beginner',
    goals: ['weight loss', 'general fitness'],
    membershipType: 'basic'
  });
  
  // Add progress
  manager.addProgress(newClient.id, 'measurement', {
    weight: '138 lbs',
    bodyFat: '22%',
    notes: 'Great progress this week!'
  });
  
  // Get all clients
  const allClients = manager.getAllClients();
  
  // Search clients
  const searchResults = manager.searchClients('sarah');
  
  // Get statistics
  const stats = manager.getStatistics();
  */