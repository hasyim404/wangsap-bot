const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const ffmpegs = require("ffmpeg-static");
const sharp = require("sharp");
const fs = require("fs");

const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobe = require("@ffprobe-installer/ffprobe");

const osPlatform = os.platform(); // possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
console.log("Scraper running on platform: ", osPlatform);
let executablePath;
if (/^win/i.test(osPlatform)) {
  executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
} else if (/^linux/i.test(osPlatform)) {
  executablePath = "/usr/bin/chromium-browser";
}

const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: ffmpegs,
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
});

const messageQueue = [];
let isProcessingQueue = false;

const timeer = 10000;

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    const body = message.body.toLowerCase();

    // Tambahkan semua keyword ke dalam fungsi processMessageQueue()
    messageQueue.push(message);

    if (!isProcessingQueue) {
      processMessageQueue();
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("Waduh ada error nih dari sistem, mohon bersabar ini ujian.");
  }
});

client.initialize();

async function processMessageQueue() {
  isProcessingQueue = true;

  while (messageQueue.length > 0) {
    const message = messageQueue.shift(); // Ambil pesan dari depan antrian

    const body = message.body.toLowerCase();

    switch (true) {
      case ["p", "hi"].includes(body):
        await delay(timeer);
        message.reply(
          "Kamu nyari aku 😨\nKalo mau buat stiker perintahnya *.stiker + gambar/video/gif* ya 😁"
        );
        break;

      case [".help", "!help"].includes(body):
        await delay(timeer);
        message.reply(
          "*Note:*\n" +
            "Setiap perintah mempunyai *delay ± 10detik*,\n" +
            "harap *bersabar* dan *jangan sampai spam*\n\n" +
            "*Fitur:*\n" +
            " *🟩 Buat Sticker (IMG, VID, GIF):*\n" +
            "  *🔸Cara pakai:* \n" +
            "      - _`masukkan media + perintah`_. \n" +
            "      - _`reply media + perintah`_. \n" +
            "  *🔸Perintah:* \n" +
            "      - .stiker\n\n" +
            " *|❗Beta❗|*\n" +
            " *🟩 Konversi Stiker ke Foto & Gif:*\n" +
            "  *🔸Cara pakai:* \n" +
            "      _`reply stiker + masukin perintah`_. \n" +
            "  *🔸Perintah:* \n" +
            "      - .foto \n" +
            "      - .gif (_*new!*_)\n\n" +
            " *🟩 Tes Bot:*\n" +
            "  *🔸Perintah:* \n" +
            "      - p\n" +
            "      - hi\n\n" +
            " *🟩 Bantuan:*\n" +
            "  *🔸Perintah:* \n" +
            "      - .help\n\n" +
            "_Bot masih dalam tahap pengembangan, dan untuk perintah unik lainnya coming soon~_"
        );
        break;

      case [
        ".kurni",
        "kurni",
        ".sticker",
        ". stiker",
        ". sticker",
        "stiker",
        "stiiker",
        "stijer",
        "sticker",
        "!stiker",
        "! stiker",
        "!sticker",
        "! sticker",
      ].includes(body):
        await delay(timeer);
        message.reply(
          "Ngetiknya yang bener 😠\nketik *.stiker + masukin gambar/video*, atau *reply media + ketik .stiker* untuk mulai membuat stiker"
        );
        break;

      case [".stiker"].includes(body) && message.hasQuotedMsg:
        const quotedMessageStiker = await message.getQuotedMessage();

        if (
          (quotedMessageStiker && quotedMessageStiker.type === "image",
          "video",
          "gif")
        ) {
          await delay(timeer);
          await processStickerMessage(quotedMessageStiker);
        }
        break;

      case [".stiker"].includes(body) &&
        ["image", "video", "gif"].includes(message.type):
        await delay(timeer);
        await processStickerMessage(message);
        break;

      case [".stiker"].includes(body) &&
        ["audio", "voice", "document", "location", "text"].includes(
          message.type
        ):
        await delay(timeer);
        message.reply("Cuma bisa Gambar, Video dan GIF 👍");
        break;

      case [".stiker"].includes(body):
        await delay(timeer);
        message.reply(
          "Eitss, gambar/videonya ketinggalan nih..\n*ketik .stiker + masukin gambar/video* untuk mulai membuat stiker"
        );
        break;

      case [".foto"].includes(body) && message.hasQuotedMsg:
        await delay(timeer);
        if (message.type === "sticker" && !message.body);
        message.reply("Memproses ubah stiker menjadi IMG...");

        const quotedMessageImg = await message.getQuotedMessage();
        if (quotedMessageImg && quotedMessageImg.type === "sticker") {
          const stickerMedia = await quotedMessageImg.downloadMedia();
          await delay(timeer);
          message.reply(stickerMedia, undefined, {
            caption: "Oke 👍👌",
          });
        }
        break;

      // TEST CASE FOR .GIF COMMAND
      case [".gif"].includes(body) && message.hasQuotedMsg:
        await delay(timeer);
        if (message.type === "sticker" && !message.body);
        message.reply("Memproses ubah stiker menjadi GIF...");
        await delay(timeer);

        const quotedMessage = await message.getQuotedMessage();

        // Check if quotedMessage is defined and its type is "sticker"
        if (quotedMessage && quotedMessage.type === "sticker") {
          const stickerMedia = await quotedMessage.downloadMedia();
          // const buffer = Buffer.from(stickerMedia.data, "base64");
          // // console.log("The buffer:\n" + buffer);
          // const validate = sharp(buffer, {
          //   animated: true,
          // });
          // console.log(validate);

          // Check if stickerMedia is defined
          if (stickerMedia) {
            // Test 1
            const gifBuffer = await convertWebpToGif(stickerMedia.data);
            const gifMedia = new MessageMedia("gif", gifBuffer);

            fs.writeFileSync(
              "output.gif",
              Buffer.from(gifMedia.data, "base64")
            );

            const gifPath = MessageMedia.fromFilePath("output.gif");

            const ffmpeg = require("fluent-ffmpeg")()
              .setFfprobePath(ffprobe.path)
              .setFfmpegPath(ffmpegInstaller.path);

            const ffmpegPromise = new Promise((resolve, reject) => {
              ffmpeg
                .input(`${gifPath.filename}`)
                .outputOptions([
                  "-pix_fmt yuv420p",
                  "-c:v libx264",
                  "-movflags +faststart",
                  "-filter:v crop='floor(in_w/2)*2:floor(in_h/2)*2'",
                ])
                .noAudio()
                .output(`vidgif.mp4`)
                .on("end", () => {
                  // console.log("Conversion to MP4 completed");
                  resolve();
                })
                .on("error", (e) => {
                  console.log("Error during conversion:", e);
                  reject(e);
                })
                .run();
            });

            // Promise:
            ffmpegPromise
              .then(() => {
                const mp4Media = MessageMedia.fromFilePath("vidgif.mp4");
                message.reply(mp4Media, undefined, {
                  caption: "Done 👍👌",
                  sendVideoAsGif: true,
                });

                fs.unlinkSync("output.gif");
                fs.unlinkSync("vidgif.mp4");
              })
              .catch((error) => {
                console.error("Error during ffmpeg conversion:", error);
                message.reply(
                  "Terjadi kesalahan saat mengonversi stiker ke gif."
                );
              });
          } else {
            message.reply("Stiker yang di-reply bukan stiker gif.");
          }
          await delay(timeer);
          break;
        } else {
          message.reply("Hanya berlaku untuk konversi STIKER ke GIF");
        }

      default:
        break;
    }
  }

  // Proses pesan berikutnya dalam antrian setelah semua pesan selesai diproses
  if (messageQueue.length > 0) {
    await processMessageQueue();
  }
  isProcessingQueue = false;
}

