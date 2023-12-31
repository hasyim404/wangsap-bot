const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const ffmpeg = require('ffmpeg-static');
const sharp = require('sharp');
const fs = require('fs');

const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: ffmpeg,
  puppeteer: {executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',}
});

const messageQueue = [];
let isProcessingQueue = false;

const timeer = 1000;

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
        // const quotedMessage = await message.getQuotedMessage();
        if (quotedMessage.type === "sticker") {
          const stickerMedia = await quotedMessage.downloadMedia();
          message.reply(stickerMedia, undefined, {
            caption: "Oke",
          });
        }
        await delay(timeer);
        break;

      // case [".gif"].includes(body) && message.hasQuotedMsg:
      //   await delay(timeer);
      //   message.reply("Mengubah stiker menjadi gif...");
      //   await delay(timeer);
      //   const quotedMessage = await message.getQuotedMessage();
      //   if (quotedMessage.type === "sticker") {
      //     const stickerMedia = await quotedMessage.downloadMedia();
      //     message.reply(stickerMedia, undefined, {
      //       caption: "Inilah gif dari stiker!",
      //     });
      //   } else {
      //     message.reply("Stiker yang di-reply bukan stiker gif.");
      //   }
      //   await delay(timeer);
      //   break;

      // TEST CASE FOR .GIF COMMAND
      case [""].includes(body):
        if (message.type === "sticker" && !message.body)
          await delay(timeer);
          message.reply("Mengubah stiker menjadi gif...");
          await delay(timeer);
          if (message.type === "sticker") {
            const stickerMedia = await message.downloadMedia();
            // Test 1 - Convert webp base64 to gif base64 with converter
            // const gifBuffer = await convertWebpToGif(stickerMedia.data);
            // const gifMedia = new MessageMedia('image/gif', gifBuffer);
              
            // Test 2 - Convert webp base64 to gif base64 without converter, then write output.gif file from gif base64
            const buffer = Buffer.from(stickerMedia.data, 'base64')
            fs.writeFileSync('output.gif', buffer, 'binary');
            const gifMedia = MessageMedia.fromFilePath('output.gif');

            // Test 3 - Convert webp base64 to gif base64 withut converter
            // const gifMedia = new MessageMedia('image/gif', stickerMedia.data, 'sticker');

            // Test 4 - Send gif file
            // const gifMedia = await MessageMedia.fromUrl('https://media1.tenor.com/m/omJbisofB98AAAAC/pepe-clown.gif');

            message.reply(gifMedia, undefined, {
              caption: "Inilah gif dari stiker!",
              sendMediaAsDocument: true
            });
            fs.unlinkSync('output.gif');
          } else {
            message.reply("Stiker yang di-reply bukan stiker gif.");
          }
          await delay(timeer);
          break;
      
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
    const buffer = Buffer.from(webpData, 'base64');

    // Convert WebP to GIF using sharp
    const gifBuffer = await sharp(buffer).toFormat('gif').toBuffer();

    // Encode GIF buffer to base64
    const gifData = gifBuffer.toString('base64');

    return gifData;
  } catch (error) {
    console.error('Error converting WebP to GIF:', error);
    throw error;
  }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
