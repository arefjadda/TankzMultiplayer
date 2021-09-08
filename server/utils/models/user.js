const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Your username is too short!'],
        maxlength: [15, 'Your username is too long!']
    },
    password: {
        type: String,
        minlength: [4, 'Your password is too short!'],
        maxlength: [15, 'Your password is too long!'],
        required: true,
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    }
});

UserSchema.statics.findByNameAndPassword = (name, password) => {

   return User.findOne({name: name}).then((user) => {
       if (!user)
           // did not find user
           return Promise.resolve(null);

       return new Promise((resolve, reject) => {
           bcrypt.compare(password, user.password, (error, result) => {
               if (result) {
                   resolve(user);
               } else {
                   reject('Incorrect password!');
               }

           });
       });
   })
}

/**
 * Before saving it into the database, encrypt the users password
 */
UserSchema.pre('save', function (next) {
    // an instance user of the User model
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hashedPasswrd) => {
                user.password = hashedPasswrd;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };