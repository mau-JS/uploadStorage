const {Storage} = require('@google-cloud/storage');
const axios = require('axios');
const stream = require('stream');

// Creates a client
const storage = new Storage();

async function saveToBucket(bucketName, url, destinationBlobName) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(destinationBlobName);

  // Get the file from the URL
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  const reader = response.data.pipe(new stream.PassThrough());

  // Uploads a local file to the bucket
  await new Promise((resolve, reject) =>
    reader.pipe(file.createWriteStream()).on('error', reject).on('finish', resolve)
  );
}

const bucketName = 'mybucket124';  // TODO: replace with your bucket name
const url = 'https://drive.google.com/uc?export=download&id=1Hrwtmvb_fziWFEJ9iwfV_81mh0zvuMnf';  // TODO: replace with the URL of the file you want to download
const destinationBlobName = 'test.pdf';  // TODO: replace with the name you want to give to the object in your bucket

saveToBucket(bucketName, url, destinationBlobName).catch(console.error);
