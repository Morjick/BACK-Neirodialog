import { UserModel } from 'src/user/models/UserModel';
import * as bcrypt from 'bcrypt';

export const findOrCreateRootUser = async () => {
  try {
    const [user, created] = await UserModel.findOrCreate({
      where: { email: process.env.ROOT_USER_email },
      defaults: {
        email: process.env.ROOT_USER_email,
        password: await bcrypt.hash(process.env.ROOT_USER_PASSWORD, 10),
        role: 'ROOT',
        firstname: 'Neirodialog',
        lastname: 'Online',
      },
    });
    console.log(created);

    return user;
  } catch (e) {
    console.warn(e);
  }
};
