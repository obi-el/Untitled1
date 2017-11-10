/**
 * @author EmmanuelOlaojo
 * @since 11/10/17
 */

let fs = Promise.promisifyAll(require("fs"));

exports.attachImage = async (file, doc, key) => {
  doc[key] = {
    data: await fs.readFileAsync(file.path, "base64")
    , mimetype: file.mimetype
  };

  await fs.unlinkAsync(file.path);
};