export const generateUID = () => {
  return 'uid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
};
