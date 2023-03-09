import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";

const RoleGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();
      const user = req.user;
      return user.roles.some((role) => roles.includes(role.value));
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
