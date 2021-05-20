var fs = require('fs');
const { getSunrise, getSunset } = require('sunrise-sunset-js');
const axios = require('axios');

function pathToSave() {
  let dir = 'uploads';
//  __dirname;
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = yyyy + '_' + mm + '_' + dd;
  dir +=  `\\${today}`;
  dir = `${__dirname}\\${dir}`;


  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  return dir;
}

function hasSun() {
  const sunset = getSunset(-22.594164, -47.386982);
  const sunrise = getSunrise(-22.594164, -47.386982);
  const check = new Date();

  return (check <= sunset && check >= sunrise)
}

function addZero(number){
  if (number <= 9)
      return "0" + number;
  else
      return number;
}

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

var CronJob = require('cron').CronJob;
var job = new CronJob('*/45 * * * * *', function() {
    (async () => {
      if(!hasSun()) {
        console.log("sem sol");
        return; // just get images with "sun"
      } else {
        console.log("com sol");
      }

      let date = new Date();
      let formatatedDate = (addZero(date.getDate() )) + "-" + (addZero(date.getMonth() + 1)) + "-" + date.getFullYear() + "_" + addZero(date.getHours()) + addZero(date.getMinutes()) + addZero(date.getSeconds());
      let pathToSaveImage = pathToSave();
      let example_image_1 = await download_image('http://192.168.11.52/capture?_cb=1619016818033',   `${pathToSaveImage}\\${formatatedDate}.jpg`);
    })();
}, null, true, 'America/Sao_Paulo');
job.start();