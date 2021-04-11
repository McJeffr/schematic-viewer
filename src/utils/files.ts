export const getFileNameWithoutExtension = (fileName: string): string => {
  return fileName.split(".").slice(0, -1).join(".");
};

export const getFileExtension = (fileName: string): string | undefined => {
  return fileName.split(".").pop();
};
