import { useEffect, useRef, useState } from "react";
import { journal, reviews } from "./data";
import { FREE_SHIPPING, money, useProducts } from "./products";

const CART_KEY = "marcystore-bag-v1";

function loadCart() {
  try {
    const saved = window.localStorage.getItem(CART_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        Number.isInteger(item.qty) &&
        item.qty > 0
    );
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function ArrowUpRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.5 8.5h13l1 12h-15l1-12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 9V6.8a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 2.5 2.9 6.1 6.6.9-4.8 4.7 1.2 6.6-5.9-3.2-5.9 3.2 1.2-6.6-4.8-4.7 6.6-.9L12 2.5Z" />
    </svg>
  );
}

function Sparkle({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
      <path d="M20 0c0 12.7 7.3 20 20 20-12.7 0-20 7.3-20 20 0-12.7-7.3-20-20-20C12.7 20 20 12.7 20 0Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 3v10.2a4.8 4.8 0 1 1-4-4.7v2.4a2.4 2.4 0 1 0 1.6 2.3V3h2.4c.3 2.2 1.8 3.7 4 4v2.3c-1.7 0-3.2-.6-4-1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6.5-5.2 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Small components                                                           */
/* -------------------------------------------------------------------------- */

function Marquee({ items, className = "" }) {
  const content = (
    <>
      {items.map((item, index) => (
        <span className="marquee__item" key={`${item}-${index}`}>
          {item}
          <Sparkle size={13} />
        </span>
      ))}
    </>
  );

  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee__track">
        <div className="marquee__group">{content}</div>
        <div className="marquee__group">{content}</div>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, copy, action }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {copy && <p className="section-head__copy">{copy}</p>}
      </div>
      {action}
    </div>
  );
}

