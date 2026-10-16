// Сборка для Netlify: web/ -> dist/, ник бота подставляется в страницы, правила адресов пишутся в _redirects.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const BOT = (process.env.TG_BOT_USERNAME || "Seghan_armenia_bot").replace(/^@/, "");
const BACKEND = (process.env.BACKEND_URL || "").replace(/\/$/, "");

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/static", { recursive: true });
cpSync("web", "dist/static", { recursive: true });

for (const f of readdirSync("web").filter(f => f.endsWith(".html"))) {
  let html = readFileSync(`web/${f}`, "utf8").replaceAll("Seghan_armenia_bot", BOT);
  if (process.env.URL) html = html.replaceAll('content="/static/og.png"', `content="${process.env.URL}/static/og.png"`);
  writeFileSync(`dist/${f}`, html);
  writeFileSync(`dist/static/${f}`, html);
}

const lines = [];
if (BACKEND) {
  // всё живое (API, приглашения с превью, сертификаты, кабинеты) обслуживает бэкенд
  lines.push(`/api/*  ${BACKEND}/api/:splat  200`, `/i/*  ${BACKEND}/i/:splat  200`, `/health  ${BACKEND}/health  200`);
} else {
  // без бэкенда: заявки с сайта уходят вам в Telegram через функцию
  lines.push(`/api/orders  /.netlify/functions/orders  200`, `/api/visits  /.netlify/functions/orders  200`, `/i/*  /invite.html  200`);
}
lines.push("/business  /business.html  200", "/privacy  /privacy.html  200", "/gift/*  /gift.html  200", "/gift  /gift.html  200",
  "/partner  /partner.html  200", "/admin  /admin.html  200", "/make  /make.html  200", "/favicon.ico  /static/favicon.svg  200");
for (const f of ["robots.txt", "sitemap.xml"]) cpSync(`web/${f}`, `dist/${f}`);
writeFileSync("dist/_redirects", lines.join("\n") + "\n");
console.log(`SEGHAN build: bot @${BOT}, backend ${BACKEND || "нет (заявки в Telegram)"}`);
