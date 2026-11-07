const http=require("http"),fs=require("fs"),path=require("path"),{spawn}=require("child_process");
const PORT=Number(process.env.PORT||8080),KEY=process.env.YOUTUBE_STREAM_KEY;
let children=[];
function run(cmd,args,name){const p=spawn(cmd,args,{stdio:"inherit"});children.push(p);p.on("exit",(c,s)=>{console.error(name+" exited",c,s);if(name==="ffmpeg"&&c!==0)process.exit(1)});return p}
const srv=http.createServer((req,res)=>{if(req.url==="/"||req.url==="/health"){res.writeHead(200,{"content-type":"text/plain"});return res.end("AUTO SLICE live runner running")}if(req.url==="/index.html"&&fs.existsSync(path.join(__dirname,"index.html"))){res.writeHead(200,{"content-type":"text/html; charset=utf-8"});return fs.createReadStream(path.join(__dirname,"index.html")).pipe(res)}res.writeHead(404);res.end("Not found")});
srv.listen(PORT,"0.0.0.0",()=>{console.log("Health server on",PORT);if(!KEY){console.error("Missing YOUTUBE_STREAM_KEY; stream not started");return}
run("Xvfb",[":99","-screen","0","540x960x24","-nolisten","tcp"],"Xvfb");
setTimeout(()=>{run("chromium",["--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--no-first-run","--no-default-browser-check","--kiosk","--window-size=540,960","--window-position=0,0","file:///app/index.html"],"chromium");
setTimeout(()=>run("ffmpeg",["-hide_banner","-loglevel","warning","-thread_queue_size","512","-f","x11grab","-framerate","24","-video_size","540x960","-i",":99.0+0,0","-f","lavfi","-i","anullsrc=channel_layout=stereo:sample_rate=44100","-c:v","libx264","-preset","ultrafast","-tune","zerolatency","-pix_fmt","yuv420p","-r","24","-g","48","-b:v","1200k","-maxrate","1200k","-bufsize","2400k","-c:a","aac","-b:a","96k","-ar","44100","-f","flv","rtmp://a.rtmp.youtube.com/live2/"+KEY],"ffmpeg"),5000)},1500)});
function stop(){for(const p of children){try{p.kill("SIGTERM")}catch{}}srv.close(()=>process.exit(0));setTimeout(()=>process.exit(0),2500).unref()}
process.on("SIGTERM",stop);process.on("SIGINT",stop);
