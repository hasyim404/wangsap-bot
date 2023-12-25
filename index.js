const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

const ffmpegPath = "C:\\ffmpeg\\bin";
process.env.PATH += `;${ffmpegPath}`;

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  // console.log(process.env.PATH);
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    if (
      ["audio", "voice", "document", "location", "text"].includes(
        message.type
      ) &&
      [".sticker", "!sticker", "!stiker", ".stiker", "/stiker"].includes(
        message.body
      )
    ) {
      message.reply("Cuma bisa Foto, Video & Gif aja 🙏😁");
    } else if (
      ["image", "video", "gif"].includes(message.type) &&
      [".sticker", "!sticker", "!stiker", ".stiker", "/stiker"].includes(
        message.body
      )
    ) {
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
    } else if (
      ["image", "video", "gif"].includes(message.type) &&
      [
        ". stiker",
        ". sticker",
        "! stiker",
        "! sticker",
        "stiker",
        "kurni",
        ".kurni",
      ].includes(message.body)
    ) {
      message.reply(
        "Ngetiknya yang bener 😠,\npake *.stiker* atau *!stiker* yah."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("Waduh ada error nih dari sistem, mohon bersabar ini ujian.");
  }
});

client.on("message", async (message) => {
  try {
    if ([".help", "!help"].includes(message.body)) {
      message.reply(
        "*Perintah:*\n # Buat Sticker (Img, Vid, Gif):\nㅤ- .stiker\nㅤ- !stiker \n\nPerintah unik lainnya coming soon~"
      );
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("Waduh ada error nih dari sistem, mohon bersabar ini ujian.");
  }
});

client.initialize();
