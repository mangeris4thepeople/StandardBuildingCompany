import 'dotenv/config';
import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import Database from 'better-sqlite3';
import { resolve } from 'node:path';
import { checkMailbox } from './worker.js';

if (!process.env.ADMIN_TOKEN || process.env.ADMIN_TOKEN.length < 24) throw new Error('Set a random ADMIN_TOKEN (24+ chars) before starting');
const db = new Database(resolve(process.env.DB_PATH || './data/leads.sqlite'));
const secret=Buffer.from(process.env.ADMIN_TOKEN);
const authorized=req=>{
  const token=req.headers.authorization?.replace(/^Bearer /i,'') || '';
  const candidate=Buffer.from(token);
  return candidate.length===secret.length && timingSafeEqual(candidate,secret);
};
let checking=false;
const check=async()=>{if(checking)return;checking=true;try{console.log('Mailbox check',await checkMailbox());}catch(e){console.error('Mailbox check failed:',e.message);}finally{checking=false;}};
const server=http.createServer((req,res)=>{
  res.setHeader('Content-Type','application/json');
  res.setHeader('Cache-Control','no-store');
  if(req.url==='/health' && req.method==='GET'){res.end(JSON.stringify({ok:true}));return;}
  if(!authorized(req)){res.writeHead(401);res.end(JSON.stringify({error:'unauthorized'}));return;}
  if(req.url==='/leads' && req.method==='GET'){
    const leads=db.prepare("SELECT uid,mailbox,sender,subject,received_at,category,status FROM messages ORDER BY received_at DESC LIMIT 200").all();
    res.end(JSON.stringify({leads}));return;
  }
  if(req.url==='/check' && req.method==='POST'){check();res.writeHead(202);res.end(JSON.stringify({accepted:true}));return;}
  res.writeHead(404);res.end(JSON.stringify({error:'not found'}));
});
const port=Number(process.env.PORT||8080);
server.listen(port,()=>{console.log('Lead agent listening on',port);check();});
const seconds=Math.max(60,Number(process.env.POLL_SECONDS||120));
setInterval(check,seconds*1000).unref();
