import { APP_KEY_SESSION, APP_KEY_THEME } from "@/env-vars";
import { DateTime } from "luxon";

function getSession() {
  return sessionStorage.getItem(APP_KEY_SESSION);
}

function setSession(data) {
  return sessionStorage.setItem(APP_KEY_SESSION, data.token);
}
function handleUnauthorized({ reload = true } = {}) {
  sessionStorage.removeItem(APP_KEY_SESSION);
  if (reload) window.location.reload();
}

function formatterMoney({ currency = "USD", value = 0 }) {
  const lm = { COP: "es-CO", USD: "en-US", EUR: "de-DE" };
  const formatter = new Intl.NumberFormat(lm[currency], {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

/**
 * Retorna el tiempo relativo entre una _date y hora dada y el momento actual.
 * @param _date _date en formato "DD/MM/YYYY"
 * @param date_diff Hora en formato "HH:mm:ss"
 * @returns Tiempo relativo como string (ej. "hace 2 días")
 */
function getRelativeDate({ date, date_diff = "now", format = "iso" }) {
  let target = DateTime.fromISO(date);
  let toRelative = DateTime.fromISO(date_diff);
  if (format !== "iso") {
    target = DateTime.fromFormat(date, format, { locale: "es" });
    toRelative = DateTime.fromFormat(date_diff, format, { locale: "es" });
  }

  if (date_diff === "now") toRelative = DateTime.now();

  if (!target.isValid || !toRelative.isValid) return "fecha inválida";

  return target.toRelative({ base: toRelative }) ?? "fecha inválida";
}

function getLanguage() {
  const lang = localStorage.getItem("usr-lang");
  return lang;
}

function getTheme() {
  const theme = localStorage.getItem(APP_KEY_THEME);
  if (theme) {
    return theme;
  }
  return undefined;
}

function setTheme(theme) {
  localStorage.setItem(APP_KEY_THEME, theme);
}

function roundN(num, de = 0) {
  return +`${Math.round(`${num}e+${de}`)}e-${de}`;
}

function percentage(part, total = 0) {
  if (total === 0) {
    return 0;
  }
  return roundN((part / total) * 100, 2);
}

const formatDate = (value) => {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export {
  formatDate,
  formatterMoney,
  getLanguage,
  getRelativeDate,
  getSession,
  getTheme,
  handleUnauthorized,
  percentage,
  roundN,
  setSession,
  setTheme,
};
