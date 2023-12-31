import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const bearer = String(request.headers.authorization).split(' ')[1];
    const jwt = new JwtService();

    if (!bearer) {
      return response.send(
        {
          message: 'Необходимо авторизоваться',
          ok: false,
          status: 401,
        },
        401,
        [],
      );
    }

    const { role } = jwt.verify(bearer, {
      secret: process.env.JWT_SECRET_KEY,
    });

    if (!role) {
      return response.send(
        {
          message: 'Необходимо авторизоваться',
          ok: false,
          status: 401,
        },
        401,
        [],
      );
    }

    return true;
  }
}
