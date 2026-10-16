// общие помощники для всех страниц
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pathArg = () => decodeURIComponent(location.pathname.split("/").filter(Boolean).slice(1).join("/"));
const store = { get(k) { try { return localStorage.getItem(k) } catch { return null } }, set(k, v) { try { localStorage.setItem(k, v) } catch {} }, del(k) { try { localStorage.removeItem(k) } catch {} } };

async function api(path, { method = "GET", body, key, headers = {} } = {}) {
  const h = { ...headers };
  if (body !== undefined) h["Content-Type"] = "application/json";
  if (key) h.Authorization = "Bearer " + key;
  let res;
  try { res = await fetch(path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) }) }
  catch { throw new Error("Нет связи с сервером. Проверьте интернет и повторите.") }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error(data.detail || "Ошибка " + res.status); e.status = res.status; throw e }
  return data;
}

async function copyText(text, btn) {
  try { await navigator.clipboard.writeText(text); if (btn) { const t = btn.textContent; btn.textContent = "Скопировано"; setTimeout(() => btn.textContent = t, 1600) } }
  catch { const r = document.createRange(); const n = btn?.previousElementSibling; if (n) { r.selectNodeContents(n); getSelection().removeAllRanges(); getSelection().addRange(r) } }
}

// розетка: генеративный орнамент из повёрнутых лепестков
function rosette(n = 12) {
  let p = "";
  for (let i = 0; i < n; i++) p += `<g transform="rotate(${i * 360 / n} 50 50)"><path d="M50 50C44 36 44 20 50 6C56 20 56 36 50 50Z"/><circle cx="50" cy="13" r="1.6"/></g>`;
  return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="50" cy="50" r="47"/><circle cx="50" cy="50" r="6"/>${p}</svg>`;
}

const T = {
  hy: { lead: { wedding: "Սիրով հրավիրում ենք մեր հարսանիքին", christening: "Սիրով հրավիրում ենք կնունքի", anniversary: "Սիրով հրավիրում ենք հոբելյանին", engagement: "Սիրով հրավիրում ենք նշանադրության", birthday: "Սիրով հրավիրում ենք ծննդյան տոնին" },
    and: "և", d: "օր", h: "ժամ", m: "րոպե", s: "վրկ", where: "Վայրը", q: "Կգա՞ք", yes: "Կգամ", no: "Չեմ կարող", name: "Ձեր անունը", count: "Քանի՞ հոգի", need: "Գրեք ձեր անունը", ty: "Շնորհակալություն, սպասում ենք ձեզ", tn: "Ափսոս։ Շնորհակալություն պատասխանի համար", change: "Փոխել պատասխանը", gift: "Նվեր՝", past: "Միջոցառումն արդեն կայացել է",
    months: ["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի"] },
  ru: { lead: { wedding: "Приглашаем вас на нашу свадьбу", christening: "Приглашаем вас на крестины", anniversary: "Приглашаем вас на юбилей", engagement: "Приглашаем вас на помолвку", birthday: "Приглашаем вас на день рождения" },
    and: "и", d: "дней", h: "часов", m: "минут", s: "секунд", where: "Место", q: "Вы придёте?", yes: "Приду", no: "Не смогу", name: "Ваше имя", count: "Сколько вас", need: "Напишите ваше имя", ty: "Спасибо, ждём вас", tn: "Жаль. Спасибо, что ответили", change: "Изменить ответ", gift: "Подарок от", past: "Событие уже прошло",
    months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"] },
  en: { lead: { wedding: "Together with our families we invite you to our wedding", christening: "We invite you to the christening", anniversary: "We invite you to the anniversary", engagement: "We invite you to our engagement", birthday: "We invite you to the birthday party" },
    and: "&", d: "days", h: "hours", m: "min", s: "sec", where: "Venue", q: "Will you come?", yes: "I'll come", no: "Can't make it", name: "Your name", count: "How many of you", need: "Please enter your name", ty: "Thank you, see you there", tn: "Sorry to miss you. Thanks for replying", change: "Change my answer", gift: "A gift from", past: "The event has taken place",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
};
// дата события всегда показывается по времени Еревана, где бы ни был гость
function eventParts(iso) {
  const d = new Date(new Date(iso).getTime() + 4 * 3600e3);
  return { day: d.getUTCDate(), month: d.getUTCMonth(), year: d.getUTCFullYear(), time: String(d.getUTCHours()).padStart(2, "0") + ":" + String(d.getUTCMinutes()).padStart(2, "0") };
}
