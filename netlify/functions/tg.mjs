// Telegram-бот SEGHAN: клиенты пишут боту, бот пересылает вам; вы отвечаете реплаем, бот отправляет ответ клиенту.
// Переменные Netlify: TG_BOT_TOKEN, TG_ADMIN_ID (ваш chat id), TG_WEBHOOK_SECRET (любая длинная строка).
const API = () => `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}`;
const ADMIN = () => String(process.env.TG_ADMIN_ID || "8530447089");

export async function tg(method, body) {
  const r = await fetch(`${API()}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) console.error("TG", method, r.status, j.description || "", process.env.TG_BOT_TOKEN ? "token set" : "TG_BOT_TOKEN EMPTY");
  return j;
}

const MENU = { keyboard: [[{ text: "Хочу приглашение на свадьбу" }], [{ text: "Я из банкетного зала" }, { text: "Есть вопрос" }]], resize_keyboard: true };
const HELLO =
  "Здравствуйте! Это SEGHAN, онлайн-приглашения на свадьбу.\n\n" +
  "Напишите сюда, что вас интересует: дату свадьбы, сколько примерно гостей, или вопрос. Ответим здесь же в течение дня.\n\n" +
  "Բարև Ձեզ։ Գրեք այստեղ, կպատասխանենք նույն օրը։";
const TAG = /#u(\d+)/;

function who(u) {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Без имени";
  return `${name}${u.username ? " @" + u.username : ""} #u${u.id}`;
}

export async function handle(update) {
  const m = update.message;
  if (!m || !m.from) return;
  const admin = ADMIN();

  // вы пишете боту
  if (String(m.chat.id) === admin) {
    const src = m.reply_to_message;
    const ref = src && ((src.text || "") + " " + (src.caption || "")).match(TAG);
    if (!ref) {
      if (m.text === "/start") return tg("sendMessage", { chat_id: admin, text: "Бот работает. Сообщения клиентов будут приходить сюда. Чтобы ответить, сделайте реплай (свайп влево) на сообщение клиента." });
      return tg("sendMessage", { chat_id: admin, text: "Чтобы ответить клиенту, сделайте реплай на его сообщение (свайп влево по сообщению)." });
    }
    const res = await tg("copyMessage", { chat_id: ref[1], from_chat_id: admin, message_id: m.message_id });
    return tg("sendMessage", { chat_id: admin, reply_to_message_id: m.message_id,
      text: res.ok ? "Отправлено" : `Не доставлено: ${res.description || "клиент заблокировал бота"}` });
  }

  // клиент пишет боту
  if (m.text === "/start") {
    await tg("sendMessage", { chat_id: m.chat.id, text: HELLO, reply_markup: MENU });
    return tg("sendMessage", { chat_id: admin, text: `Новый клиент открыл бота\n${who(m.from)}` });
  }
  const head = `${who(m.from)}`;
  if (m.text) {
    await tg("sendMessage", { chat_id: admin, text: `${head}\n\n${m.text}` });
  } else {
    // фото, голосовое, файл: копия с подписью-меткой, чтобы на неё тоже можно было ответить реплаем
    const cap = ((m.caption || "") + `\n\n${head}`).trim().slice(0, 1000);
    const res = await tg("copyMessage", { chat_id: admin, from_chat_id: m.chat.id, message_id: m.message_id, caption: cap });
    if (!res.ok) {
      await tg("sendMessage", { chat_id: admin, text: `${head}\n(вложение ниже, отвечайте реплаем на ЭТО сообщение)` });
      await tg("forwardMessage", { chat_id: admin, from_chat_id: m.chat.id, message_id: m.message_id });
    }
  }
  if (["Хочу приглашение на свадьбу", "Я из банкетного зала", "Есть вопрос"].includes(m.text)) {
    const hint = m.text.startsWith("Я из") ? "Спасибо! Напишите название зала и как с вами удобнее связаться. Расскажем про пилот: 3 свадьбы бесплатно."
      : m.text.startsWith("Хочу") ? "Отлично! Напишите дату свадьбы, имена и примерное число гостей. Пришлём пример приглашения."
      : "Напишите ваш вопрос, ответим здесь же.";
    return tg("sendMessage", { chat_id: m.chat.id, text: hint });
  }
  if (!update._quiet) return tg("sendMessage", { chat_id: m.chat.id, text: "Получили, ответим здесь же." });
}

export default async (req) => {
  if (req.method !== "POST") {
    const q = new URL(req.url).searchParams;
    if (q.get("check") !== "1" || !process.env.TG_WEBHOOK_SECRET || q.get("key") !== process.env.TG_WEBHOOK_SECRET) return new Response("SEGHAN bot", { status: 200 });
    const t = process.env.TG_BOT_TOKEN || "";
    const me = t ? await tg("getMe", {}) : { ok: false, description: "TG_BOT_TOKEN пустой" };
    const sent = t ? await tg("sendMessage", { chat_id: ADMIN(), text: "Проверка: бот может писать вам." }) : {};
    const out = {
      token: t ? `есть (${t.length} символов, начинается ${t.slice(0, 4)}…)` : "НЕТ",
      secret: process.env.TG_WEBHOOK_SECRET ? "есть" : "нет",
      admin: ADMIN(),
      getMe: me.ok ? "ok @" + me.result.username : "ошибка: " + me.description,
      sendToAdmin: sent.ok ? "ok" : "ошибка: " + (sent.description || "-"),
    };
    return new Response(JSON.stringify(out, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
  }
  const secret = process.env.TG_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) return new Response("forbidden", { status: 403 });
  console.log("update in, token", process.env.TG_BOT_TOKEN ? "set" : "EMPTY");
  try { await handle(await req.json()); } catch (e) { console.error(e); }
  return new Response("ok");   // Telegram должен получить 200, иначе будет слать повторно
};
