import Career from "../models/careerModel.js";
import Category from "../models/categoryModel.js";
import Counselor from "../models/counselorModel.js";
import Credit from "../models/creditsModel.js";
import Roadmap from "../models/roadmapModel.js";
import User from "../models/userModels.js";
import Message from "../models/messageModel.js";

const getAllUser = async (req, res) => {
  const allUsers = await User.find();

  if (!allUsers) {
    res.status(404);
    throw new Error("User is not Found");
  }

  res.status(200).json(allUsers);
};

const createCategory = async (req, res) => {
  const { title } = req.body;
  const cleanTitle = title?.trim();
  if (!cleanTitle) {
    res.status(409);
    throw new Error("Please Enter Category Title");
  }

  const exists = await Category.findOne({
    title: { $regex: `^${cleanTitle}$`, $options: "i" },
  });
  if (exists) {
    res.status(409);
    throw new Error("Category Already Exists");
  }

  const category = await Category.create({ title: cleanTitle });

  if (!category) {
    res.status(409);
    throw new Error("Category Not Created! ");
  }
  res.status(201).json(category);
};

const getAllCategory = async (req, res) => {
  const allCategory = await Category.find().sort({ createdAt: -1 });

  if (!allCategory) {
    res.status(404);
    throw new Error("Category is Not Found");
  }
  res.status(200).json(allCategory);
};

const updateCategory = async (req, res) => {
  const { title } = req.body;
  const cleanTitle = title?.trim();
  if (!cleanTitle) {
    res.status(409);
    throw new Error("Please Enter Category Title");
  }

  const category = await Category.findById(req.params.cid);
  if (!category) {
    res.status(404);
    throw new Error("Category Not Found");
  }

  const duplicate = await Category.findOne({
    _id: { $ne: category._id },
    title: { $regex: `^${cleanTitle}$`, $options: "i" },
  });
  if (duplicate) {
    res.status(409);
    throw new Error("Another Category With This Title Already Exists");
  }

  const updated = await Category.findByIdAndUpdate(
    category._id,
    { title: cleanTitle },
    { new: true, runValidators: true },
  );
  res.status(200).json(updated);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.cid);
  if (!category) {
    res.status(404);
    throw new Error("Category Not Found");
  }

  const [careerCount, counselorCount] = await Promise.all([
    Career.countDocuments({ category: category._id }),
    Counselor.countDocuments({ category: category._id }),
  ]);

  if (careerCount > 0 || counselorCount > 0) {
    res.status(409);
    throw new Error(
      `Cannot delete: used by ${careerCount} career(s) and ${counselorCount} counselor(s). Reassign them first.`,
    );
  }

  await Category.findByIdAndDelete(category._id);
  res.status(200).json({ _id: category._id, message: "Category Deleted" });
};

const createCareer = async (req, res) => {
  const { title, description, requiredQualification, duration, salary } =
    req.body;

  if (
    !title ||
    !description ||
    !requiredQualification ||
    !duration ||
    !salary
  ) {
    res.status(409);
    throw new Error("Please Enter All Details!");
  }
  const categoryId = req.params.cid;

  const career = await Career.create({
    category: categoryId,
    title,
    description,
    requiredQualification,
    salary,
    duration,
  });
  if (!career) {
    res.status(409);
    throw new Error("Career Not Create");
  }

  res.status(201).json(career);
};

const getAllCareer = async (req, res) => {
  const allCareers = await Career.find().populate("category");
  if (!allCareers) {
    res.status(404);
    throw new Error("Career Not Found");
  }
  res.status(200).json(allCareers);
};

const getCareerByCategoryId = async (req, res) => {
  // const { cid } = req.params;
  const categoryId = req.params.cid;

  const careers = await Career.find({
    category: categoryId,
  });

  if (careers.length === 0) {
    res.status(404);
    throw new Error("No Career Found");
  }

  res.status(200).json(careers);
};

const getAllCounselor = async (req, res) => {
  const allCounselor = await Counselor.find()
    .populate("user")
    .populate("category");
  if (!allCounselor) {
    res.status(404);
    throw new Error("Counselor Not found");
  }
  res.status(200).json(allCounselor);
};

