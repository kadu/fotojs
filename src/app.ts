// import shell from 'shelljs';
// import sendVideoToTwitter from "./twitter";
import { CronJob } from 'cron';
import { download_image } from "./utils";

const config = [
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '* * * * *', // “At every minute.”
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_daily',
    video_cron: '0 0 * * 0', //“At 00:00 on Sunday.”
    twitter_message: ''
  },
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '*/30 * * * *', // “At every 30th minute.”
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_weekly',
    video_cron: '0 0 5 * *', // “At 00:00 on day-of-month 5.”
    twitter_message: ''
  },
  {
    imageURL: 'http://192.168.11.52/capture?_cb=1619016818033',
    cron: '0 * * * *', // “At minute 0.”
    lat: -22.594164,
    lng: -47.386982,
    tz: 'America/Sao_Paulo',
    dir: 'manjericao_monthly',
    video_cron: '0 0 10 */6 *', // “At 00:00 on day-of-month 10 in every 6th month.”
    twitter_message: ''
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

let cjDaily   = createCronJob(config[0]);
let cjWeekly  = createCronJob(config[1]);
let cjMonthly = createCronJob(config[2]);

console.log("⚡️ Starting cronjobs");
if (!cjDaily.running) {
  console.log(' ⏰ - Daily OK');
  cjDaily.start();
}

if (!cjWeekly.running) {
  console.log(' ⏰ - Weekly OK');
  cjWeekly.start();
}

if (!cjMonthly.running) {
  console.log(' ⏰ - Monthly OK');
  cjMonthly.start();
}