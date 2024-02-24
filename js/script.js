const nodemailer = require('nodemailer');
const axios = require('axios');
const { schedule } = require('node-cron');


// Конфигурация SMTP сервера
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true, 
  auth: {
    user: 'apikey', 
    pass: '******************************************************' 
  }
});

const domains = ['cnn.com', 'fdsf55sfds.com', 't.org'];

const options = {
  method: 'GET',
  url: 'https://domain-checker7.p.rapidapi.com/whois',
  headers: {
    'X-RapidAPI-Key': '*************************************************',
    'X-RapidAPI-Host': 'domain-checker7.p.rapidapi.com'
  }
};


async function fetchData(domain) {
  try {
    const response = await axios.request({
      ...options,
      params: {
        domain: domain
      }
    });
    console.log(response.data);
    if (response.data.available) {
      sendEmail(domain);
    } else {
//      console.log(`Домен ${domain} недоступен.`);
    }
  } catch (error) {
    console.error(error);
  }
}



// Функция отправки письма
function sendEmail(domain) {
  const mailOptions = {
    from: 'from@gmail.com', // ваш адрес электронной почты
    to: 'to@gmail.com', // адрес получателя
    subject: 'Тема вашего письма',
    text: `Домен ${domain} доступен`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Ошибка отправки письма:', error);
    }
    console.log('Письмо успешно отправлено:', info.response);
  });
}

console.log('Скрипт запущен');

// Перебираем массив domains и для каждого домена вызываем функцию fetchData
schedule('0 * * * *', () => {
    domains.forEach(domain => {
        fetchData(domain);
    });
});
