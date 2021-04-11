export default function decodeTokenData(token) {
  if (!token) {
    return null;
  }
  const tokenPieces = token.split(".");
  const tokenBase64 = tokenPieces[1];
  const decodedToken = atob(tokenBase64);

  return JSON.parse(decodedToken);
}
