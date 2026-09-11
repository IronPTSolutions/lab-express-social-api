const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // TODO Iteracion 1: Definir los campos del esquema
    // name:     String, required
    name: {
      type: String,
      required: "Name is required"
    },
    // username: String, required, trim, unique
    username: {
      type: String,
      required: "Username is required",
      trim: true,
      unique: true
    },
    // email:    String, required, trim, lowercase, match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    email: {
      type: String,
      required: "Email is required",
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    // password: String, required, trim, match: [/^.{8,}$/, "Min 8 characters"]
    password: {
      type: String,
      required: "Password is required",
      trim: true,
      match: [/^.{8,}$/, "Min 8 characters"],
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // TODO Iteracion 1: Anadir transform para:
      //   - Exponer id (ret.id = ret._id.toString())
      //   - Eliminar _id, __v y password
      transform: (doc, ret) => {
        ret.id = ret._id.toString();

        delete ret.password;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// TODO Iteracion 1: Virtual "posts"
//   Devuelve todos los Post cuyo author sea igual al _id de este usuario
 userSchema.virtual("posts", {
   ref: "Post",
   localField: "_id",
   foreignField: "author",
 });


// TODO Iteracion 1: Pre-save hook
//   Antes de guardar, si password fue modificado, hashea con bcrypt (salt 10)
// userSchema.pre("save", async function () { ... });

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

// TODO Iteracion 1: Metodo de instancia checkPassword(plain)
//   Compara la password en texto plano con this.password usando bcrypt.compare
 userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.password)
 };

module.exports = mongoose.model("User", userSchema);
