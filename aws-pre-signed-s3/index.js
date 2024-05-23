const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports.getSignedUrl = async (event) => {
  const bucketName = process.env.BUCKET_NAME;
  const body = JSON.parse(event.body);
  const fileName = body.fileName;
  const fileNameExtension = fileName.split(".").pop();
  const key = `uploads/${Date.now().toString()}.${fileNameExtension}`;

  const s3Params = {
    Bucket: bucketName,
    Key: key,
    Expires: 600,
    ContentType: "application/octet-stream"
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uploadURL,
      key
    })
  };
};
