import 'dotenv/config';
import { ImapFlow } from 'imapflow';
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const required = ['EMAIL_USER','EMAIL_PASSWORD'];
for (const key of required) if (!process.env[key]) throw new Error('Missing required setting: ' + key);
const dbPath = resolve(process.env.DB_PATH || './data/leads.sqlite');
mkdirSync(dirname(dbPath), {recursive:true});
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS messages (
  uid INTEGER NOT NULL, mailbox TEXT NOT NULL, sender TEXT NOT NULL,
  subject TEXT NOT NULL, received_at TEXT, category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(mailbox, uid)
)`);
const insert = db.prepare('INSERT OR IGNORE INTO messages(uid,mailbox,sender,subject,received_at,category) VALUES (?,?,?,?,?,?)');
const classify = (s) => {
  const t=s.toLowerCase();
  if (/estimate|quote|bid|proposal|remodel|renovation|kitchen|bathroom|basement|addition|tenant finish|build.out|construction|contractor|project|repair/.test(t)) return 'potential-lead';
  return 'review';
};
export async function checkMailbox() {
  const client = new ImapFlow({
    host:process.env.IMAP_HOST || 'mail.privateemail.com',
    port:Number(process.env.IMAP_PORT || 993), secure:true,
    auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASSWORD},
    logger:false
  });
  await client.connect();
  let added=0;
  try {
    const lock=await client.getMailboxLock('INBOX');
    try {
      const start=Math.max(1,client.mailbox.exists-250);
      for await (const msg of client.fetch(`${start}:*`, {uid:true,envelope:true})) {
        const sender=msg.envelope?.from?.map(x=>x.address).filter(Boolean).join(', ') || '';
        const subject=msg.envelope?.subject || '(no subject)';
        const received=msg.envelope?.date?.toISOString?.() || null;
        const result=insert.run(msg.uid,'INBOX',sender,subject,received,classify(subject));
        added+=result.changes;
      }
    } finally {lock.release();}
  } finally {await client.logout();}
  return {added,at:new Date().toISOString()};
}
if (process.argv[1]?.endsWith('/worker.js')) {
  checkMailbox().then(x=>{console.log(JSON.stringify(x));db.close();}).catch(e=>{console.error(e.message);process.exitCode=1;});
}
