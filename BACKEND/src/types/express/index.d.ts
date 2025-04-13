// types/express/index.d.ts
import { UserRole } from "@prisma/client";

declare namespace Express {
  export interface Request {
    userId?: string;
    userRole?: UserRole;
  }
}
