import { useCallback, useEffect, useState } from "react";
import { defaultProducts } from "./data";

const STORAGE_KEY = "marcystore-products-v1";
const SYNC_EVENT = "marcystore:products-changed";

const priceFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export const money = (value) =>
  `EGP ${priceFormat.format(Number(value) || 0)}`;

export const FREE_SHIPPING = 1200;

export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export function createId(name, existing) {
  const base = slugify(name) || "piece";
  const taken = new Set(existing.map((product) => product.id));
  if (!taken.has(base)) return base;
  let index = 2;
  while (taken.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

const asText = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asAccent = (value) =>
  ["pink", "acid", "cream"].includes(value) ? value : "pink";

export function normalizeProduct(raw, index = 0) {
  if (!raw || typeof raw !== "object") return null;

  const name = asText(raw.name).trim();
  if (!name) return null;

  const price = Number(raw.price);
  const details = Array.isArray(raw.details)
    ? raw.details
        .filter((entry) => typeof entry === "string" && entry.trim())
        .map((entry) => entry.trim())
    : [];

  return {
    id: asText(raw.id).trim() || `piece-${index + 1}`,
    name,
    price:
      Number.isFinite(price) && price >= 0
        ? Math.round(price * 100) / 100
        : 0,
    category: asText(raw.category, "Keychains").trim() || "Keychains",
    badge: asText(raw.badge).trim(),
    accent: asAccent(raw.accent),
    image: asText(raw.image).trim(),
    alt: asText(raw.alt).trim() || name,
    edition: asText(raw.edition, "Made to order").trim() || "Made to order",
    size: asText(raw.size).trim(),
    material: asText(raw.material).trim(),
    finish: asText(raw.finish).trim(),
    description: asText(raw.description).trim(),
    details,
    visible: raw.visible !== false,
  };
}

const normalizeList = (list) =>
  list
    .map((entry, index) => normalizeProduct(entry, index))
    .filter(Boolean);

const defaults = () => normalizeList(defaultProducts);

export function loadProducts() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults();

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return defaults();

    return normalizeList(parsed);
  } catch {
    return defaults();
  }
}

export function saveProducts(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Almost always the 5 MB quota: a large uploaded photo is the usual cause.
    return false;
  }

  window.dispatchEvent(new Event(SYNC_EVENT));
  return true;
}

export function resetProducts() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear, so fall through to the default catalog.
  }

  window.dispatchEvent(new Event(SYNC_EVENT));
  return defaults();
}

export function useProducts() {
  const [products, setList] = useState(loadProducts);

  useEffect(() => {
    const sync = () => setList(loadProducts());
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) sync();
    };

    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setProducts = useCallback((next) => {
    const clean = normalizeList(next);
    if (!saveProducts(clean)) return false;
    setList(clean);
    return true;
  }, []);

  const reset = useCallback(() => {
    setList(resetProducts());
  }, []);

  return [products, setProducts, reset];
}
