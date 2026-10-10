import mongoose from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    credits : {
        type : Number ,
        required : true
    },
    status :{
        type : String ,
        enum : ["pending" , "granted" , "rejected"],
        required : true ,
        default : "pending"
    }
  },

  {
    timestamps: true,
  },
);

const Credit = mongoose.model("Credit", creditSchema);

export default Credit;
