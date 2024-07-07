import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "tutte",
    },
    testolibero: {
      type: String,
      default: "Scrivi qualcosa...",
    },
    email: {
      type: String,
      default: "esempio@mail.com",
    },
    password: {
      type: String,
      default: "xxxxxx",
    },
    
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
// postSchema.pre("save", function(next){
//   if(this.isModified("password")){
//     this.password =  bcrypt.hashSync(this.password, 10);
//     }
//     next()
// });

// postSchema.methods.toJSON = function(){
//   const obj = this.toObject();
//    delete obj.password;
//    obj.confirmPassword
//   return obj;
// }

// Verify password 
// postSchema.methods.comparePassword = async function(yourPassword){
//   return await bcryptjs.compare(yourPassword, this.password);
// }

const Post = mongoose.model("Post", postSchema);

export default Post;
