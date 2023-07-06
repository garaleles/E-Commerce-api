export const getTokenFromHeader = (req) => {
  //get token from header
  const token = req?.headers?.authorization?.split(' ')[1];

  if (token === undefined) {
    return 'Token bulunamadı';
  } else {
    return token;
  }
};
