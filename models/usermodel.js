import { mongoose, Schema } from "mongoose";
const userSchema = Schema({
  username: {
    required: true,
    type: Schema.Types.Mixed,
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
        
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    required: true,
    type: Schema.Types.Mixed,
  },
});


const User = mongoose.model("users", userSchema)

export default User
