import Twit from "twit";
import dotenv  from "dotenv";

dotenv.config();

interface ITdata {
  consumer_key:       any,
  consumer_secret:    any,
  access_token:       any,
  access_token_secret:any,
  timeout_ms:         number,  // optional HTTP request timeout to apply to all requests.
  strictSSL:          true,   
}

const options = {
  consumer_key : process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
  strictSSL: true,
} as ITdata;

export default function sendVideoToTwitter(filePath:string, twittermessage: string) {
  let T = new Twit(options);
  T.postMediaChunked({ file_path: filePath }, function (err, data:any, response) {
    console.log("****data*****");
    console.log(data);
    console.log("*****err****");
    console.log(err);
    console.log("****response*****");
    console.log(response);
    console.log("*********");
    const mediaIdStr = data.media_id_string;
    const meta_params = { media_id: mediaIdStr };
  
    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if(!err) {
        const params = { status: twittermessage, media_ids: [mediaIdStr] };
        
        console.log("esperando 10 segundos");
        setTimeout(() => {
          T.post('statuses/update', params, function (err, tweet, response) {          
            console.log(tweet);
    
            if (!err) {
              console.log("Post feito no Twitter!");
            } else {
              console.log("deu erro no update")
              console.log(err);
            }
          }); // fim TPost Update
        }, 10000);
      } else {
        console.log('deu erro no create');
        console.log(err);
      }
    }); // TPost create
  })
}