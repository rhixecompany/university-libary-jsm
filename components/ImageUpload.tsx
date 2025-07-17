/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'; // This component must be a client component

import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload } from '@imagekit/next';
import Image from 'next/image';
import { useRef, useState } from 'react';

/**
 * Authenticates and retrieves the necessary upload credentials from the server.
 *
 * This function calls the authentication API endpoint to receive upload parameters like signature,
 * expire time, token, and publicKey.
 *
 * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
 * @throws {Error} Throws an error if the authentication request fails.
 */
const authenticator = async () => {
  try {
    // Perform the request to the upload authentication endpoint.
    const response = await fetch('/api/upload-auth');
    if (!response.ok) {
      // If the server response is not successful, extract the error text for debugging.
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    // Parse and destructure the response JSON for upload credentials.
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    // Log the original error for debugging before rethrowing a new error.
    console.error('Authentication error:', error);
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    } else {
      throw new Error('Authentication request failed: Unknown error');
    }
  }
};

interface Props {
  placeholder: string;
  variant: 'dark' | 'light';
}

// ImageUpload component demonstrates file uploading using ImageKit's Next.js SDK.
const ImageUpload = ({
  placeholder,

  variant,
}: Props) => {
  const styles = {
    button: variant === 'dark' ? 'bg-dark-300' : 'bg-light-600 border-gray-100 border',
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
  };

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput?.files || fileInput.files.length === 0) {
      toast({
        title: 'No File selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    // Extract the first file from the file input
    setFile(fileInput.files[0]);

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error('Failed to authenticate for upload:', authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file: file!, // Non-null assertion since we already checked file input above
        fileName: file!.name, // Type assertion to File for fileName
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log('Upload response:', uploadResponse);
      toast({
        title: `File uploaded successfully`,
        description: `${uploadResponse.filePath} uploaded successfully!`,
      });
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error('Upload aborted:', error.reason);
        toast({
          title: `Upload aborted`,
          description: `${error.reason}`,
          variant: 'destructive',
        });
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error('Invalid request:', error.message);
        toast({
          title: `Invalid request`,
          description: `${error.message}`,
          variant: 'destructive',
        });
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error('Network error:', error.message);
        toast({
          title: `Network error`,
          description: `${error.message}`,
          variant: 'destructive',
        });
      } else if (error instanceof ImageKitServerError) {
        console.error('Server error:', error.message);
        toast({
          title: `Server error`,
          description: `${error.message}`,
          variant: 'destructive',
        });
      } else {
        // Handle any other errors that may occur.
        console.error('Upload error:', error);
        toast({
          title: `Upload error`,
          description: `${error}`,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <>
      {/* File input element using React ref */}
      <input type="file" ref={fileInputRef} />
      {/* Button to trigger the upload process */}
      <button type="button" onClick={handleUpload} className={cn('upload-btn', styles.button)}>
        <Image src="/icons/upload.svg" alt="upload-icon" width={20} height={20} className="object-contain" />

        <p className={cn('text-base', styles.placeholder)}>{placeholder}</p>
        {file && <p className={cn('upload-filename', styles.text)}>{file.name}</p>}
      </button>
      <br />
      {/* Display the current upload progress */}
      Upload progress: <progress value={progress} max={100}></progress>
      <br />
      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
