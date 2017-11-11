/**
 * @author EmmanuelOlaojo
 * @since 11/10/17
 */

let fs = Promise.promisifyAll(require("fs"));
let mongoose = require("mongoose");
let ffmpegStatic = require("ffmpeg-static");
let ffprobeStatic = require("ffprobe-static");
let ffmpeg = require("fluent-ffmpeg");
let Grid = require("gridfs-stream");

Grid.mongo = mongoose.mongo;

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

exports.attachImage = async (file, doc, key) => {
  doc[key] = {
    data: await fs.readFileAsync(file.path, "base64")
    , mimetype: file.mimetype
  };

  await fs.unlinkAsync(file.path);
};

exports.uploadVideo = async (file, maxDuration = 10) => {
  let gfs = Grid(mongoose.connection.db);

  try {
    let vid = await toMp4(file, maxDuration);
    let writeStream = gfs.createWriteStream({filename: vid.filename});
    let readStream = fs.createReadStream(vid.path);

    return await new Promise(function (resolve, reject) {
      writeStream.on("close", file => {
        fs.unlink(vid.path, err => {
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

let toMp4 = exports.toMp4 = (file, maxDuration) => {
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

            // console.log("File saved as mp4: ", file.mp4);
            resolve(file);
          });
        })
        .save(filePath);
    });
  });
};