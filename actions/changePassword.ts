import prisma from "@/libs/prismadb";
var bcrypt = require("bcrypt");

export const changePassword = async (
  resetPasswordToken: string,
  password: string,
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const resetPasswordTokenExpiry = user.resetPasswordExpiry;
  if (!resetPasswordTokenExpiry) {
    throw new Error("Token expired");
  }
  const today = new Date();
  if (today > resetPasswordTokenExpiry) {
    throw new Error("Token expired");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      hashedPassword: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });
  return "Password changed successfully";
};
