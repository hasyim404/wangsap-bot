const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

const ffmpegPath = "C:\\ffmpeg\\bin";
process.env.PATH += `;${ffmpegPath}`;

const keywords = ["p", ".help", ".stiker"]; // Daftar keyword yang akan direspon

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
      message.reply("Kamu nyari aku? 😨 Kalo mau pake sticker commandnya .stiker atau !stcker ya 😁");
    } else if (message.body.toLowerCase() === ".help") {
      message.reply(
        "Command Img to Sticker:\n- .stiker\n- !stiker \n\nInfo:\nUntuk Video & Gif to Sticker Nanti ya, mohon ditunggu.."
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
          if (fileSizeInMB >= 10) {
            message.reply("Gede banget sizenya, maksimal 10MB");
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