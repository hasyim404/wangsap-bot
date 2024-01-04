const convertapi = require('convertapi')('c9CU3XiuRSAMfYAx');

const cloudConvert = require('cloudconvert');
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjM4YjJjM2VkNjhiZTZkN2ZiYWUwZWEyYzRiYzdjMDI2ZmQzMzFiYTI2ZjUzNTM2OWM3MTM2NTY4MDhmYTNiMDJlZWU5ZmRiNDM5NzA4NGMiLCJpYXQiOjE3MDQzODg0MzYuMjg0NTgzLCJuYmYiOjE3MDQzODg0MzYuMjg0NTg1LCJleHAiOjQ4NjAwNjIwMzYuMjgwMTc2LCJzdWIiOiI2NjcwOTkzMyIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.C0-k0YRorxby0uRIldrLe_i1ycWhs-T31zg6f7O7QXzbp7SOQUdF-O7vWTLJj9LH1RkiIQv3WGL3ByU0F94rmUUu7jcfr6jBmJfIL9T9rqzbVPlyYfLGCjleDddXgAOh6rk7uSpcuxt2Ya4mjEfrnp-WxprysPEv-UHuhI9Uq1S_tOBenW7_R1QsBnKHrOn9H5pjBrAyl3VVzDH4KrSZUvwT8p6Fth7c9Fx_44FaFU0dQWwhvmViV2gPfeZvRCYCE36k4MJremXZR0NSaKK9POTuiio5bXa5aHSo8GAUhM0jTZHzKYTN9gwxhYT9uMLXnOajcvFRowQJnWcFJnsrO94HxaajXfH-8vy81XFatHm-1Hmmm-QdmjRuXVI6-Cc594oLw9fQDXrsWWb1QKPagMvgYNxnuRrpcyDR9a3ePElCgjABegJAAu3MCqn-I0yflNrIRKKNfm9-DZI8HjY9NfhlutpqKgJURb5OW6QlCt7ig6GrFVtmwrKpYWHAxBWUsOutCaFZwu7x4k7OWzfJEqXrC8m974ic-EyfsGDio3miOWtNC6t9R3JsnRjqBDeBHmo9GMdi86umagIJ-J1yzatGAE8vo1k3nlD3nM4xpPLmns8NJnyY698BW13qB0AUJmYnTqeE6CPQD3VYi0wYkkKuYnO6sZeU1qHfcXbYGCM';




// async function WebpToGif() {
//     let gifUrl;
//     try {
//     const result = await new Promise((resolve, reject) => {
//         convertapi.convert('gif', {
//         Files: ['resource/input.webp'],
//         AnimationDelay: '0'
//         }).then(resolve).catch(reject);
//     });

//     gifUrl = result.response.Files[0].Url;

//     if (!gifUrl) {
//         throw new Error("Gagal mendapatkan URL GIF.");
//     }
//     return gifUrl
//     } catch (error) {
//     console.error('Error converting stiker to gif:', error);
//     return;
//     }
// }

async function gifToMp4() {
    const cloudConvertInstance = new cloudConvert(apiKey);
    try {
        let exampleJob = await cloudConvertInstance.jobs.create({
            "tasks": {
                "import-my-file": {
                    "operation": "import/upload",
                    "file": ['/resource/input.webp']
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
        console.log(file.url)
        return file.url

    } catch (error) {
        console.error('Error:', error);
    }
}

async function convertAndExport() {
    // await WebpToGif();
    // console.log(await WebpToGif());
    await gifToMp4()
}

convertAndExport();