export const blobToBase64 = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve, reject) => {
    reader.onloadend = (res) => {
      if (res.target?.result && typeof res.target.result === "string") {
        resolve(res.target.result);
      } else {
        reject("Could not transform blob to base64");
      }
    };
  });
};

export const blobToJson = (blob: Blob): Promise<any> => {
  if (blob.type !== "application/json") {
    return Promise.reject("Blob type is not JSON");
  }
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (res) => {
      if (res.target?.result && typeof res.target.result === "string") {
        return resolve(JSON.parse(res.target.result));
      } else {
        return reject("Could not read JSON data from the blob");
      }
    };
  });
};
