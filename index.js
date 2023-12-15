const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});
const ffmpeg = require("fluent-ffmpeg");
const ffmpegStaticPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegStaticPath);

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  try {
    if (message.body === "!ping") {
      client.sendMessage(message.from, "pong");
    } else if (
      (message.type === "image" || message.type === "video") &&
      (message.body === ".sticker" ||
        message.body === "!sticker" ||
        message.body === "!stiker" ||
        message.body === ".stiker" ||
        message.body === "/stiker")
    ) {
      const media = await message.downloadMedia();

      client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
        stickerName: "",
        stickerAuthor: "",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
    client.sendMessage(
      message.from,
      "maaf bro ada kesalahan, tolong jangan dibully"
    );
  }
});

// Mention everyone
client.on("message", async (msg) => {
  if (msg.body === "!everyone") {
    const chat = await msg.getChat();

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);

      mentions.push(contact);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  }
});

client.initialize();
