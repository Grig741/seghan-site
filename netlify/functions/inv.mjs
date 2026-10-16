// Приглашения без отдельного бэкенда: хранятся в Netlify Blobs, ответы гостей приходят вам в Telegram.
// GET  ?slug=...                 -> данные приглашения
// POST (заголовок x-key)         -> создать приглашение, вернуть ссылку
// POST ?slug=...&rsvp=1          -> ответ гостя: сохранить и прислать вам в Telegram
// GET  ?slug=...&list=1 (x-key)  -> все ответы по приглашению
import { getStore } from "@netlify/blobs";
import { tg } from "./tg.mjs";

const KEY = () => process.env.MAKE_KEY || process.env.TG_WEBHOOK_SECRET || "";
const ADMIN = () => String(process.env.TG_ADMIN_ID || "8530447089");
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const str = (v, n) => String(v ?? "").trim().slice(0, n);
const TR = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sh",ы:"y",э:"e",ю:"yu",я:"ya",
  ա:"a",բ:"b",գ:"g",դ:"d",ե:"e",զ:"z",է:"e",ը:"y",թ:"t",ժ:"zh",ի:"i",լ:"l",խ:"kh",ծ:"ts",կ:"k",հ:"h",ձ:"dz",ղ:"gh",ճ:"ch",մ:"m",յ:"y",ն:"n",շ:"sh",ո:"o",չ:"ch",պ:"p",ջ:"j",ռ:"r",ս:"s",վ:"v",տ:"t",ր:"r",ց:"ts",ւ:"v",փ:"p",ք:"k",օ:"o",ֆ:"f" };
const slugify = s => [...s.toLowerCase()].map(c => TR[c] ?? c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
const auth = req => KEY() && req.headers.get("x-key") === KEY();

export default async (req) => {
  const u = new URL(req.url), slug = str(u.searchParams.get("slug"), 60);
  const inv = getStore({ name: "invites", consistency: "strong" }), ans = getStore({ name: "rsvp", consistency: "strong" });

  if (req.method === "GET") {
    if (!slug) return json({ detail: "Нет ссылки" }, 400);
    if (u.searchParams.get("list") === "1") {
      const d = await inv.get(slug, { type: "json" });
      const k = req.headers.get("x-key") || "";
      if (!d || !(auth(req) || (d.owner && k === d.owner))) return json({ detail: "Неверный ключ" }, 403);
      return json((await ans.get(slug, { type: "json" })) || []);
    }
    const d = await inv.get(slug, { type: "json" });
    if (!d) return json({ detail: "Приглашение не найдено" }, 404);
    const { owner, ...pub } = d;
    return json(pub);
  }
  if (req.method !== "POST") return json({ detail: "Метод не поддерживается" }, 405);
  const b = await req.json().catch(() => null);
  if (!b) return json({ detail: "Пустой запрос" }, 400);

  if (u.searchParams.get("rsvp") === "1") {
    const d = slug && await inv.get(slug, { type: "json" });
    if (!d) return json({ detail: "Приглашение не найдено" }, 404);
    const name = str(b.name, 80);
    if (!name) return json({ detail: "Нужно имя" }, 400);
    const r = { name, attending: !!b.attending, guests: Math.max(0, Math.min(20, +b.guests || 0)), children: Math.max(0, Math.min(20, +b.children || 0)), key: str(b.guest_key, 40), at: new Date().toISOString() };
    const list = (await ans.get(slug, { type: "json" })) || [];
    const i = r.key ? list.findIndex(x => x.key === r.key) : -1;
    if (i >= 0) list[i] = r; else list.push(r);
    if (list.length > 2000) return json({ detail: "Слишком много ответов" }, 429);
    await ans.setJSON(slug, list);
    const yes = list.filter(x => x.attending), ad = yes.reduce((s, x) => s + x.guests, 0), ch = yes.reduce((s, x) => s + x.children, 0);
    await tg("sendMessage", { chat_id: ADMIN(), text:
      `${d.name1}${d.name2 ? " & " + d.name2 : ""} · ответ гостя${i >= 0 ? " (изменил)" : ""}\n\n${r.name}: ${r.attending ? `придёт, взрослых ${r.guests}${r.children ? ", детей " + r.children : ""}` : "не сможет"}\n\nВсего придут: взрослых ${ad}, детей ${ch} · ответов ${list.length}` }).catch(() => {});
    return json({ ok: true });
  }

  if (!auth(req)) return json({ detail: "Неверный ключ" }, 403);
  const name1 = str(b.name1, 60), starts = str(b.starts_at, 40);
  if (!name1 || !starts || isNaN(new Date(starts))) return json({ detail: "Нужны имя и дата" }, 400);
  let s = slugify(name1 + (b.name2 ? "-" + b.name2 : "")) || "inv", base = s;
  for (let n = 2; await inv.get(s); n++) s = base + "-" + n;
  const d = {
    slug: s, event_type: "wedding", lang: ["hy", "ru", "en"].includes(b.lang) ? b.lang : "hy", theme: Math.max(0, Math.min(39, +b.theme || 0)),
    name1, name2: str(b.name2, 60), starts_at: starts, venue: str(b.venue, 120), address: str(b.address, 200), message: str(b.message, 600),
    rsvp_by: str(b.rsvp_by, 10), gift_from: str(b.gift_from, 80),
    story: (Array.isArray(b.story) ? b.story : []).slice(0, 6).map(x => ({ year: str(x.year, 12), title: str(x.title, 80), text: str(x.text, 400), icon: str(x.icon, 12) })),
    program: (Array.isArray(b.program) ? b.program : []).slice(0, 8).map(x => ({ time: str(x.time, 5), title: str(x.title, 80), place: str(x.place, 120) })),
    owner: crypto.randomUUID().replace(/-/g, "").slice(0, 16),
    created: new Date().toISOString()
  };
  await inv.setJSON(s, d);
  return json({ ok: true, slug: s, url: "/i/" + s, host_url: "/i/" + s + "?k=" + d.owner });
};
