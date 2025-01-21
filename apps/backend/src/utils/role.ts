import { Role } from '@prisma/client';

export const roles = {
  DEVELOPER: 1,
  SCRUM_MASTER: 2,
  PRODUCT_OWNER: 4,
}

export const getRolesFromBitmask = (bitmask: number): Role[] => {
  return Object.keys(roles).filter((role) => (bitmask & roles[role as keyof typeof roles]) !== 0) as Role[];
}