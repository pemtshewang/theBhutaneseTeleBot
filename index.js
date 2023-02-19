const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');
const webhookUrl = process.env.BOT_WEBHOOK_URL;
const bot = new TelegramBot(process.env.TOKEN,{ polling: true });

const getTopNews = async () => {
  try {
    const response = await axios.get('https://thebhutanese.bt/category/headline-stories/');
    const $ = cheerio.load(response.data);
    const headlines = [];
    $('.post-box-title a').each((index, element) => {
      headlines.push({
        title: $(element).text(),
        link: $(element).attr('href'),
      });
    });
    return headlines;
  } catch (error) {
    console.error(error);
    return [];
  }
};

bot.setWebHook(webhookUrl);
bot.onText(/\/topnews/, async (msg) => {
  const chatId = msg.chat.id;
  const headlines = await getTopNews();
  if (headlines.length === 0) {
    bot.sendMessage(chatId, 'Sorry, I could not fetch any top news at the moment.');
  } else {
    let message = 'Hi all 🤖\n\nTop News from <a href="https://thebhutanese.bt/category/headline-stories/">The Bhutanese</a>\n\n';
    for (let i = 0; i < 10 && i < headlines.length; i++) {
      message += `${i + 1}. <a href="${headlines[i].link}">${headlines[i].title}</a>\n\n`;
    }
    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }
});

let introduction = "Hello There!, I am a bot that will send you the top news from the the Bhutanese. \n\nTo get the top news, type /topnews. \n\n To render such web and bot services, contact me at 77272047/btinformativemessenger@gmail.com\n\nThank you😀";
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
    bot.sendMessage(chatId, introduction);
});

// Export the Vercel function
module.exports = (req, res) => {
  // Process the incoming request
  bot.processUpdate(req.body);

  // Send a response to acknowledge receipt of the request
  res.status(200).send('OK');
};

// const TelegramBot = require('node-telegram-bot-api');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cron = require('node-cron');

// const bot = new TelegramBot('5808519865:AAGPSojh7gxV0TF0dK4bfNnPVRgzB6ws0eE', { polling: true });

// const getTopNews = async () => {
//   try {
//     const response = await axios.get('https://thebhutanese.bt/category/headline-stories/');
//     const $ = cheerio.load(response.data);
//     const headlines = [];
//     $('.post-box-title a').each((index, element) => {
//       headlines.push({
//         title: $(element).text(),
//         link: $(element).attr('href'),
//       });
//     });
//     return headlines;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };

// cron.schedule('0 8 * * *', async () => {
//   const chatId = '<YOUR_CHAT_ID>'; // Replace with your group chat ID
//   const headlines = await getTopNews();
//   if (headlines.length === 0) {
//     bot.sendMessage(chatId, 'Sorry, I could not fetch any top news at the moment.');
//   } else {
//     let message = '';
//     for (let i = 0; i < 10 && i < headlines.length; i++) {
//       message += `${i + 1}. <a href="${headlines[i].link}">${headlines[i].title}</a>\n\n`;
//     }
//     bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
//   }
// });
