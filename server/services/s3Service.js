// server/services/s3Service.js
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "streamsphere-bucket";
const SIGNED_URL_EXPIRATION = 3600; // 1 hour in seconds

const s3Service = {
  /**
   * Generate a signed URL for streaming a video from S3
   * @param {string} key - S3 object key (file path in bucket)
   * @returns {Promise<string>} - Signed URL
   */
  getSignedVideoUrl: async (key) => {
    try {
      if (!key) {
        throw new Error("S3 key is required");
      }

      console.log("Generating signed URL for key:", key);
      console.log("Bucket:", BUCKET_NAME);

      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ResponseContentType: "video/mp4", // Ensure correct content type
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: SIGNED_URL_EXPIRATION,
      });

      console.log("Generated signed URL:", signedUrl.substring(0, 100) + "...");
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      console.error("Key:", key);
      console.error("Bucket:", BUCKET_NAME);
      throw new Error(
        `Failed to generate signed URL for video: ${error.message}`
      );
    }
  },

  /**
   * Generate signed URLs for multiple videos
   * @param {Array<string>} keys - Array of S3 object keys
   * @returns {Promise<Object>} - Object with keys and their signed URLs
   */
  getSignedVideoUrls: async (keys) => {
    try {
      const urlPromises = keys.map(async (key) => {
        const url = await s3Service.getSignedVideoUrl(key);
        return { key, url };
      });

      const results = await Promise.all(urlPromises);

      return results.reduce((acc, { key, url }) => {
        acc[key] = url;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error generating multiple signed URLs:", error);
      throw error;
    }
  },

  /**
   * Generate signed URL for thumbnail/poster images
   * @param {string} key - S3 object key
   * @returns {Promise<string>} - Signed URL
   */
  getSignedImageUrl: async (key) => {
    try {
      if (!key) return null;

      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 7200, // 2 hours for images
      });

      return signedUrl;
    } catch (error) {
      console.error("Error generating signed image URL:", error);
      return null;
    }
  },

  /**
   * Extract S3 key from full S3 URL
   * @param {string} s3Url - Full S3 URL
   * @returns {string} - S3 key (path)
   */
  extractS3Key: (s3Url) => {
    if (!s3Url) return null;

    console.log("Extracting S3 key from:", s3Url);

    // Handle different S3 URL formats
    // Format 1: s3://bucket-name/path/to/file
    if (s3Url.startsWith("s3://")) {
      const key = s3Url.replace(`s3://${BUCKET_NAME}/`, "");
      console.log("Extracted key (s3:// format):", key);
      return key;
    }

    // Format 2: https://bucket-name.s3.region.amazonaws.com/path/to/file
    if (s3Url.includes(".s3.") && s3Url.includes("amazonaws.com")) {
      try {
        const url = new URL(s3Url);
        const key = url.pathname.substring(1); // Remove leading slash
        console.log("Extracted key (URL format):", key);
        return key;
      } catch (error) {
        console.error("Error parsing S3 URL:", error);
      }
    }

    // Format 3: https://s3.region.amazonaws.com/bucket-name/path/to/file
    if (s3Url.includes("s3.") && s3Url.includes("amazonaws.com")) {
      try {
        const url = new URL(s3Url);
        const pathParts = url.pathname.substring(1).split("/");
        if (pathParts[0] === BUCKET_NAME) {
          const key = pathParts.slice(1).join("/");
          console.log("Extracted key (path-style format):", key);
          return key;
        }
      } catch (error) {
        console.error("Error parsing S3 URL:", error);
      }
    }

    // If it's already just a key (no protocol or domain)
    console.log("Using as-is (assumed to be key):", s3Url);
    return s3Url;
  },

  /**
   * Check if URL is an S3 URL that needs signing
   * @param {string} url - URL to check
   * @returns {boolean}
   */
  isS3Url: (url) => {
    if (!url) return false;
    return (
      url.startsWith("s3://") ||
      url.includes(".s3.") ||
      url.includes("amazonaws.com") ||
      // Also check if it doesn't start with http/https (assume it's a key)
      (!url.startsWith("http://") && !url.startsWith("https://"))
    );
  },

  /**
   * Test S3 connection and credentials
   * @returns {Promise<boolean>}
   */
  testConnection: async () => {
    try {
      const { HeadBucketCommand } = require("@aws-sdk/client-s3");
      const command = new HeadBucketCommand({ Bucket: BUCKET_NAME });
      await s3Client.send(command);
      console.log("S3 connection successful");
      return true;
    } catch (error) {
      console.error("S3 connection failed:", error);
      return false;
    }
  },
};

module.exports = s3Service;
