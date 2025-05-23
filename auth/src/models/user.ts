import mongoose from "mongoose";
import { Password } from "../services/password";
import { transform } from "typescript";

//interface to describe the properties to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

//interface the describes the properties and a User Model has (all users)
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

//interface that describes the properties a User Document has (single user)
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    //any additional mongo properties if needed
    //...
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform (doc, ret) {
            delete ret.password;
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };