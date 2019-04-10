import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/models/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly _reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this._reflector.get<UserRole[]>('roles', context.getHandler());

        // no specific role required
        if (!roles || roles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const hasRole = () => roles.indexOf(user.role) >= 0;

        if (user && user.role && hasRole()) {
            return true;
        }

        throw new HttpException('You do not have permission', HttpStatus.UNAUTHORIZED);
    }
}
