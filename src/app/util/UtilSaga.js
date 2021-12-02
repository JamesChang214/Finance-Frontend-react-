import base64url from 'base64url';

export function decodeUserIdFromToken(token) {
  const dataPart = token.split('.')[1];
  return JSON.parse(base64url.decode(dataPart)).data.user.id;
}
export function decodeExpirationFromToken(token) {
  const dataPart = token.split('.')[1];
  return JSON.parse(base64url.decode(dataPart)).exp * 1000;
}
