import axiosClient from "../api/axiosClient";

const businessService = {
  // Fetch all businesses
  async fetchBusinesses() {
    const response = await axiosClient.get("/companies");
    return response.data;
  },

  // Add a new business
  async addBusiness(business) {
    const businessToAdd = {
      mst: business.mst,
      name: business.name,
      address: business.address,
    };

    const response = await axiosClient.post("/companies/add", businessToAdd);
    return response.data;
  },

  // Update an existing business
  async updateBusiness(business) {
    if (!business._id) {
      throw new Error("Business ID is missing or undefined");
    }

    const businessToUpdate = {
      mst: business.mst,
      name: business.name,
      address: business.address,
    };

    const response = await axiosClient.put(`/companies/${business._id}`, businessToUpdate);
    return { ...response.data, _id: business._id };
  },

  // Delete businesses
  async deleteBusinesses(businessIds) {
    const response = await axiosClient.delete("/companies", {
      data: businessIds,
    });
    return response.data;
  },
};

export default businessService;