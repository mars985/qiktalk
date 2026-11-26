import { fileSizeLimit, fileSizeLimitMB, imageMimeTypes } from "@/constants/file.constants";

export const getImageFileError = (file: File) => {
  if (!imageMimeTypes.includes(file.type)) {
    return "Only JPEG, PNG, WebP or GIF images are allowed";
  }

  if (file.size > fileSizeLimit) {
    return `Image must be ${fileSizeLimitMB} MB or smaller`;
  }

  return null;
};
