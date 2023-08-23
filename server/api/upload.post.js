import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const fileSize = 1024 * 1024 * 5; // 5MB

  try {
    const { files, fields } = await readFiles(event, {
      includeFields: true,
      maxFiles: 1,
      maxFileSize: fileSize,
    });
    
    for (let index = 0; index < Object.keys(files).length; index++) {
      const filepath = files[index][0].filepath;
      const mimetype = files[index][0].mimetype;

      if (!mimetype.startsWith("image")) {
        throw createError({
          statusMessage: "1001",
          statusCode: 422,
        }); 
      }
      
      let imageName = `${String(Date.now()) + String(Math.round(Math.random() * 10000000))}.${mimetype.split("/")[1]}`;
      let newPath = path.join("upload", imageName);
      fs.copyFileSync(filepath, newPath);
    }

    return {
      status: 200,
      message: "Upload image successfully."
    }
  } catch (error) {
      if (error.message === "1001") {
      throw createError({
        statusMessage: "Only image allowed.",
        statusCode: 422,
      });
    }

    if (error.code === formidableErrors.maxFilesExceeded) {
      throw createError({
        statusMessage: "Can't upload more than one image.",
        statusCode: 422,
      });
    }

    if (error.code === formidableErrors.biggerThanTotalMaxFileSize) {
      throw createError({
        statusMessage: `File is larger than ${(fileSize / (1024 * 1024))} MB.`,
        statusCode: 422,
      });
    }

    throw createError({
			statusMessage: "An unknown error occurred",
			statusCode: 500
		});
  }
});

