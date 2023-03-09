import { User } from "../users/users.entity";

export function CheckObjOwnerOrAdmin(objectOwnerId: number, user: User) {
  return (
    objectOwnerId === user.id ||
    user.roles.some((role) => role.value === "admin")
  );
}
