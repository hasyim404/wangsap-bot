const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

const ffmpegPath = "C:\\ffmpeg\\bin";
process.env.PATH += `${ffmpegPath}`;

const fs = require("fs");

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
        "*Note:*\nSetiap perintah mempunyai *delay ± 10detik*,\nharap *bersabar* dan *jangan sampai spam*\n-\n*Daftar Perintah:*\n # Buat Sticker (Img, Vid, Gif): \nㅤ- .stiker\n\n # Stiker ke Foto & Gif: \nㅤ- .foto | reply stikernya pake .foto _(beta)_ \nㅤ- .gif _(coming soon)_ \n\n # Tes bot:\nㅤ- p\nㅤ- hi \n\n # Bantuan:\nㅤ- .help\n\n_Bot masih dalam tahap pengembangan, dan untuk perintah unik lainnya coming soon~_"
      );
    } else if (
      ["audio", "voice", "document", "location", "text"].includes(
        message.type
      ) &&
      [".stiker"].includes(body)
    ) {
      await delay(timeer);
      message.reply("Cuma bisa Gambar, Video dan GIF 👍");
    } else if (
      ["image", "video", "gif"].includes(message.type) &&
      [".stiker"].includes(body)
    ) {
      await processStickerMessage(message);
    } else if ([".foto"].includes(body) && message.hasQuotedMsg) {
      await delay(timeer);
      message.reply("Memproses stiker menjadi foto...");
      await delay(timeer);
      const quotedMessage = await message.getQuotedMessage();
      if (quotedMessage.type === "sticker") {
        const stickerMedia = await quotedMessage.downloadMedia();
        message.reply(stickerMedia, undefined, {
          caption: "Oke",
        });
      }
      await delay(timeer);
      continue;

      // } else if ([".gif"].includes(body) && message.hasQuotedMsg) {
      //   await delay(timeer);
      //   message.reply("Mengubah stiker menjadi gif...");
      //   await delay(timeer);
      //   const quotedMessage = await message.getQuotedMessage();
      //   if (
      //     quotedMessage &&
      //     quotedMessage.type === "sticker" &&
      //     quotedMessage.mimetype &&
      //     quotedMessage.mimetype.includes("image/gif")
      //   ) {
      //     const stickerMedia = await quotedMessage.downloadMedia();
      //     message.reply(stickerMedia, undefined, {
      //       caption: "Inilah gif dari stiker!",
      //     });
      //   } else {
      //     message.reply("Stiker yang di-reply bukan stiker gif.");
      //   }
      //   await delay(timeer);
      //   continue;
    } else if (
      [
        ".kurni",
        "kurni",
        ".sticker",
        ". stiker",
        ". sticker",
        "stiker",
        "stiiker",
        "sticker",
        "!stiker",
        "! stiker",
        "!sticker",
        "! sticker",
      ].includes(body)
    ) {
      await delay(timeer);
      message.reply(
        "Ngetiknya yang bener 😠\nketik *.stiker + masukin gambar/video* untuk mulai membuat stiker"
      );
    } else if ([".stiker"].includes(body)) {
      await delay(timeer);
      message.reply(
        "Eitss, gambar/videonya ketinggalan nih..\n*ketik .stiker + masukin gambar/video* untuk mulai membuat stiker"
      );
    } else if (["p", "hi"].includes(body)) {
      await delay(timeer);
      message.reply(
        "Kamu nyari aku 😨\nKalo mau buat stiker perintahnya .stiker disertai dengan gambar/video ya 😁"
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
