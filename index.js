const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const ffmpeg = require('ffmpeg-static');
const cloudConvert = require('cloudconvert');
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjM4YjJjM2VkNjhiZTZkN2ZiYWUwZWEyYzRiYzdjMDI2ZmQzMzFiYTI2ZjUzNTM2OWM3MTM2NTY4MDhmYTNiMDJlZWU5ZmRiNDM5NzA4NGMiLCJpYXQiOjE3MDQzODg0MzYuMjg0NTgzLCJuYmYiOjE3MDQzODg0MzYuMjg0NTg1LCJleHAiOjQ4NjAwNjIwMzYuMjgwMTc2LCJzdWIiOiI2NjcwOTkzMyIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.C0-k0YRorxby0uRIldrLe_i1ycWhs-T31zg6f7O7QXzbp7SOQUdF-O7vWTLJj9LH1RkiIQv3WGL3ByU0F94rmUUu7jcfr6jBmJfIL9T9rqzbVPlyYfLGCjleDddXgAOh6rk7uSpcuxt2Ya4mjEfrnp-WxprysPEv-UHuhI9Uq1S_tOBenW7_R1QsBnKHrOn9H5pjBrAyl3VVzDH4KrSZUvwT8p6Fth7c9Fx_44FaFU0dQWwhvmViV2gPfeZvRCYCE36k4MJremXZR0NSaKK9POTuiio5bXa5aHSo8GAUhM0jTZHzKYTN9gwxhYT9uMLXnOajcvFRowQJnWcFJnsrO94HxaajXfH-8vy81XFatHm-1Hmmm-QdmjRuXVI6-Cc594oLw9fQDXrsWWb1QKPagMvgYNxnuRrpcyDR9a3ePElCgjABegJAAu3MCqn-I0yflNrIRKKNfm9-DZI8HjY9NfhlutpqKgJURb5OW6QlCt7ig6GrFVtmwrKpYWHAxBWUsOutCaFZwu7x4k7OWzfJEqXrC8m974ic-EyfsGDio3miOWtNC6t9R3JsnRjqBDeBHmo9GMdi86umagIJ-J1yzatGAE8vo1k3nlD3nM4xpPLmns8NJnyY698BW13qB0AUJmYnTqeE6CPQD3VYi0wYkkKuYnO6sZeU1qHfcXbYGCM';
var convertapi = require('convertapi')('c9CU3XiuRSAMfYAx');
const fs = require('fs');
const { exec } = require('child_process');

const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: ffmpeg,
  puppeteer: {executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',}
});

const messageQueue = [];
let isProcessingQueue = false;

const timeer = 5000;

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
    const message = messageQueue.shift();
    const body = message.body.toLowerCase();
    let quotedMessage = ""

    switch (true) {
      case ["p", "hi"].includes(body):
        await delay(timeer);
        message.reply(
          "Kamu nyari aku 😨\nKalo mau buat stiker perintahnya .stiker disertai dengan gambar/video ya 😁"
        );
        break;

      case [".help", "!help"].includes(body):
        await delay(timeer);
        message.reply(
          "*Note:*\n" +
          "Setiap perintah mempunyai *delay ± 10detik*,\n" +
          "harap *bersabar* dan *jangan sampai spam*\n\n" +
          "*Daftar Perintah:*\n" +
          " # Buat Sticker (Img, Vid, Gif): \n - .stiker\n\n" +
          " # Stiker ke Foto & Gif: \n - .foto | reply stikernya pake .foto _(beta)_ \n - .gif _(coming soon)_ \n\n" +
          " # Tes bot:\n - p\n - hi \n\n" +
          " # Bantuan:\n - .help\n\n" +
          "_Bot masih dalam tahap pengembangan, dan untuk perintah unik lainnya coming soon~_"
        );
        break;

      case [".kurni", "kurni", ".sticker", ". stiker", ". sticker", "stiker", "stiiker", "sticker", "!stiker", "! stiker", "!sticker", "! sticker"].includes(body):
        await delay(timeer);
        message.reply(
          "Ngetiknya yang bener 😠\nketik *.stiker + masukin gambar/video* untuk mulai membuat stiker"
        );
        break;

      case [".stiker"].includes(body) && ["image", "video", "gif"].includes(message.type):
        await processStickerMessage(message);
        break;

      case [".stiker"].includes(body) && ["audio", "voice", "document", "location", "text"].includes(message.type):
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
        message.reply("Memproses stiker menjadi foto...");
        await delay(timeer);
        quotedMessage = await message.getQuotedMessage();
        if (quotedMessage.type === "sticker") {
          const stickerMedia = await quotedMessage.downloadMedia();
          message.reply(stickerMedia, undefined, {
            caption: "Oke",
          });
        }
        await delay(timeer);
        break;

      case [".gif"].includes(body) && message.hasQuotedMsg:
        await delay(timeer);
        message.reply("Mengubah stiker menjadi gif...");
        quotedMessage = await message.getQuotedMessage();
        if (quotedMessage.type === "sticker") {
          const stickerMedia = await quotedMessage.downloadMedia();
          const buffer = stickerMedia.data;
          
          async function webpToGif() {
            const cloudConvertInstance = new cloudConvert(apiKey);
            try {
                let exampleJob = await cloudConvertInstance.jobs.create({
                    "tasks": {
                        "import-my-file": {
                            "operation": "import/base64",
                            "file": buffer,
                            "filename": "input.webp"
                        },
                        "convert-my-file": {
                            "operation": "convert",
                            "input": "import-my-file",
                            "output_format": "gif"
                        },
                        "export-my-file": {
                            "operation": "export/url",
                            "input": "convert-my-file"
                        }
                    }
                });
                let job = await cloudConvertInstance.jobs.wait(exampleJob.id);
                const file = cloudConvertInstance.jobs.getExportUrls(job)[0];
                return file.url
        
            } catch (error) {
                console.error('Error:', error);
            }
          }

          const gif = await webpToGif()

          async function gifToMp4() {
            const cloudConvertInstance = new cloudConvert(apiKey);
            try {
                let exampleJob = await cloudConvertInstance.jobs.create({
                    "tasks": {
                        "import-my-file": {
                            "operation": "import/url",
                            "url": gif
                        },
                        "convert-my-file": {
                            "operation": "convert",
                            "input": "import-my-file",
                            "output_format": "mp4"
                        },
                        "export-my-file": {
                            "operation": "export/url",
                            "input": "convert-my-file"
                        }
                    }
                });
                let job = await cloudConvertInstance.jobs.wait(exampleJob.id);
                const file = cloudConvertInstance.jobs.getExportUrls(job)[0];
                return file.url
        
            } catch (error) {
                console.error('Error:', error);
            }
          }
          const mp4 = await gifToMp4()

          const media = await MessageMedia.fromUrl(mp4);

          message.reply(media, undefined, {
            caption: "Inilah gif dari stiker!",
            sendVideoAsGif: true,
          });
        } else {
          message.reply("Stiker yang di-reply bukan stiker gif.");
        }
        await delay(timeer);
        break;

      default:
        break;
    }
  }

  if (messageQueue.length > 0) {
    await processMessageQueue();
  }
  isProcessingQueue = false;
}

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
