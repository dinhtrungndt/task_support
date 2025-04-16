import axiosClient from "../api/axiosClient";

const serviceService = {
  // Fetch all services
  async fetchServices() {
    const response = await axiosClient.get("/services");
    return response.data;
  },

  // Add a new service
  async addService(service) {
    const serviceToAdd = {
      ...service,
      price: service.price ? parseFloat(service.price) : 0,
      duration: service.duration ? parseInt(service.duration, 10) : 1,
      status: service.status || "Active",
      features: service.features || [],
    };

    let response;
    try {
      response = await axiosClient.post("/services", serviceToAdd);
    } catch (error) {
      response = await axiosClient.post("/services/add", serviceToAdd);
    }

    return response.data;
  },

  // Update an existing service
  async updateService(service) {
    if (!service._id) {
      throw new Error("Service ID is missing or undefined");
    }

    const response = await axiosClient.put(`/services/${service._id}`, service);
    return response.data;
  },

  // Delete a service by ID
  async deleteService(serviceId) {
    const response = await axiosClient.delete(`/services/${serviceId}`);
    return response.data;
  },

  // Delete multiple services
  async deleteServices(serviceIds) {
    const response = await axiosClient.delete("/services", {
      data: serviceIds,
    });
    return response.data;
  },
};

export default serviceService;