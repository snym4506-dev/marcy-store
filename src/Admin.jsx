import { useEffect, useRef, useState } from "react";
import { categories } from "./data";
import { createId, money, useProducts } from "./products";
import "./admin.css";

const PASSCODE = "marcy@#1234";
const SESSION_KEY = "marcystore-admin-unlocked";
const MAX_IMAGE_CHARS = 1_200_000;

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function PlusIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m14.5 6.5 3 3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TrashIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V4.5h6V7m-8 0 1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9" cy="10" r="1.7" fill="currentColor" />
      <path d="m4.5 17 4.6-4.6 3.4 3.4 2.6-2.4 4.4 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Sparkle({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
      <path d="M20 0c0 12.7 7.3 20 20 20-12.7 0-20 7.3-20 20 0-12.7-7.3-20-20-20C12.7 20 20 12.7 20 0Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Pick an image file (JPG, PNG or WebP)."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("That file could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("That image could not be opened."));
      image.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        if (dataUrl.length > MAX_IMAGE_CHARS) {
          reject(new Error("That photo is still too big. Try a smaller one."));
          return;
        }
        resolve(dataUrl);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const emptyProduct = {
  name: "",
  price: 250,
  category: "Keychains",
  badge: "",
  accent: "pink",
  image: "",
  alt: "",
  edition: "Made to order",
  size: "",
  material: "",
  finish: "",
  description: "",
  details: [],
  visible: true,
};

/* -------------------------------------------------------------------------- */
/* Gate                                                                       */
/* -------------------------------------------------------------------------- */

function Gate({ onUnlock }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (passcode.trim() === PASSCODE) {
      onUnlock();
      return;
    }
    setError(
      passcode.trim()
        ? 
        : "Type the studio passcode to continue."
    );
  };

  return (
    <main className="gate">
      <div className="gate__glow" aria-hidden="true" />
      <form className="gate__card" onSubmit={submit}>
        <a className="logo gate__logo" href="/">
          MARCY<span>STORE</span><i aria-hidden="true" />
        </a>
        <p className="gate__eyebrow">Studio admin</p>
        <h1>Who&rsquo;s there?</h1>
        <p className="gate__copy">
          Enter the passcode to manage products, prices, and photos.
        </p>

        <label className="gate__label" htmlFor="admin-passcode">
          Passcode
        </label>
        <input
          id="admin-passcode"
          type="password"
          value={passcode}
          onChange={(event) => {
            setPasscode(event.target.value);
            setError("");
          }}
          placeholder="••••••"
          autoComplete="current-password"
          autoFocus
        />
        {error && (
          <p className="gate__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="admin-btn admin-btn--primary admin-btn--wide">
          Unlock <LockIcon size={16} />
        </button>

        <a className="gate__back" href="/">
          ← Back to the store
        </a>
        <p className="gate__note">
          Front-end lock for a static demo — it keeps honest people out, not
          hackers. Change it in <code>src/Admin.jsx</code>.
        </p>
      </form>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Price input                                                                */
/* -------------------------------------------------------------------------- */

function PriceInput({ value, label, onCommit }) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const next = Number(draft);
    if (!Number.isFinite(next) || next < 0) {
      setDraft(String(value));
      return;
    }
    const rounded = Math.round(next * 100) / 100;
    setDraft(String(rounded));
    if (rounded !== value) onCommit(rounded);
  };

  return (
    <div className="admin-price">
      <span aria-hidden="true">EGP</span>
      <input
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={draft}
        aria-label={label}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setDraft(String(value));
            event.currentTarget.blur();
          }
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Product form                                                               */
/* -------------------------------------------------------------------------- */

function ProductForm({ product, onCancel, onSave }) {
  const [values, setValues] = useState(() =>
    product ? { ...product, details: [...product.details] } : { ...emptyProduct }
  );
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const firstField = useRef(null);

  useEffect(() => {
    firstField.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onCancel]);

  const update = (field) => (event) => {
    const value =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
  };

  const pickFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const dataUrl = await readImageFile(file);
      setValues((current) => ({ ...current, image: dataUrl }));
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Give the piece a name first.");
      return;
    }
    const price = Number(values.price);
    if (!Number.isFinite(price) || price < 0) {
      setError("Add a price of 0 or more.");
      return;
    }

    const ok = onSave({
      ...values,
      name: values.name.trim(),
      price: Math.round(price * 100) / 100,
      alt: values.alt.trim() || values.name.trim(),
      details: Array.isArray(values.details) ? values.details : [],
    });

    if (!ok) {
      setError(
        "Could not save — this browser's storage is full. Remove a photo or use an image URL instead."
      );
    }
  };

  return (
    <div className="admin-modal" role="presentation" onMouseDown={onCancel}>
      <form
        className="admin-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <header className="admin-form__head">
          <div>
            <p className="admin-eyebrow">{product ? "Edit piece" : "New piece"}</p>
            <h2 id="product-form-title">
              {product ? product.name : "Add a product"}
            </h2>
          </div>
          <button
            type="button"
            className="admin-icon-btn"
            onClick={onCancel}
            aria-label="Close form"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="admin-form__body">
          <div className="admin-form__media">
            <div className="admin-form__preview">
              {values.image ? (
                <img src={values.image} alt="" />
              ) : (
                <div className="admin-form__preview-empty">
                  <ImageIcon size={30} />
                  <span>No photo yet</span>
                </div>
              )}
            </div>
            <div className="admin-form__media-actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--small"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Working…" : "Upload photo"}
              </button>
              {values.image && (
                <button
                  type="button"
                  className="admin-btn admin-btn--danger-ghost admin-btn--small"
                  onClick={() => setValues((current) => ({ ...current, image: "" }))}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={pickFile}
              className="admin-file"
              tabIndex={-1}
              aria-hidden="true"
            />
            <label className="admin-field">
              <span>…or paste an image URL</span>
              <input
                type="text"
                value={values.image.startsWith("data:") ? "" : values.image}
                placeholder="https://…"
                onChange={update("image")}
              />
            </label>
            <p className="admin-hint">
              Photos are resized to 900px and saved in this browser. Keep files
              small so the catalog stays under the storage limit.
            </p>
          </div>

          <div className="admin-form__fields">
            <label className="admin-field">
              <span>Name *</span>
              <input
                ref={firstField}
                type="text"
                value={values.name}
                onChange={update("name")}
                placeholder="Momo the Cat"
                required
              />
            </label>

            <div className="admin-field-row">
              <label className="admin-field">
                <span>Price (EGP) *</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.price}
                  onChange={update("price")}
                  required
                />
              </label>
              <label className="admin-field">
                <span>Category</span>
                <input
                  type="text"
                  list="admin-categories"
                  value={values.category}
                  onChange={update("category")}
                  placeholder="Keychains"
                />
                <datalist id="admin-categories">
                  {categories.map((category) => (
                    <option value={category} key={category} />
                  ))}
                </datalist>
              </label>
            </div>

            <div className="admin-field-row">
              <label className="admin-field">
                <span>Badge</span>
                <input
                  type="text"
                  value={values.badge}
                  onChange={update("badge")}
                  placeholder="NEW"
                  maxLength={18}
                />
              </label>
              <label className="admin-field">
                <span>Edition</span>
                <input
                  type="text"
                  value={values.edition}
                  onChange={update("edition")}
                  placeholder="Made to order"
                />
              </label>
            </div>

            <div className="admin-field-row">
              <label className="admin-field">
                <span>Size</span>
                <input
                  type="text"
                  value={values.size}
                  onChange={update("size")}
                  placeholder="6 cm tall"
                />
              </label>
              <label className="admin-field">
                <span>Card colour</span>
                <select value={values.accent} onChange={update("accent")}>
                  <option value="pink">Burgundy</option>
                  <option value="acid">Cream</option>
                  <option value="cream">Ivory</option>
                </select>
              </label>
            </div>

            <label className="admin-field">
              <span>Description</span>
              <textarea
                rows="3"
                value={values.description}
                onChange={update("description")}
                placeholder="What makes this little thing worth owning?"
              />
            </label>

            <label className="admin-field">
              <span>Details (one per line)</span>
              <textarea
                rows="3"
                value={values.details.join("\n")}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    details: event.target.value.split("\n"),
                  }))
                }
                placeholder={"Sculpted and painted by hand\nSturdy split ring"}
              />
            </label>

            <label className="admin-check">
              <input
                type="checkbox"
                checked={values.visible}
                onChange={update("visible")}
              />
              <span>
                <strong>Visible in the shop</strong>
                <small>Uncheck to hide it without deleting it.</small>
              </span>
            </label>
          </div>
        </div>

        {error && (
          <p className="admin-form__error" role="alert">
            {error}
          </p>
        )}

        <footer className="admin-form__foot">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="admin-btn admin-btn--primary">
            {product ? "Save changes" : "Add product"} <CheckIcon size={16} />
          </button>
        </footer>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export default function Admin() {
  const [unlocked, setUnlocked] = useState(
    () => window.sessionStorage.getItem(SESSION_KEY) === "yes"
  );
  const [products, setProducts, reset] = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [resetArmed, setResetArmed] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const importRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3200);
  };

  if (!unlocked) {
    return (
      <Gate
        onUnlock={() => {
          window.sessionStorage.setItem(SESSION_KEY, "yes");
          setUnlocked(true);
        }}
      />
    );
  }

  const lock = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  const allCategories = Array.from(
    new Set([...categories, ...products.map((product) => product.category)])
  ).sort();

  const filtered = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const haystack = `${product.name} ${product.category} ${product.badge}`.toLowerCase();
    return matchesCategory && haystack.includes(query.trim().toLowerCase());
  });

  const liveCount = products.filter((product) => product.visible).length;
  const average = products.length
    ? products.reduce((total, product) => total + product.price, 0) / products.length
    : 0;

  const saveProduct = (values) => {
    const isNew = !editing || editing.mode === "new";
    const next = isNew
      ? [...products, { ...values, id: createId(values.name, products) }]
      : products.map((product) =>
          product.id === editing.id ? { ...values, id: product.id } : product
        );

    const ok = setProducts(next);
    if (ok) {
      notify(isNew ? `${values.name} added to the shop.` : `${values.name} updated.`);
      setEditing(null);
    }
    return ok;
  };

  const deleteProduct = (product) => {
    const ok = setProducts(products.filter((entry) => entry.id !== product.id));
    if (ok) notify(`${product.name} deleted.`);
    setConfirmId(null);
  };

  const toggleVisible = (product) => {
    const ok = setProducts(
      products.map((entry) =>
        entry.id === product.id ? { ...entry, visible: !entry.visible } : entry
      )
    );
    if (ok) {
      notify(
        product.visible
          ? `${product.name} hidden from the shop.`
          : `${product.name} is live.`
      );
    }
  };

  const changePrice = (product, price) => {
    const ok = setProducts(
      products.map((entry) =>
        entry.id === product.id ? { ...entry, price } : entry
      )
    );
    if (ok) notify(`${product.name} is now ${money(price)}.`);
  };

  const exportCatalog = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "marcystore-products.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Catalog exported as JSON.");
  };

  const importCatalog = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : parsed?.products;
      if (!Array.isArray(list)) throw new Error("That file is not a catalog.");
      if (!setProducts(list)) throw new Error("This browser's storage is full.");
      notify(`Imported ${list.length} product${list.length === 1 ? "" : "s"}.`);
    } catch (error) {
      notify(error.message || "That file could not be imported.");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };

  const doReset = () => {
    if (!resetArmed) {
      setResetArmed(true);
      window.setTimeout(() => setResetArmed(false), 4000);
      return;
    }
    reset();
    setResetArmed(false);
    notify("Demo catalog restored.");
  };

  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="admin-bar__inner">
          <a className="logo admin-logo" href="/" aria-label="MARCYSTORE store">
            MARCY<span>STORE</span><i aria-hidden="true" />
          </a>
          <span className="admin-bar__tag">Studio admin</span>
          <div className="admin-bar__actions">
            <a className="admin-btn admin-btn--ghost admin-btn--small" href="/">
              View store ↗
            </a>
            <button
              type="button"
              className="admin-icon-btn"
              onClick={lock}
              aria-label="Lock admin"
              title="Lock admin"
            >
              <LockIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-head">
          <div>
            <p className="admin-eyebrow">Catalog</p>
            <h1>
              Products <span>({products.length})</span>
            </h1>
            <p className="admin-head__copy">
              Add pieces, change prices, swap photos. Everything here shows up on
              the storefront immediately.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={() => setEditing({ mode: "new" })}
          >
            <PlusIcon /> Add product
          </button>
        </div>

        <div className="admin-stats">
          <div className="admin-stat">
            <span>Products</span>
            <strong>{products.length}</strong>
            <small>{allCategories.length} categories</small>
          </div>
          <div className="admin-stat admin-stat--pink">
            <span>Live in shop</span>
            <strong>{liveCount}</strong>
            <small>{products.length - liveCount} hidden</small>
          </div>
          <div className="admin-stat admin-stat--acid">
            <span>Average price</span>
            <strong>{money(Math.round(average))}</strong>
            <small>across all pieces</small>
          </div>
        </div>

        <div className="admin-note">
          <Sparkle size={16} />
          <p>
            Saved in <strong>this browser only</strong> — that is how a static
            site works without a server. Export a backup before switching
            devices, or ask a developer to connect a database.
          </p>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </div>

          <label className="admin-select">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {allCategories.map((entry) => (
                <option value={entry} key={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-toolbar__spacer" />

          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--small"
            onClick={exportCatalog}
          >
            Export
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--small"
            onClick={() => importRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            onChange={importCatalog}
            className="admin-file"
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            type="button"
            className={`admin-btn admin-btn--small ${
              resetArmed ? "admin-btn--danger" : "admin-btn--ghost"
            }`}
            onClick={doReset}
          >
            {resetArmed ? "Sure? Reset" : "Reset demo"}
          </button>
        </div>

        <div className="admin-table">
          <div className="admin-table__head" aria-hidden="true">
            <span>Piece</span>
            <span>Category</span>
            <span>Price</span>
            <span>Live</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="admin-empty">
              <Sparkle size={26} />
              <h2>Nothing here yet.</h2>
              <p>
                {products.length === 0
                  ? "Add your first piece and it will appear in the shop."
                  : "No products match that search."}
              </p>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={() => setEditing({ mode: "new" })}
              >
                <PlusIcon /> Add product
              </button>
            </div>
          ) : (
            <ul className="admin-rows">
              {filtered.map((product) => (
                <li className="admin-row" key={product.id}>
                  <div className="admin-row__piece">
                    <div className={`admin-thumb admin-thumb--${product.accent}`}>
                      {product.image ? (
                        <img src={product.image} alt="" />
                      ) : (
                        <span aria-hidden="true">
                          {product.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="admin-row__name">
                      <strong>{product.name}</strong>
                      <span>
                        {product.edition}
                        {product.badge ? ` · ${product.badge}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="admin-row__category">
                    <span>{product.category}</span>
                  </div>

                  <div className="admin-row__price">
                    <PriceInput
                      value={product.price}
                      label={`Price for ${product.name}`}
                      onCommit={(price) => changePrice(product, price)}
                    />
                  </div>

                  <div className="admin-row__live">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={product.visible}
                      className={`admin-switch ${product.visible ? "is-on" : ""}`}
                      onClick={() => toggleVisible(product)}
                    >
                      <span aria-hidden="true" />
                      <span className="sr-only">
                        {product.visible ? "Hide" : "Show"} {product.name}
                      </span>
                    </button>
                  </div>

                  <div className="admin-row__actions">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={() => setEditing(product)}
                      aria-label={`Edit ${product.name}`}
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    {confirmId === product.id ? (
                      <span className="admin-confirm">
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--tiny"
                          onClick={() => deleteProduct(product)}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost admin-btn--tiny"
                          onClick={() => setConfirmId(null)}
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        onClick={() => setConfirmId(product.id)}
                        aria-label={`Delete ${product.name}`}
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="admin-footnote">
          {filtered.length} of {products.length} pieces shown · changes save
          automatically
        </p>
      </main>

      {editing && (
        <ProductForm
          product={editing.mode === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={saveProduct}
        />
      )}

      <div
        className={`admin-toast ${toast ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Sparkle size={15} />
        <span>{toast}</span>
      </div>
    </div>
  );
}
