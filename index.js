const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

const ffmpegPath = "C:\\ffmpeg\\bin";
process.env.PATH += `;${ffmpegPath}`;

// Daftar keyword yang akan direspon
const keywords = [
  // Keyword bener
  "p",
  ".help",
  ".stiker",
  "hi",
  // Keyword salah
  ".kurni",
  "kurni",
  ".sticker",
  ". stiker",
  ". sticker",
  "stiker",
  "sticker",
  "!stiker",
  "! stiker",
  "!sticker",
  "! sticker",
];

const messageQueue = [];
let isProcessing = false;

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    // Keyword checkers
    if (keywords.includes(message.body.toLowerCase())) {
      messageQueue.push(message);

      if (!isProcessing) {
        processMessageQueue();
      }
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("Waduh ada error nih dari sistem, mohon bersabar ini ujian.");
  }
});

async function processMessageQueue() {
  isProcessing = true;

  const message = messageQueue.shift();

  await delay(10000); // Mengubah delay menjadi 10 detik

  try {
    if (message.body.toLowerCase() === "p") {
      message.reply(
        "Kamu nyari aku? 😨 Kalo mau buat sticker perintahnya .stiker disertai dengan gambar/video ya 😁"
      );
    } else if (message.body.toLowerCase() === ".help") {
      message.reply(
        `
        *Daftar Perintah:*\n 
          # Buat Sticker (Img, Vid, Gif):
          \nㅤ- .stiker 
          \n\n
          # Tes bot:
          \nㅤ- p
          \nㅤ- hi
          \n\n
          # Bantuan:
          \nㅤ- .help
          \n\n
          _Perintah unik lainnya menyusul..._
          `
      );
    } else if (message.body.toLowerCase() === ".stiker") {
      message.reply("Membuat stiker...");
      // Logika untuk membuat stiker
      const media = await message.downloadMedia();

      if (
        (message.type === "video" || message.type === "gif") &&
        message.duration
      ) {
        const videoDuration = parseFloat(message.duration);

        // Periksa apakah properti size tersedia
        if (message.size) {
          const fileSizeInMB = message.size / (1024 * 1024);
          if (fileSizeInMB >= 5) {
            message.reply("Gede banget sizenya, maksimal 5MB");
            return;
          }
        }

        if (isNaN(videoDuration) || videoDuration > 7) {
          message.reply("Kepanjangan durasinya, maksimal 7 detik");
          return;
        }
      }

      message.reply(media, undefined, {
        sendMediaAsSticker: true,
        stickerName: "ㅤ",
        stickerAuthor: "ㅤ",
      });
    } else if (
      (message.body.toLowerCase() === ".kurni",
      "kurni",
      ".sticker",
      ". stiker",
      ". sticker",
      "stiker",
      "sticker",
      "!stiker",
      "! stiker",
      "!sticker",
      "! sticker")
    ) {
      message.reply(
        "Ngetiknya yang bener 😠,\npake *.stiker* untuk mulai membuat stiker "
      );
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("Waduh ada error nih dari sistem, mohon bersabar ini ujian.");
  }

  if (messageQueue.length > 0) {
    processMessageQueue();
  } else {
    isProcessing = false;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

client.initialize();
