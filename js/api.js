// ==========================================
// INFRALENS - API SERVICE
// Centralized backend communication
// ==========================================

const API_BASE_URL = "http://localhost:8000/api";

// Generic GET request
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`GET ${endpoint} failed:`, error);
        throw error;
    }
}

// Generic POST request
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`POST ${endpoint} failed:`, error);
        throw error;
    }
}

// Generic PUT request
async function apiPut(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`PUT ${endpoint} failed:`, error);
        throw error;
    }
}

// Generic DELETE request
async function apiDelete(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`DELETE ${endpoint} failed:`, error);
        throw error;
    }
}


// ==========================================
// INFRALENS API ENDPOINTS
// ==========================================

const API = {

    // Dashboard
    getDashboard: () =>
        apiGet("/dashboard"),

    // Projects
    getProjects: () =>
        apiGet("/projects"),

    getProject: (projectId) =>
        apiGet(`/projects/${projectId}`),

    // Analytics
    getAnalytics: () =>
        apiGet("/analytics"),

    // Data Quality
    getDataQuality: () =>
        apiGet("/data-quality"),

    // Early Warning / Notifications
    getNotifications: () =>
        apiGet("/notifications"),

    // Exclusive Brief
    getExclusiveBrief: () =>
        apiGet("/exclusive-brief")
};x