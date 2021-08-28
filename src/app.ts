import shell from 'shelljs';
import sendVideoToTwitter from "./twitter";
import { CronJob } from 'cron';
import { download_image, pathToSave, dirToSave } from "./utils";

const config = [
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '* * * * *', // “At every minute.”
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_daily',
    video_cron: '0 0 * * 0', //“At 00:00 on Sunday.”
    twitter_message: 'Atualização semanal do ManjeriçãoIOT (Fotos tiradas a cada minuto)'
  },
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '*/30 * * * *', // “At every 30th minute.”
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_weekly',
    video_cron: '0 0 5 * *', // “At 00:00 on day-of-month 5.”
    twitter_message: 'Hoje é dia de pagamento, logo vamos ver o vídeo mensal do crescimento do ManjericãoIOT (fotos a cada 30 minutos)'
  },
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '0 * * * *', // “At minute 0.”
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_monthly',
    video_cron: '0 0 10 */6 *', // “At 00:00 on day-of-month 10 in every 6th month.”
    twitter_message: 'Nem parece mas já se passaram 6 meses, vamos ver como o MangeriçãoIOT está!'
  }
];

function createCronJob(_config: any) {
  return new CronJob(_config.cron, async () => {
    try {    
      download_image(_config);    
    } catch (e: any) {
      console.log(e);
    }
  }, null, true, _config.tz);
}

function createCronVideoJob(_config: any) {
  return new CronJob(_config.video_cron, async () => {
    console.log('starting video cron');
    let dir = dirToSave(_config.dir);
    shell.exec(`ffmpeg -framerate 30 -y -pattern_type glob -i "${dir}*.jpg" -preset slow -s:v 800x600 -c:v libx264 -crf 18 -filter:v "setpts=0.10*PTS" -pix_fmt yuv420p -strict -2 -acodec aac ${dir}timelapse.mp4`).code;
    sendVideoToTwitter(`${dir}timelapse.mp4`, _config.twitter_message);
  }, null, true, _config.tz);
}

let cjDaily        = createCronJob(config[0]);
let cjDailyVideo   = createCronVideoJob(config[0]);
let cjWeekly       = createCronJob(config[1]);
let cjWeeklyVideo  = createCronVideoJob(config[1]);
let cjMonthly      = createCronJob(config[2]);
let cjMonthlyVideo = createCronVideoJob(config[2]);

console.log("⚡️ Starting cronjobs");

//daily
if (!cjDaily.running) {
  console.log(' ⏰ - Daily OK');
  cjDaily.start();
}
if (!cjDailyVideo.running) {
  console.log(' ⏰ - Daily OK');
  cjDailyVideo.start();
}
// Weekly
if (!cjWeekly.running) {
  console.log(' ⏰ - Weekly OK');
  cjWeekly.start();
}
if (!cjWeeklyVideo.running) {
  console.log(' ⏰ - Weekly OK');
  cjWeeklyVideo.start();
}
// Monthly
if (!cjMonthly.running) {
  console.log(' ⏰ - Monthly OK');
  cjMonthly.start();
}
if (!cjMonthlyVideo.running) {
  console.log(' ⏰ - Monthly OK');
  cjMonthlyVideo.start();
}