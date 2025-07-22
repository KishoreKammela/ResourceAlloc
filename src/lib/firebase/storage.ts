import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './config';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path to upload the file to (e.g., 'resumes/').
 * @returns The download URL of the uploaded file.
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  // Generate a unique filename to prevent overwrites
  const fileExtension = file.name.split('.').pop();
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `${path}/${uniqueFilename}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed.');
  }
}
