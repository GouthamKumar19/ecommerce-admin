
import axiosInstance from "./axios"; // Ensure this is correctly configured

/**
 * Function to get a presigned URL for uploading a file
 * @param {string} fileName - The name of the file to be uploaded
 * @param {string} fileType - The MIME type of the file to be uploaded
 * @returns {Promise<string>} - A promise that resolves to the presigned URL
 */
export const getPresignedUrl = async (fileName: string, type: string): Promise<string> => {
    const formattedFileName = `public/ecommerce/${type}/` + fileName.toLowerCase().replace(/\s+/g, "_");
  const response = await axiosInstance.post(`/generic/image`, {
    fileName:formattedFileName,
  });

  if (response.status === 200) {
    return response.data.data.signedPost; // Adjust to return  signedPost
  } else {
    throw new Error('Failed to get presigned URL');
  }
};

/**
 * Function to upload a file to the server using a presigned URL
 * @param {string} presignedUrl - The presigned URL to upload the file
 * @param {File} file - The file to be uploaded
 * @returns {Promise<void>}
 */
export const uploadFile = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw new Error(`File upload failed with status: ${response.status}`);
  }
};
