

interface JWTPayload {
  userId: string;
  name: string;
  iat: number;
  exp: number;
}