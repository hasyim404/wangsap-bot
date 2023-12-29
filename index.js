const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

const ffmpegPath = "C:\\ffmpeg\\bin";
process.env.PATH += `;${ffmpegPath}`;

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

// Fungsi kueue
async function processMessageQueue() {
  isProcessingQueue = true;

  while (messageQueue.length > 0) {
    const message = messageQueue.shift(); // Ambil pesan dari depan antrian

    const body = message.body.toLowerCase();

    if ([".help", "!help"].includes(body)) {
      await delay(timeer);
      message.reply(
        "*Daftar Perintah:*\n # Buat Sticker (Img, Vid, Gif): \nㅤ- .stiker\n\n # Tes bot:\nㅤ- p\nㅤ- hi\n\n # Bantuan:\nㅤ- .help\n\n_Perintah unik coming soon~_"
      );
    } else if (
      ["audio", "voice", "document", "location", "text"].includes(
        message.type
      ) &&
      [".sticker", "!sticker", "!stiker", ".stiker", "/stiker"].includes(body)
    ) {
      await delay(timeer);
      message.reply(
        "Tambahkan media berupa Gambar/Video/GIF untuk dijadikan stiker 😅"
      );
    } else if (
      ["image", "video", "gif"].includes(message.type) &&
      [".sticker", "!sticker", "!stiker", ".stiker", "/stiker"].includes(body)
    ) {
      await processStickerMessage(message);
    } else if (
      [
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
      ].includes(body)
    ) {
      await delay(timeer);
      message.reply(
        "Ngetiknya yang bener 😠, ketik *.stiker + masukin gambar/video* untuk mulai membuat stiker "
      );
    } else if ([".stiker", "!stiker"].includes(body)) {
      await delay(timeer);
      message.reply("Tambahkan media untuk dijadikan stiker");
    } else if (["p", "hi"].includes(body)) {
      await delay(timeer);
      message.reply(
        "Kamu nyari aku? 😨 Kalo mau buat sticker perintahnya .stiker disertai dengan gambar/video ya 😁"
      );
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

    // Check if the size property is available
    if (message.size) {
      const fileSizeInMB = message.size / (1024 * 1024);
      if (fileSizeInMB >= 10) {
        await delay(timeer);
        message.reply("Gede banget sizenya, maksimal 10MB");
        return;
      }
    }

    if (isNaN(videoDuration) || videoDuration > 7) {
      await delay(timeer);
      message.reply("Kepanjangan durasinya, maksimal 7 detik");
      return;
    }
  }

  message.reply("Membuat stiker...");
  await delay(timeer);
  message.reply(media, undefined, {
    sendMediaAsSticker: true,
    stickerName: "‎",
    stickerAuthor: "‎",
  });

  // Delay 15 detik sebelum memproses pesan berikutnya
  await delay(timeer);

  // Proses pesan berikutnya dalam antrian
  if (messageQueue.length > 0) {
    await processMessageQueue();
  }
}

// Fungsi delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
