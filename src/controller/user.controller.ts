import { Request, Response } from 'express';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserById } from '../service/user.service';
import sendEmail from "../utils/mailer";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: 'vahe.karufanyan@gmail.com',
      to: user.email,
      subject: "Please verify your email",
      text: `varification code ${user.verificationCode}. Name: ${user.name}, Id: ${user._id}`,
    });

    return res.send("User successfully created");
  } catch(err: any) {
    if(err.code === 11000){
      return res.status(409).send("User with this email already exists");
    }
    return res.status(500).send(err);
  }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  //find if user is verified
  const user = await findUserById(id);

  if(!user) {
    return res.send("Could not verify user");
  }
  // check if already verified
  if(user.verified){
    return res.send("User is already verified");
  }
  // check if verificationCode matches
  if(user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User successfully verified");
  }

  return res.send("could not verify user");
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}