// Proses pesan dengan tipe stiker
async function processStickerMessage(message) {
  const media = await message.downloadMedia();

  if (
    (message.type === "video" || message.type === "gif") &&
    message.duration
  ) {
    const videoDuration = parseFloat(message.duration);

    if (message.size) {
      const fileSizeInMB = message.size / (1024 * 1024);
      if (fileSizeInMB >= 5) {
        await delay(timeer);
        message.reply("Gede banget sizenya, maksimal 5MB...");
        return;
      }
    }

    if (isNaN(videoDuration) || videoDuration > 7) {
      await delay(timeer);
      message.reply("Kepanjangan durasinya, maksimal 7 detik...");
      return;
    }
  }

  await delay(timeer);
  message.reply("Memproses stiker...");
  await delay(timeer);
  message.reply(media, undefined, {
    sendMediaAsSticker: true,
    stickerName: "",
    stickerAuthor: "",
  });

  await delay(timeer);

  if (messageQueue.length > 0) {
    await processMessageQueue();
  }
}

const convertWebpToGif = async (webpData) => {
  try {
    // Decode base64 WebP data
    const buffer = Buffer.from(webpData, "base64");

    // Convert WebP to GIF using sharp
    const gifBuffer = await sharp(buffer, { animated: true })
      .toFormat("gif")
      .toBuffer();

    // Encode GIF buffer to base64
    const gifData = gifBuffer.toString("base64");

    return gifData;
  } catch (error) {
    console.error("Error converting WebP to GIF:", error);
    throw error;
  }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
