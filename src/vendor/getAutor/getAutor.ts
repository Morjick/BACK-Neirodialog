import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/user/models/UserModel';

async function getAutor(headers: any) {
  const bearer = String(headers.authorization).split(' ')[1];
  const jwt = new JwtService();

  if (!bearer) {
    return {
      ok: false,
      autor: null,
      status: 401,
    };
  }

  const { role, name, id, lastname } = jwt.verify(bearer, {
    secret: process.env.JWT_SECRET_KEY,
  });

  const autor = await UserModel.findOne({ where: { id } });

  return {
    ok: true,
    autor,
    role,
    firstname: name,
    lastname,
    id,
    banned: autor.banned,
    banReason: autor.banReason,
  };
}

export { getAutor };
