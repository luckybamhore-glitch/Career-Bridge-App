import Category from "../models/categoryModel.js";
import Counselor from "../models/counselorModel.js";

const becomeACounselor = async (req, res) => {
  let userId = req.user.id;

  const { category, experience } = req.body;

  if (!category || !experience) {
    res.status(409);
    throw new Error("Please Enter All Details.. ");
  }

  let categoryExit = await Category.findById(category)

  if (!categoryExit) {
    res.status(404);
    throw new Error("Category is Not Found");
  }

  if (experience < 2) {
    res.status(409);
    throw new Error("Experience Must be 2 OR 2+");
  }

    const alreadyRequested = await Counselor.findOne({
    user: userId,
  });

   if (alreadyRequested) {
    res.status(409);
    throw new Error(
      "You have already submitted a counselor request. Please wait for admin approval."
    );
  }

  const counselor = await Counselor.create({
    user: userId,
    category,
    experience,
  });
  if (!counselor) {
    res.status(409);
    throw new Error("Counselor is not created...");
  }
  res.status(201).json({
    message: "Counselor Request Raised wait For Admin Approval",
    counselor: counselor,
  });
};


const getActiveCounselors = async(req ,res) => {

  const Counselors = await Counselor.find().populate("user").populate("category")

  if(!Counselors){
    res.status(404)
    throw new Error("Counselors is not Found");
    
  }
    const activeCounselor = Counselors.filter(counselor => counselor.status === "accepted")

  res.status(200).json(Counselors)
  
}

const getCategories = async(req, res) => {

  const categories = await Category.find()
  if(!categories){
    res.status(404)
    throw new Error("Categories is not Found");
  }
  res.status(200).json(categories)
}

const counselorControllers = {
  becomeACounselor,
  getActiveCounselors ,
  getCategories
};

export default counselorControllers;
