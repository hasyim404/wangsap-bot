switch (true) {
      // TEST CASE FOR .GIF COMMAND
      case [""].includes(body):
        if (message.type === "sticker" && !message.body)
          await delay(timeer);
          message.reply("Mengubah stiker menjadi gif...");
          await delay(timeer);
          if (message.type === "sticker") {
            const stickerMedia = await message.downloadMedia();
              
            // Test 1 - Convert webp base64 to gif base64 (without converter), then write output.gif file from gif base64
            // Only work if use wa web
            // Make sure sendMediaAsDocument: true
            
            // const buffer = stickerMedia.data;
            // fs.writeFileSync('output.gif', buffer, 'base64');
            // const media = MessageMedia.fromFilePath('output.gif');

            //Test 2 - Convert webp base64 to gif files, convert gif files to mp4 files via API
            // GOTO:: Index.js

            // Test 3 - Convert webp base64 to mp4, then convert mp4 to gif
            // const buffer = stickerMedia.data;
            // fs.writeFileSync('input.webp', buffer, 'base64');

            // const inputFile = 'input.webp';
            // const outputFile = 'output.mp4';

            // const ffmpegCommand = `ffmpeg -i ${inputFile} ${outputFile}`;

            // exec(ffmpegCommand, (error, stdout, stderr) => {
            //   if (error) {
            //     console.error(`Error: ${error.message}`);
            //     return;
            //   }
            //   console.log(`Conversion successful!`);
            // });

            // const media = MessageMedia.fromFilePath('output.mp4');

            // Test 4 - Convert webp base64 to gif base64 without converter
            // const media = new MessageMedia('image/gif', stickerMedia.data, 'sticker');
            // message.reply(media, undefined, {
            //   caption: "Inilah gif dari stiker!",
            //   sendVideoAsGif: true,
            //   sendMediaAsDocument: true
            // });

            // if (fs.existsSync('input.webp')) {
            //   fs.unlinkSync('input.webp');
            // }

          } else {
            message.reply("Stiker yang di-reply bukan stiker gif.");
          }
          await delay(timeer);
          break;

}