const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});
// const ffmpeg = require("fluent-ffmpeg");
// const ffmpegStaticPath = require("ffmpeg-static");

// ffmpeg.setFfmpegPath(ffmpegStaticPath);

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    if (
      ["video", "gif", "audio", "voice", "document", "location", ""].includes(
        message.type
      ) &&
      [".sticker", "!sticker", "!stiker", ".stiker", "/stiker"].includes(
        message.body
      )
    ) {
      message.reply("Cuma bisa foto 🙏😁\nVideo & Gif `Coming Soon`");
    } else if (
      ["image"].includes(message.type) &&
      [".sticker", "!sticker", "!stiker", ".stiker", "/stiker"].includes(
        message.body
      )
    ) {
      const media = await message.downloadMedia();

      // if (message.type === "video" && message.type === "gif") {
      //   const videoDuration = parseFloat(message.duration);
      //   if (isNaN(videoDuration) || videoDuration >= 0) {
      //     message.reply("Gabisa dulu lur");
      //     return;
      //   }
      // }

      message.reply(
        media,
        undefined, // caption (optional)
        {
          sendMediaAsSticker: true,
          stickerName: "ㅤ",
          stickerAuthor: "ㅤ",
        }
      );
    } else if (
      ["image", "video"].includes(message.type) &&
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
        "Ngetiknya yang bener 😠,\npake `.stiker` atau `!stcker` coba."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("Maaf, ada kesalahan. Tolong jangan dibully.");
  }
});

// Chat bales otomatis
client.on("message", async (message) => {
  try {
    if (["p", "P"].includes(message.body)) {
      message.reply(
        "Kamu nyari aku? 😨 \nKalo mau pake sticker commandnya `.stiker` atau `!stcker` ya 😁"
      );
    } else if ([".help", "!help"].includes(message.body)) {
      message.reply(
        "Command Img to Sticker:\n- .stiker\n- !stiker \n\nInfo:\nUntuk Video & Gif to Sticker Nanti ya, mohon ditunggu.."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("Maaf, ada kesalahan. Tolong jangan dibully.");
  }
});

// Mention everyone
// client.on("message", async (msg) => {
//   if (msg.body === "!everyone") {
//     const chat = await msg.getChat();

//     let text = "";
//     let mentions = [];

//     for (let participant of chat.participants) {
//       const contact = await client.getContactById(participant.id._serialized);

//       mentions.push(contact);
//       text += `@${participant.id.user} `;
//     }

//     await chat.sendMessage(text, { mentions });
//   }
// });

client.initialize();
