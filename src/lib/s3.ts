import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Generates a presigned POST policy for uploading to S3.
 * This allows enforcing file size and content type on the S3 side.
 * @param fileType The expected MIME type (e.g. 'image/png')
 * @param maxSizeInBytes Maximum allowed file size (default 5MB)
 */

export const generateUploadUrl = async ({
  fileType,
  fileName,
  maxSizeInBytes = 5 * 1024 * 1024,
}: {
  fileType: string;
  fileName: string;
  maxSizeInBytes?: number;
}) => {
  const fileKey = `uploads/${nanoid()}-${Date.now()}-${fileName}`;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    Conditions: [
      ['content-length-range', 0, maxSizeInBytes], // Enforce file size limit
      ['eq', '$Content-Type', fileType], // Enforce exact content type
    ],
    Fields: {
      'Content-Type': fileType,
    },
    Expires: 1 * 60 * 60, // seconds
  });

  // Re-adding a specific condition to enforce the EXACT content type if desired
  // or using starts-with for flexibility. Let's use exact match for security.

  return { url, fields, fileKey };
};

/**
 * Verifies that a fileKey exists in S3.
 */
export const verifyFileExists = async (fileKey: string) => {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
      }),
    );
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') return false;
    throw error;
  }
};

export const getObjectUrl = (fileKey: string): string => {
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};

// export const getObjectUrl = async (fileKey: string) => {
//   try {
//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: fileKey,
//     });

//     const url = await getSignedUrl(s3Client, command, {});

//     console.log('URL', url);
//     return url;
//   } catch (error: any) {
//     if (error.name === 'NotFound') return null;
//     throw error;
//   }
// };
