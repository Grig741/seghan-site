// Заявки с сайта, когда бэкенда нет: отправляются вам в Telegram тем же ботом.
import { tg } from "./tg.mjs";

export default async (req) => {
  if (req.method !== "POST") return Response.json({ detail: "POST only" }, { status: 405 });
  let b = {};
  try { b = await req.json(); } catch {}
  if (new URL(req.url).pathname.endsWith("/visits")) return new Response(null, { status: 204 });
  const contact = String(b.contact || "").trim().slice(0, 160);
  if (b.source !== undefined && !b.contact) return new Response(null, { status: 204 }); // учёт переходов: без бэкенда не храним
  if (contact.length < 3) return Response.json({ detail: "contact: оставьте Telegram или телефон" }, { status: 422 });
  const p = b.payload || {};
  const who = b.kind === "business" ? "Бизнес" : "Пара";
  const what = p.business || [p.name1, p.name2].filter(Boolean).join(" и ");
  const text = `Новая заявка с сайта\n${who}: ${contact}\n${what} ${p.starts_at || ""}\n${p.venue || ""}\nТариф: ${b.plan || ""}${b.source === "invite" ? "\nПришёл с чужого приглашения" : ""}`;
  const r = await tg("sendMessage", { chat_id: String(process.env.TG_ADMIN_ID || "8530447089"), text });
  return r.ok ? Response.json({ ok: true }, { status: 201 }) : Response.json({ detail: "Не получилось отправить. Напишите нам в Telegram." }, { status: 502 });
};