function ProductCard({ product, onOpen, onAdd }) {
  return (
    <article className={`product-card product-card--${product.accent}`}>
      <div className="product-card__media">
        <button
          type="button"
          className="product-card__open"
          onClick={() => onOpen(product)}
          aria-label={`View ${product.name}`}
        >
          {product.image ? (
            <img src={product.image} alt={product.alt} loading="lazy" />
          ) : (
            <span
              className={`product-card__placeholder product-card__placeholder--${product.accent}`}
              aria-hidden="true"
            >
              <Sparkle size={30} />
              <em>{product.name}</em>
            </span>
          )}
          <span className="product-card__wash" aria-hidden="true" />
        </button>
        <span className="product-card__badge" aria-hidden="true">{product.badge}</span>
        <span className="product-card__edition" aria-hidden="true">{product.edition}</span>
        <button
          type="button"
          className="product-card__add"
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to bag`}
        >
          <PlusIcon />
        </button>
      </div>
      <div className="product-card__meta">
        <div>
          <h3>{product.name}</h3>
          <p>{product.category}</p>
        </div>
        <span className="product-card__price">{money(product.price)}</span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Main app                                                                   */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [products] = useProducts();
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // The bag still works for this session if storage is unavailable.
    }
  }, [cart]);

  useEffect(() => {
    const locked = cartOpen || menuOpen || Boolean(quickView);
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, menuOpen, quickView]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setMenuOpen(false);
        setQuickView(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  };

  const addToCart = (product, qty = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: Math.min(20, item.qty + qty) }
            : item
        );
      }
      return [...current, { id: product.id, qty }];
    });
    showToast(`${product.name} is in your bag.`);
  };

  const updateQty = (id, nextQty) => {
    if (nextQty < 1) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: Math.min(20, nextQty) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const cartDetails = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const cartCount = cartDetails.reduce((total, item) => total + item.qty, 0);
  const subtotal = cartDetails.reduce(
    (total, item) => total + item.product.price * item.qty,
    0
  );
  const shippingLeft = Math.max(0, FREE_SHIPPING - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  const shopProducts = products.filter((product) => product.visible);
  const filterOptions = [
    "All",
    ...Array.from(new Set(shopProducts.map((product) => product.category))),
  ];
  const visibleProducts =
    filter === "All"
      ? shopProducts
      : shopProducts.filter((product) => product.category === filter);

  useEffect(() => {
    if (
      filter !== "All" &&
      !shopProducts.some((product) => product.category === filter)
    ) {
      setFilter("All");
    }
  }, [filter, products]);

  const handleNewsletter = (event) => {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Add a real email and we'll add you to the list.");
      return;
    }
    setSubscribed(true);
    setEmail("");
    showToast("You're in. Watch your inbox for the next drop.");
  };

  const handleCheckout = () => {
    showToast("This is a storefront demo — connect Stripe or Shopify to take payments.");
  };

  const closeQuickView = () => setQuickView(null);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#shop">
        Skip to shop
      </a>

      <div className="announcement">
        <Marquee
          className="announcement__marquee"
          items={[
            "Hand-sculpted in small batches",
            `Free shipping over ${money(FREE_SHIPPING)}`,
            "New drop — live now",
            "One-of-one characters",
          ]}
        />
      </div>

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="logo" href="#top" aria-label="MARCYSTORE home">
            MARCY<span>STORE</span><i aria-hidden="true" />
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#shop">Shop</a>
            <a href="#studio">The studio</a>
            <a href="#process">Process</a>
            <a href="#journal">Journal</a>
          </nav>

          <div className="site-header__actions">
            <a className="header-link" href="#newsletter">
              Join the club
            </a>
            <button
              type="button"
              className="bag-button"
              onClick={() => setCartOpen(true)}
            >
              <BagIcon />
              <span aria-hidden="true">Bag</span>
              <b aria-hidden="true">{cartCount}</b>
              <span className="sr-only">
                Open bag, {cartCount} item{cartCount === 1 ? "" : "s"}
              </span>
            </button>
            <button
              type="button"
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero ------------------------------------------------------------ */}
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="eyebrow eyebrow--pink">
                <span className="eyebrow__dot" />
                Drop 05 · Pocket characters
              </p>
              <h1 className="hero__title">
                <span>Tiny</span>
                <span className="hero__title-pink">characters,</span>
                <span className="hero__title-last">
                  <em>made real.</em>
                </span>
              </h1>
              <p className="hero__lede">
                Hand-sculpted keychains, medals and small things — original
                characters and fan favourites, painted one at a time in a very
                small studio.
              </p>
              <div className="hero__actions">
                <a className="button button--pink" href="#shop">
                  Shop the drop <ArrowUpRight />
                </a>
                <a className="button button--ghost" href="#process">
                  How it&rsquo;s made
                </a>
              </div>
              <div className="hero__stats">
                <div>
                  <strong>100%</strong>
                  <span>painted by hand</span>
                </div>
                <div>
                  <strong>3–5 days</strong>
                  <span>make time</span>
                </div>
                <div>
                  <strong>1 of 1</strong>
                  <span>characters</span>
                </div>
              </div>
            </div>

            <div className="hero__art" aria-label="Featured piece from drop 05">
              <div className="hero__art-backdrop" aria-hidden="true" />
              <div className="hero__panel">
                <img
                  src="/images/studio-piece.webp"
                  alt="Work from the MARCYSTORE studio"
                  fetchPriority="high"
                />
                <span className="hero__panel-label">From the studio / 01</span>
                <div className="hero__panel-caption">
                  <div>
                    <span>Studio piece 01</span>
                    <small>Hand-sculpted · one-of-one</small>
                  </div>
                  <span className="hero__panel-price">1 OF 1</span>
                </div>
              </div>

              <div className="orbit" aria-hidden="true">
                <svg viewBox="0 0 140 140">
                  <defs>
                    <path
                      id="orbitPath"
                      d="M70,70 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"
                    />
                  </defs>
                  <text>
                    <textPath href="#orbitPath" startOffset="0%">
                      HAND-SCULPTED • SMALL BATCH • ONE OF ONE • HAND-SCULPTED •
                    </textPath>
                  </text>
                </svg>
                <span className="orbit__center">
                  <Sparkle size={24} />
                </span>
              </div>

              <div className="hero__sticker">
                <span>TINY</span>
                <span>THINGS</span>
                <span>DROP</span>
                <b>05</b>
              </div>

              <div className="hero__side-note" aria-hidden="true">
                MARCYSTORE / EST. 2024
              </div>
            </div>
          </div>
        </section>

        <Marquee
          className="ticker"
          items={[
            "Keychains",
            "Medals",
            "Charms",
            "Small things",
            "Hand-painted",
            "Ships worldwide",
          ]}
        />

        {/* Shop ------------------------------------------------------------ */}
        <section className="shop-section" id="shop">
          <div className="container">
            <SectionHead
              eyebrow="The current drop"
              title={
                <>
                  Pocket-sized <em>friends.</em>
                </>
              }
              copy="Keychains, medals, charms and small things — each one sculpted and painted by hand. Small batches only, so when a character is gone, it is really gone."
              action={
                <a className="text-link" href="#journal">
                  Read the studio notes <ArrowUpRight size={15} />
                </a>
              }
            />

            <div className="shop-toolbar">
              <div className="filter-list" role="group" aria-label="Filter products">
                {filterOptions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={filter === item ? "is-active" : ""}
                    onClick={() => setFilter(item)}
                    aria-pressed={filter === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="shop-count">
                {visibleProducts.length} piece{visibleProducts.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={setQuickView}
                  onAdd={addToCart}
                />
              ))}
            </div>

            <div className="shop-footer">
              <p>
                Every piece is made by hand in tiny batches.{" "}
                <span>No mass production, no repeats.</span>
              </p>
              <button
                type="button"
                className="button button--outline"
                onClick={() => showToast("The full archive is coming soon.")}
              >
                View sold archive <ArrowUpRight />
              </button>
            </div>
          </div>
        </section>

        {/* Manifesto ------------------------------------------------------- */}
        <section className="manifesto" id="studio">
          <div className="container manifesto__grid">
            <div className="manifesto__visual">
              <div className="manifesto__image">
                <img
                  src="/images/studio.jpg"
                  alt="The MARCYSTORE studio, where every character is made"
                  loading="lazy"
                />
              </div>
              <div className="manifesto__stamp">
                <Sparkle size={22} />
                <span>MADE BY</span>
                <strong>HAND</strong>
              </div>
              <div className="manifesto__scribble" aria-hidden="true">
                small things, made slowly
              </div>
            </div>

            <div className="manifesto__copy">
              <p className="eyebrow">The studio</p>
              <h2>
                Made small.
                <br />
                <em>Made slowly.</em>
              </h2>
              <p className="manifesto__lede">
                Everything starts as a lump of clay and a rough sketch. Then it
                gets shaped, sanded, painted, sealed and clipped onto a ring —
                by one person, at one desk.
              </p>
              <p>
                No moulds, no factories, no hundred-piece runs. If a character
                sells out it might come back in a new colourway, or it might
                not. That is the deal.
              </p>
              <div className="manifesto__specs">
                <div>
                  <strong>3–5 days</strong>
                  <span>make time per piece</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>painted by hand</span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>moulds or shortcuts</span>
                </div>
              </div>
              <a className="text-link text-link--dark" href="#process">
                See how it is made <ArrowRight />
              </a>
            </div>
          </div>
        </section>

        {/* Process --------------------------------------------------------- */}
        <section className="process" id="process">
          <div className="container">
            <SectionHead
              eyebrow="The process"
              title={
                <>
                  From sketch to <em>keyring.</em>
                </>
              }
              copy="A slow, slightly chaotic route from a lump of clay to a character that lives on your bag."
              action={
                <span className="process__tag">
                  <Sparkle size={14} /> Small batch, always
                </span>
              }
            />

            <div className="process__grid">
              <article className="process-card process-card--acid">
                <span className="process-card__number">01</span>
                <h3>Sketch &amp; sculpt</h3>
                <p>
                  A character starts as a doodle, then becomes a lump of clay.
                  Shaped by hand, sanded smooth, and left with a little of the
                  making in it.
                </p>
                <span className="process-card__note">The beginning</span>
              </article>
              <article className="process-card process-card--pink">
                <span className="process-card__number">02</span>
                <h3>Paint &amp; seal</h3>
                <p>
                  Tiny brush, steady hand, questionable posture. Every colour is
                  painted on, then sealed so it survives keys, bags and weather.
                </p>
                <span className="process-card__note">The careful part</span>
              </article>
              <article className="process-card process-card--paper">
                <span className="process-card__number">03</span>
                <h3>String &amp; send</h3>
                <p>
                  A ring, a clasp, a ribbon, a box. Then it is wrapped like a
                  present and sent out to live on your bag.
                </p>
                <span className="process-card__note">The final word</span>
              </article>
            </div>
          </div>
        </section>

        {/* Reviews --------------------------------------------------------- */}
        <section className="reviews">
          <div className="container">
            <SectionHead
              eyebrow="The verdict"
              title={
                <>
                  Collectors say the <em>nicest</em> things.
                </>
              }
              action={
                <div className="reviews__rating">
                  <span>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} size={14} />
                    ))}
                  </span>
                  <p>4.9 / 5 from 214 collectors</p>
                </div>
              }
            />

            <div className="reviews__grid">
              {reviews.map((review) => (
                <article
                  className={`review-card review-card--${review.accent}`}
                  key={review.name}
                >
                  <div className="review-card__stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} size={13} />
                    ))}
                  </div>
                  <blockquote>“{review.quote}”</blockquote>
                  <footer>
                    <span className="review-card__avatar">{review.name[0]}</span>
                    <div>
                      <strong>{review.name}</strong>
                      <span>{review.detail}</span>
                    </div>
                    <span className="review-card__verified">Verified</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Journal --------------------------------------------------------- */}
        <section className="journal" id="journal">
          <div className="container">
            <SectionHead
              eyebrow="Studio journal"
              title={
                <>
                  Notes from the <em>studio.</em>
                </>
              }
              action={
                <a className="text-link" href="#newsletter">
                  Get the next note <ArrowUpRight size={15} />
                </a>
              }
            />

            <div className="journal__grid">
              {journal.map((post) => (
                <article className="journal-card" key={post.title}>
                  <button
                    type="button"
                    className="journal-card__image"
                    onClick={() => showToast("Journal articles are coming soon.")}
                    aria-label={`Read ${post.title}`}
                  >
                    <img src={post.image} alt="" loading="lazy" />
                    <span>Read</span>
                  </button>
                  <div className="journal-card__meta">
                    <span>{post.category}</span>
                    <span>{post.read}</span>
                  </div>
                  <h3>{post.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter ------------------------------------------------------ */}
        <section className="newsletter" id="newsletter">
          <div className="container newsletter__grid">
            <div className="newsletter__copy">
              <p className="eyebrow">The keyring club</p>
              <h2>
                Get first
                <br />
                <em>dibs.</em>
              </h2>
              <p>
                New drops, work-in-progress photos, and the occasional cat. No
                spam, no daily emails, no begging.
              </p>

              {subscribed ? (
                <div className="newsletter__success" role="status">
                  <span>
                    <StarIcon size={18} />
                  </span>
                  <div>
                    <strong>You're on the list.</strong>
                    <p>We'll shout when the next batch is ready.</p>
                  </div>
                </div>
              ) : (
                <form className="newsletter__form" onSubmit={handleNewsletter}>
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email address"
                    autoComplete="email"
                  />
                  <button type="submit">
                    Join the club <ArrowRight />
                  </button>
                </form>
              )}
              <small>By joining you agree to our very reasonable privacy policy.</small>
            </div>

            <div className="newsletter__art" aria-hidden="true">
              <span className="newsletter__star">
                <Sparkle size={120} />
              </span>
              <span className="newsletter__outline">M</span>
              <span className="newsletter__pill">EST. 2024</span>
              <span className="newsletter__pill newsletter__pill--alt">
                MADE SLOWLY
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer ----------------------------------------------------------- */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <div className="site-footer__top">
            <div className="site-footer__brand">
              <a className="logo logo--footer" href="#top">
                MARCY<span>STORE</span><i aria-hidden="true" />
              </a>
              <p>
                Hand-sculpted keychains, medals and small things for bags, keys,
                and people who like their objects with a little personality.
              </p>
              <a className="site-footer__email" href="mailto:hello@marcystore.com">
                hello@marcystore.com
              </a>
              <div className="site-footer__social">
                <a href="#top" aria-label="MARCYSTORE on Instagram">
                  <InstagramIcon />
                </a>
                <a href="#top" aria-label="MARCYSTORE on TikTok">
                  <TikTokIcon />
                </a>
                <a href="#top" aria-label="MARCYSTORE on Pinterest">
                  <PinIcon />
                </a>
              </div>
            </div>

            <div className="site-footer__links">
              <div>
                <h3>Shop</h3>
                <a href="#shop">All pieces</a>
                <a href="#shop">New drop</a>
                <a href="#shop">Keychains</a>
                <a href="#shop">Medals</a>
              </div>
              <div>
                <h3>Studio</h3>
                <a href="#studio">The studio</a>
                <a href="#process">Process</a>
                <a href="#journal">Journal</a>
                <a href="#newsletter">Contact</a>
              </div>
              <div>
                <h3>Help</h3>
                <a href="#contact">Shipping</a>
                <a href="#contact">Returns</a>
                <a href="#contact">Care guide</a>
                <a href="/admin">Studio login</a>
              </div>
            </div>
          </div>

          <div className="site-footer__bottom">
            <p>© 2026 MARCYSTORE. Made by hand, packed with care.</p>
            <p>Made in a very small studio</p>
            <div className="site-footer__pay">
              <span>VISA</span>
              <span>MC</span>
              <span>AMEX</span>
              <span>APPLE PAY</span>
            </div>
          </div>

          <div className="site-footer__wordmark" aria-hidden="true">
            MARCY<span>STORE</span><i />
          </div>
        </div>
      </footer>

      {/* Mobile menu ------------------------------------------------------ */}
      <div
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-menu__top">
          <span className="logo">
            MARCY<span>STORE</span><i aria-hidden="true" />
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="mobile-menu__nav" aria-label="Mobile navigation">
          {[
            ["Shop", "#shop"],
            ["The studio", "#studio"],
            ["Process", "#process"],
            ["Journal", "#journal"],
            ["Join the club", "#newsletter"],
          ].map(([label, href], index) => (
            <a
              href={href}
              key={label}
              onClick={() => setMenuOpen(false)}
              style={{ "--i": index }}
            >
              <span>0{index + 1}</span>
              {label}
              <ArrowUpRight size={22} />
            </a>
          ))}
        </nav>
        <div className="mobile-menu__bottom">
          <button
            type="button"
            className="button button--pink"
            onClick={() => {
              setMenuOpen(false);
              setCartOpen(true);
            }}
          >
            Open bag ({cartCount}) <BagIcon />
          </button>
          <p>Small batch. Big feelings. Worldwide shipping.</p>
        </div>
      </div>

      {/* Cart drawer ------------------------------------------------------ */}
      <button
        type="button"
        className={`overlay ${cartOpen ? "is-open" : ""}`}
        onClick={() => setCartOpen(false)}
        aria-label="Close bag"
        tabIndex={cartOpen ? 0 : -1}
      />
      <aside
        className={`drawer ${cartOpen ? "is-open" : ""}`}
        aria-label="Shopping bag"
        aria-hidden={!cartOpen}
        inert={!cartOpen}
      >
        <div className="drawer__head">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2>
              Your bag <span>({cartCount})</span>
            </h2>
          </div>
          <button
            type="button"
            className="icon-button icon-button--dark"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
          >
            <CloseIcon />
          </button>
        </div>

        {cartDetails.length > 0 && (
          <div className="shipping-meter">
            <div className="shipping-meter__copy">
              <span>
                {shippingLeft === 0
                  ? "Free shipping unlocked."
                  : `${money(shippingLeft)} away from free shipping.`}
              </span>
              <span>{Math.round(shippingProgress)}%</span>
            </div>
            <div className="shipping-meter__bar">
              <span style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>
        )}

        <div className="drawer__body">
          {cartDetails.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty__icon">
                <BagIcon size={30} />
              </span>
              <h3>Your bag is beautifully empty.</h3>
              <p>Let's fix that with something small and hand-made.</p>
              <button
                type="button"
                className="button button--pink"
                onClick={() => {
                  setCartOpen(false);
                  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Shop the drop <ArrowRight />
              </button>
            </div>
          ) : (
            <ul className="cart-list">
              {cartDetails.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className={`cart-item__image cart-item__image--${item.product.accent}`}>
                    {item.product.image ? (
                      <img src={item.product.image} alt="" />
                    ) : (
                      <span aria-hidden="true">
                        {item.product.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="cart-item__info">
                    <div>
                      <h3>{item.product.name}</h3>
                      <p>{item.product.category} · {item.product.edition}</p>
                    </div>
                    <div className="cart-item__controls">
                      <div className="qty-control">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <MinusIcon />
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                      <span className="cart-item__price">
                        {money(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.product.name} from bag`}
                  >
                    <CloseIcon size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartDetails.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__subtotal">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <p>Shipping and taxes calculated at checkout. Pieces ship within 3–5 business days.</p>
            <button type="button" className="button button--acid button--wide" onClick={handleCheckout}>
              Checkout <ArrowUpRight />
            </button>
            <button type="button" className="drawer__continue" onClick={() => setCartOpen(false)}>
              or keep looking around
            </button>
          </div>
        )}
      </aside>

      {/* Quick view ------------------------------------------------------- */}
      {quickView && (
        <QuickView
          product={quickView}
          onClose={closeQuickView}
          onAdd={(product, qty) => {
            addToCart(product, qty);
            closeQuickView();
            setCartOpen(true);
          }}
        />
      )}

      {/* Toast ------------------------------------------------------------ */}
      <div className={`toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">
        <Sparkle size={17} />
        <span>{toast}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quick view                                                                 */
/* -------------------------------------------------------------------------- */

function QuickView({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product.id]);

  return (
    <div className="quickview-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="quickview"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="quickview__close" onClick={onClose} aria-label="Close quick view">
          <CloseIcon />
        </button>

        <div className={`quickview__image quickview__image--${product.accent}`}>
          {product.image ? (
            <img src={product.image} alt={product.alt} />
          ) : (
            <div className="quickview__placeholder" aria-hidden="true">
              <Sparkle size={44} />
              <em>{product.name}</em>
              <small>Photo coming soon</small>
            </div>
          )}
          <span className="quickview__badge">{product.badge}</span>
          <span className="quickview__edition">{product.edition}</span>
        </div>

        <div className="quickview__body">
          <p className="eyebrow">{product.category} · {product.edition}</p>
          <h2 id="quickview-title">{product.name}</h2>
          <p className="quickview__price">{money(product.price)}</p>
          <p className="quickview__description">{product.description}</p>

          <div className="quickview__details">
            <div>
              <span>Size</span>
              <strong>{product.size || "Small"}</strong>
            </div>
            <div>
              <span>Material</span>
              <strong>{product.material || "Hand-sculpted clay"}</strong>
            </div>
            <div>
              <span>Finish</span>
              <strong>{product.finish || "Hand-painted, sealed"}</strong>
            </div>
          </div>

          <ul className="quickview__list">
            {product.details.map((detail) => (
              <li key={detail}>
                <StarIcon size={10} /> {detail}
              </li>
            ))}
          </ul>

          <div className="quickview__buy">
            <div className="qty-control qty-control--light">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                <MinusIcon />
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((value) => Math.min(20, value + 1))} aria-label="Increase quantity">
                <PlusIcon size={14} />
              </button>
            </div>
            <button type="button" className="button button--pink button--grow" onClick={() => onAdd(product, qty)}>
              Add to bag — {money(product.price * qty)}
            </button>
          </div>

          <p className="quickview__shipping">
            <Sparkle size={12} /> Free shipping over {money(FREE_SHIPPING)} · 14-day returns
          </p>
        </div>
      </div>
    </div>
  );
}