const updateCounselor = async (req, res) => {
  let counselorId = req.params.cnid;
  const counselor = await Counselor.findById(counselorId);
  if (!counselor) {
    res.status(409);
    throw new Error("Counselor Not Found");
  }

  const UpdatedCounselor = await Counselor.findByIdAndUpdate(
    counselor._id,
    req.body,
    { new: true },
  )
    .populate("user")
    .populate("category");

  if (req.body.status === "accepted") {
    // Role change: STUDENT -> COUNSELOR
    // Permanently delete all old student-counselor messages for this user from MongoDB
    await Message.deleteMany({
      $or: [{ sender: counselor.user }, { receiver: counselor.user }],
    });

    const updateUser = await User.findByIdAndUpdate(
      counselor.user,
      { userType: "COUNSELOR" },
      { new: true },
    );
  }
  res.status(200).json(UpdatedCounselor);
};


const getAllCreditsRequest = async (req, res) => {
  const creditRequest = await Credit.find().populate("user");
  if (!creditRequest) {
    res.status(404);
    throw new Error("Credit Request Not Found");
  }

  res.status(200).json(creditRequest);
};

//   const { status } = req.body;

//   if (!status) {
//     res.status(409);
//     throw new Error("Please Enter Status");
//   }

//   const creditRequest = await Credit.findById(req.params.rid);

//   if (!creditRequest) {
//     res.status(404);
//     throw new Error("Request Not Found");
//   }

//   const user = await User.findById(creditRequest.user);

//   if (!user) {
//     res.status(404);
//     throw new Error("User Not Found");
//   }

//   const updatedCreditRequest = await Credit.findByIdAndUpdate(
//     creditRequest._id,
//     { status },
//     { new: true },
//   );
//   res.status(200).json(updatedCreditRequest);
// };
const updatedCreditRequest = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        res.status(409);
        throw new Error("Please send status");
    }

    const creditRequest = await Credit.findById(req.params.rid);

    if (!creditRequest) {
        res.status(404);
        throw new Error("Credit Request Not Found!");
    }

    // Find User
    const user = await User.findById(creditRequest.user);

    if (!user) {
        res.status(404);
        throw new Error("No User Found!");
    }

    // Idempotent: same status sent twice must not double-grant
    if (creditRequest.status === status) {
        const existing = await Credit.findById(creditRequest._id).populate("user");
        return res.status(200).json(existing);
    }

    // Grant credits only on pending -> granted transition (atomic $inc)
    let updatedUser = user;
    if (status === "granted" && creditRequest.status !== "granted") {
        updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $inc: { credits: creditRequest.credits }
            },
            {
                new: true
            }
        );
    }

    // Update credit request status
    const updatedCreditRequest = await Credit.findByIdAndUpdate(
        creditRequest._id,
        {
            status
        },
        {
            new: true
        }
    ).populate("user");

    // Real-time push so the student's wallet updates without refresh
    try {
        const io = req.app?.get("io");
        if (io && updatedUser && status === "granted") {
            io.to(`user_${String(updatedUser._id)}`).emit("credits_updated", {
                credits: updatedUser.credits,
                requestId: String(updatedCreditRequest._id),
                status: updatedCreditRequest.status,
            });
        }
    } catch {
        // socket emit must never break the HTTP response
    }

    res.status(200).json(updatedCreditRequest);
};
const getAllRoadsMap = async (req, res) => {
  const roadmaps = await Roadmap.find().populate("user");

  if (!roadmaps) {
    res.status(404);
    throw new Error("Roadmap Not Found");
  }

  res.status(200).json(roadmaps);
};

const updateUser = async (req, res) => {
  const userId = req.params.uid;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("user Is Not Found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { isActive: !user.isActive },
    { new: true },
  );

  if (!updatedUser) {
    res.status(409);
    throw new Error("User Not Updated ");
  }
  res.status(200).json(updatedUser);
};

const adminControllers = {
  getAllUser,
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  createCareer,
  getAllCareer,
  getCareerByCategoryId,
  getAllCounselor,
  updateCounselor,
  getAllCreditsRequest,
  updatedCreditRequest,
  getAllRoadsMap,
  updateUser,
};

export default adminControllers;
