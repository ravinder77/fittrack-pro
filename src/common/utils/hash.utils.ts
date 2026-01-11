import bcrypt from 'bcrypt';

export const hash = async (plainText: string) => {
  return await bcrypt.hash(plainText, 10);
};

export const compare = async (plainText: string, hashText: string) => {
  return await bcrypt.compare(plainText, hashText);
};
