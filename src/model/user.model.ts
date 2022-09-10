import { getModelForClass, modelOptions, prop, Severity, pre,  DocumentType } from "@typegoose/typegoose";
import argon2 from 'argon2';

export const privateFields = [
  "password",
  "__v",
  "verificationCode",
  "verified",
];


@pre<User>("save", async function() {
  if(!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password)

  this.password = hash;

  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class User {
  @prop({lowercase: true, required: true, unique: true})
  email: string;

  @prop({required: true})
  name: string;

  @prop({required: true})
  surname: string;

  @prop({required: true})
  password: string;

  @prop({required: true, default: Math.round((Math.random() + 1) * 10000000)})
  verificationCode: string;

  @prop({default: false})
  verified: boolean;


  async validatePassword(this: DocumentType<User>, loginPassword: string) {
    try {
      return await argon2.verify(this.password, loginPassword)
    } catch(err) {
      console.log(`${err} password validation error`);
      return false;
    }
  }
}

const UserModel = getModelForClass(User)

export default UserModel;