import { UAParser } from "ua-parser-js";
import supabase from "./supabase.js";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    return null;
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    let city = "Unknown";
    let country = "Unknown";

    try {
      const response = await fetch("https://ipwho.is/");
      const data = await response.json();
      city = data.city || "Unknown";
      country = data.country || "Unknown";
    } catch {
      /* geo lookup optional */
    }

    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });
  } catch {
    /* redirect proceeds even if click logging fails */
  } finally {
    window.location.href = originalUrl;
  }
};
