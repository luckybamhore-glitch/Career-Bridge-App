import axios from "axios";

const fetchAdminOverview = async (token) => {
  const options = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const usersData = await axios.get("/api/admin/users", options);
  const categoriesData = await axios.get("/api/admin/category", options);
  const careersData = await axios.get("/api/admin/career", options);
  const counselorsData = await axios.get("/api/admin/counselors", options);
  const creditsData = await axios.get("/api/admin/credits", options);
  const roadmapsData = await axios.get("/api/admin/roadmaps", options);

  const data = {
    users: usersData.data,
    categories: categoriesData.data,
    careers: careersData.data,
    counselors: counselorsData.data,
    credits: creditsData.data,
    roadmaps: roadmapsData.data,
  };

  return data;
};

const updateUser = async (payload) => {
  const options = {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  };

  const response = await axios.put("/api/admin/" + payload.uid, "_", options);
  return response.data;
};

const addCategory = async (payload) => {
  const options = {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  };

  const response = await axios.post(
    "/api/admin/category",
    { title: payload.title },
    options,
  );
  return response.data;
};

const updateCategory = async (payload) => {
  const options = {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  };

  const response = await axios.put(
    `/api/admin/category/${payload.cid}`,
    { title: payload.title },
    options,
  );
  return response.data;
};

const deleteCategory = async (payload) => {
  const options = {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  };

  const response = await axios.delete(
    `/api/admin/category/${payload.cid}`,
    options,
  );
  return response.data;
};



const updateCounselor = async (payload) => {
 const options = {
        headers: {
            authorization: `Bearer ${payload.token}`,
        },
    }
    const response = await axios.put(
        `/api/admin/counselors/${payload.crid}`,
        { 
            status: payload.status,
        },
        options
    );

    return response.data;
};

const UpdateCredits  = async (payload) => {
 const options = {
        headers: {
            authorization: `Bearer ${payload.token}`,
        },
    }
    const response = await axios.put(
        `/api/admin/credits/${payload.rid}`,
        { 
            status: payload.status,
        },
        options
    );
   

    return response.data;
};

 

const askQuestion = async (payload) => {
  const options = {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  };

  const response = await axios.post(
    "/api/admin/ai",
    { question: payload.text },
    options,
  );

  return response.data;
};

const adminService = {
  fetchAdminOverview,
  updateUser,
  addCategory,
  updateCategory,
  deleteCategory,
  askQuestion,
  updateCounselor ,
  UpdateCredits
};

export default adminService;
