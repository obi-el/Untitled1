/**
 * @author EmmanuelOlaojo
 * @since 11/10/17
 */

const MAX_DURATION = 10;

let fs = Promise.promisifyAll(require("fs"));
let mongoose = require("mongoose");
let ffmpegStatic = require("ffmpeg-static");
let ffprobeStatic = require("ffprobe-static");
let ffmpeg = require("fluent-ffmpeg");
let Grid = require("gridfs-stream");

Grid.mongo = mongoose.mongo;

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

/**
 * Attach an image to a mongoose document
 * at the specified key.
 *
 * @param file the image to attach
 * @param doc the mongoose document
 * @param key image key in the document
 *
 * @returns {Promise.<void>}
 */
exports.attachImage = async (file, doc, key) => {
  doc[key] = {
    data: await fs.readFileAsync(file.path, "base64")
    , mimetype: file.mimetype
  };

  await fs.unlinkAsync(file.path);
};

/**
 * Takes a video that's not longer than
 * maxDuration and uploads it to the db as
 * an mp4. Not being used currently but it works.
 *
 * @param file the video file object
 * @param maxDuration max duration for a video in seconds
 *
 * @returns {Promise.<*>}
 */
exports.uploadVideo = async (file, maxDuration = MAX_DURATION) => {
  let gfs = Grid(mongoose.connection.db);

  try {
    let vid = await toMp4(file, maxDuration);
    let writeStream = gfs.createWriteStream({filename: vid.filename});
    let readStream = fs.createReadStream(vid.mp4);

    return await new Promise(function (resolve, reject) {
      writeStream.on("close", file => {
        fs.unlink(vid.mp4, err => {
          if(err) return reject(err);

          resolve(file);
        });
      });

      writeStream.on("error", reject);
      readStream.on("error", reject);

      readStream.pipe(writeStream);
    });
  }
  catch(err){
    throw err;
  }
};

/**
 * Stores the path to an mp4 version of a
 * video file in file.mp4 and resolves with the
 * file.
 *
 * @returns {Promise.<*>}
 */
let toMp4 = exports.toMp4 = (file, maxDuration = MAX_DURATION) => {
  let mpeg = ffmpeg(file.path);
  let filePath = `${file.path}.mp4`;

  return new Promise(function(resolve, reject){
    mpeg.ffprobe((err, data) => {
      if(err) return reject(err);

      if(data.format.duration > maxDuration){
        return reject(new Error(`Video too long. Max duration is ${maxDuration} seconds`));
      }

      let codec = data.streams[0].codec_name;

      if(codec === "h264"){
        file.mp4 = file.path;
        return resolve(file);
      }

      mpeg.format("mp4")
        .on("error", reject)
        .on("end", () => {
          fs.unlink(file.path, err => {
            if(err) return reject(err);

            file.mp4 = filePath;
            resolve(file);
          });
        })
        .save(filePath);
    });
  });
};