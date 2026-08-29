"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type ProductVariant = {
  color: string;
  size: string;
  stock: number;
};

type ProductColorImage = {
  color: string;
  image: string;
};

type Product = {
  id: number;
  name: string;
  cat: string;
  price: number;
  old?: number;
  image: string;
  badge?: string;
  color: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  variants?: ProductVariant[];
  colorImages?: ProductColorImage[];
};

type CartItem = {
  id: number;
  color: string;
  size: string;
};

type DeliveryFee = {
  city: string;
  fee: number;
};

type AdminOrderItem = {
  id: number;
  name: string;
  color: string;
  size: string;
  qty: number;
  price: number;
};

type AdminOrder = {
  id: number;
  ref: string;
  customer: string;
  email: string;
  phone: string;
  governorate: string;
  area: string;
  address: string;
  paymentMethod: string;
  items: AdminOrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: string;
  totalValue: number;
  status: string;
  createdAt: string;
};

type HomepageContent = {
  ticker: string[];
  marquee: string;
  deliveryFee: number;
  freeDeliveryFrom: number;
  eyebrow: string;
  headline: string;
  image: string;
  campaignImage: string;
  storyImage: string;
  aboutImage: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  storeLocation: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Metro Line Heavy Tee",
    cat: "T-SHIRTS",
    price: 890,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
    badge: "NEW",
    color: "Black",
  },
  {
    id: 2,
    name: "Downtown Box Hoodie",
    cat: "HOODIES",
    price: 1890,
    old: 2190,
    image:
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85",
    badge: "BEST SELLER",
    color: "Stone",
  },
  {
    id: 3,
    name: "26 Utility Cargo",
    cat: "CARGOS",
    price: 1690,
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85",
    color: "Olive",
  },
  {
    id: 4,
    name: "Night Shift Jacket",
    cat: "JACKETS",
    price: 2490,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85",
    badge: "LIMITED",
    color: "Black",
  },
  {
    id: 5,
    name: "Cairo Stamp Cap",
    cat: "ACCESSORIES",
    price: 590,
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85",
    color: "Beige",
  },
  {
    id: 6,
    name: "Kasr El Nil Tee",
    cat: "T-SHIRTS",
    price: 790,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
    color: "White",
  },
];

const icons = { search: "⌕", bag: "🛒", heart: "♡", user: "○" };

export default function Cairo26App({
  initialView = "home",
}: {
  initialView?: string;
} = {}) {
  const [view, setView] = useState(initialView),
    [cart, setCart] = useState<CartItem[]>([]),
    [wish, setWish] = useState<number[]>([]),
    [menu, setMenu] = useState(false),
    [category, setCategory] = useState("ALL"),
    [shopSort, setShopSort] = useState("DEFAULT"),
    [filterOpen, setFilterOpen] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [searchQuery, setSearchQuery] = useState(""),
    [discountCode, setDiscountCode] = useState(""),
    [deliveryGovernorate, setDeliveryGovernorate] = useState("CAIRO"),
    [discountPercent, setDiscountPercent] = useState(0),
    [discountAmount, setDiscountAmount] = useState(0),
    [freeShipping, setFreeShipping] = useState(false),
    [accountTab, setAccountTab] = useState("OVERVIEW"),
    [selected, setSelected] = useState<Product | null>(null),
    [catalog, setCatalog] = useState<Product[]>(products),
    [deliveryFees, setDeliveryFees] = useState<DeliveryFee[]>([
      { city: "CAIRO", fee: 80 },
      { city: "GIZA", fee: 80 },
      { city: "ALEXANDRIA", fee: 100 },
      { city: "DAKAHLIA", fee: 100 },
      { city: "OTHER GOVERNORATE", fee: 130 },
    ]),
    [homepage, setHomepage] = useState<HomepageContent>({
      ticker: [
        "FREE DELIVERY OVER 2,500 EGP",
        "DESIGNED IN CAIRO",
        "EASY 14-DAY EXCHANGES",
      ],
      marquee: "STREET-BORN   القاهرة   BUILT DIFFERENT   WESTERN",
      deliveryFee: 80,
      freeDeliveryFrom: 2500,
      eyebrow: "SS / 26 — DROP 01",
      headline: "BUILT FOR THE CITY.",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=90",
      campaignImage:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=2000&q=90",
      storyImage:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85",
      aboutImage:
        "https://images.unsplash.com/photo-1579187707643-35646d22b596?auto=format&fit=crop&w=1800&q=85",
      instagramUrl: "",
      tiktokUrl: "",
      facebookUrl: "",
      whatsappNumber: "",
      storeLocation: "Zamalek, Cairo, Egypt",
    }),
      [darkMode, setDarkMode] = useState(true),
    [toast, setToast] = useState("");
  const toStoreProduct = (p: {
    id: number;
    name: string;
    category: string;
    price: number;
    salePrice?: number | null;
    image: string;
    colors?: string;
    sizes?: string;
    stock?: number;
    variants?: ProductVariant[];
    colorImages?: ProductColorImage[];
  }) => {
    const colors = p.colors?.split(",").map((c) => c.trim()).filter(Boolean);
    const sizes = p.sizes?.split(",").map((s) => s.trim()).filter(Boolean);
    return {
      id: 100000 + p.id,
      name: p.name,
      cat: p.category,
      price: p.salePrice ? Number(p.salePrice) : Number(p.price),
      old: p.salePrice ? Number(p.price) : undefined,
      image: p.image,
      color: colors?.[0] || "Black",
      colors,
      sizes,
      badge: "NEW",
      stock: Number(p.stock ?? 0),
      variants: p.variants?.length ? p.variants : undefined,
      colorImages: p.colorImages?.length ? p.colorImages : undefined,
    };
  };
  const cartRef = useRef(cart);
  cartRef.current = cart;
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) =>
        setCatalog(
          data.products.length ? data.products.map(toStoreProduct) : products,
        ),
      )
      .catch(() => {});
  }, []);
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data.settings) return;
        const {
          heroImage,
          campaignImage,
          storyImage,
          aboutImage,
          instagramUrl,
          tiktokUrl,
          facebookUrl,
          whatsappNumber,
          storeLocation,
        } = data.settings;
        setHomepage((current) => ({
          ...current,
          image: heroImage || current.image,
          campaignImage: campaignImage || current.campaignImage,
          storyImage: storyImage || current.storyImage,
          aboutImage: aboutImage || current.aboutImage,
          instagramUrl: instagramUrl ?? current.instagramUrl,
          tiktokUrl: tiktokUrl ?? current.tiktokUrl,
          facebookUrl: facebookUrl ?? current.facebookUrl,
          whatsappNumber: whatsappNumber ?? current.whatsappNumber,
          storeLocation: storeLocation || current.storeLocation,
        }));
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!menu) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".mega-menu") && !target.closest(".menu-trigger")) {
        setMenu(false);
      }
    };
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, [menu]);
  const notify = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 2200);
  };
  const cartCount = cart.filter((item) => catalog.some((p) => p.id === item.id)).length;
  const add = (id: number, color = "BLACK", size = "M") => {
    const product = catalog.find((p) => p.id === id);
    const variant = product?.variants?.find(
      (v) =>
        v.color.toLowerCase() === color.toLowerCase() &&
        v.size.toLowerCase() === size.toLowerCase(),
    );
    const limit = variant ? variant.stock : product?.stock;
    const inCart = variant
      ? cartRef.current.filter(
          (item) => item.id === id && item.color === color && item.size === size,
        ).length
      : cartRef.current.filter((item) => item.id === id).length;
    if (limit !== undefined && inCart >= limit) {
      notify(
        limit === 0 ? "This item is out of stock" : `Only ${limit} left in stock`,
      );
      return;
    }
    cartRef.current = [...cartRef.current, { id, color, size }];
    setCart(cartRef.current);
    notify("Added to your bag");
  };
  const filtered = useMemo(() => {
    let items =
      category === "ALL" ? catalog : catalog.filter((p) => p.cat === category);
    if (shopSort === "PRICE_ASC") items = [...items].sort((a, b) => a.price - b.price);
    else if (shopSort === "PRICE_DESC")
      items = [...items].sort((a, b) => b.price - a.price);
    else if (shopSort === "NAME") items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [category, catalog, shopSort]);
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q),
    );
  }, [searchQuery, catalog]);
  const openProduct = (p: Product) => {
    setSelected(p);
    go("product");
  };
  const goShop = (cat = "ALL") => {
    setCategory(cat);
    setFilterOpen(false);
    go("shop");
  };
  const applyDiscount = async (code: string) => {
    const c = code.trim().toUpperCase();
    if (!c) return false;
    try {
      const response = await fetch("/api/discounts/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: c }),
      });
      const data = await response.json();
      if (!response.ok || !data.valid) {
        notify("Invalid discount code");
        return false;
      }
      setDiscountPercent(data.type === "percent" ? data.value : 0);
      setDiscountAmount(data.type === "amount" ? data.value : 0);
      setFreeShipping(data.type === "free_shipping");
      notify(
        data.type === "percent"
          ? `${data.value}% discount applied`
          : data.type === "amount"
            ? `${data.value} EGP discount applied`
            : "Free delivery applied",
      );
      return true;
    } catch {
      notify("Could not apply discount code");
      return false;
    }
  };
  const go = (v: string) => {
    setView(v);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const nav = ["SHOP", "COLLECTIONS", "ABOUT"];
  return (
    <main className={darkMode ? "dark-mode" : ""}>
      <div className="ticker">
        {homepage.ticker.map((message, index) => (
          <Fragment key={`${message}-${index}`}>
            {index > 0 && <span>•</span>}
            {message}
          </Fragment>
        ))}
      </div>
      <header>
        <div className="brand-group">
          <button
            className="hamb menu-trigger"
            onClick={() => setMenu(!menu)}
          >
            ☰
          </button>
          <button className="brand" onClick={() => go("home")}>
            WESTERN
          </button>
        </div>
        <nav className={menu ? "open" : ""}>
          {nav.map((n) => (
            <button key={n} onClick={() => go(n.toLowerCase())}>
              {n}
            </button>
          ))}
        </nav>
        <div className={menu ? "mega-menu open" : "mega-menu"}>
          <div className="mega-column">
            <h2>CLOTHING</h2>
            {[
              ["ALL PRODUCTS", "ALL"],
              ["T-SHIRTS", "T-SHIRTS"],
              ["HOODIES", "HOODIES"],
              ["CARGOS", "CARGOS"],
              ["JACKETS", "JACKETS"],
              ["ACCESSORIES", "ACCESSORIES"],
            ].map(([label, categoryName]) => (
              <button key={label} onClick={() => goShop(categoryName)}>
                {label}
              </button>
            ))}
          </div>
          <div className="mega-column">
            <h2>COLLECTIONS</h2>
            <button onClick={() => go("collections")}>NEW DROPS</button>
            <button onClick={() => goShop("T-SHIRTS")}>SUMMER 26</button>
            <button onClick={() => goShop("HOODIES")}>CITY LAYERS</button>
            <h2>FEATURED</h2>
            <button onClick={() => go("shop")}>NEW ARRIVALS</button>
            <button onClick={() => go("shop")}>BEST SELLERS</button>
            <button onClick={() => go("shop")}>RESTOCKS</button>
          </div>
          <div className="mega-links">
            <button onClick={() => go("about")}>EXCHANGE YOUR ITEM</button>
            <button onClick={() => go("about")}>FAQ</button>
            <button onClick={() => go("about")}>CONTACT US</button>
          </div>
        </div>
        <div className="actions">
          <button
            aria-label={darkMode ? "Use light mode" : "Use dark mode"}
            onClick={() => setDarkMode((current) => !current)}
          >
            {darkMode ? "☀" : "☾"}
          </button>
          <button
            aria-label="Search"
            onClick={() => {
              setSearchOpen(true);
              setSearchQuery("");
            }}
          >
            {icons.search}
          </button>
          <button onClick={() => go("wishlist")} aria-label="Wishlist">
            {icons.heart}
            <i>{wish.length}</i>
          </button>
          <button onClick={() => go("cart")} aria-label="Cart">
            {icons.bag}
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </header>
      {view === "home" && (
        <Home
          go={go}
          open={openProduct}
          add={add}
          items={catalog}
          homepage={homepage}
        />
      )}
      {view === "shop" && (
        <Shop
          items={filtered}
          category={category}
          setCategory={setCategory}
          shopSort={shopSort}
          setShopSort={setShopSort}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          open={openProduct}
          add={add}
        />
      )}
      {view === "collections" && <Collections goShop={goShop} />} {" "}
      {view === "about" && <About homepage={homepage} />}
      {view === "product" && (
        <ProductPage
          product={selected || catalog[0]}
          add={add}
          wish={wish}
          setWish={setWish}
          notify={notify}
        />
      )}
      {view === "cart" && (
        <Cart
          cart={cart}
          setCart={setCart}
          go={go}
          items={catalog}
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
          discountPercent={discountPercent}
          discountAmount={discountAmount}
          applyDiscount={applyDiscount}
        />
      )}{" "}
      {view === "wishlist" && (
        <Wishlist
          wish={wish}
          add={add}
          items={catalog}
          open={openProduct}
        />
      )}
      {view === "checkout" && (
        <Checkout
          cart={cart}
          items={catalog}
          discountPercent={discountPercent}
          discountAmount={discountAmount}
          freeShipping={freeShipping}
          deliveryFee={homepage.deliveryFee}
          freeDeliveryFrom={homepage.freeDeliveryFrom}
          deliveryFees={deliveryFees}
          governorate={deliveryGovernorate}
          setGovernorate={setDeliveryGovernorate}
          go={go}
          notify={notify}
          onOrderPlaced={() => {
            setCart([]);
            setDiscountPercent(0);
            setDiscountAmount(0);
            setFreeShipping(false);
            setDiscountCode("");
          }}
        />
      )}{" "}
      {view === "account" && (
        <Account
          go={go}
          tab={accountTab}
          setTab={setAccountTab}
          notify={notify}
          wishCount={wish.length}
        />
      )}{" "}
      {view === "admin" && (
        <Admin
          catalog={catalog}
            deliveryFees={deliveryFees}
            onDeliveryFeesChange={setDeliveryFees}
            homepage={homepage}
            onHomepageChange={setHomepage}
          onProductAdded={(p) =>
            setCatalog((current) => {
              const nextProduct = toStoreProduct(p);
              return [
                nextProduct,
                ...current.filter((x) => x.id !== 100000 + p.id),
              ];
            })
          }
          onProductDeleted={(id) =>
            setCatalog((current) => current.filter((x) => x.id !== 100000 + id))
          }
        />
      )}
      {!["admin", "account", "checkout"].includes(view) && (
        <Footer go={go} homepage={homepage} />
      )}{" "}
      {searchOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setSearchOpen(false)}
        >
          <div
            className="search-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              placeholder="SEARCH PRODUCTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-results">
              {searchQuery.trim() ? (
                searchResults.length ? (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      className="search-result"
                      onClick={() => {
                        setSearchOpen(false);
                        openProduct(p);
                      }}
                    >
                      <img src={p.image} alt={p.name} />
                      <div>
                        <small>{p.cat}</small>
                        <b>{p.name}</b>
                      </div>
                      <span>
                        {p.old && (
                          <del>{p.old.toLocaleString("en-US")} EGP</del>
                        )}{" "}
                        {p.price.toLocaleString("en-US")} EGP
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="search-empty">No products found.</p>
                )
              ) : (
                <p className="search-empty">Type to search the catalog.</p>
              )}
            </div>
            <button
              type="button"
              className="search-close"
              onClick={() => setSearchOpen(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}{" "}
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function Home({
  go,
  open,
  add,
  items,
  homepage,
}: {
  go: (s: string) => void;
  open: (p: Product) => void;
  add: (n: number, color?: string, size?: string) => void;
  items: Product[];
  homepage: HomepageContent;
}) {
  return (
    <>
      <section
        className="hero"
        style={{ "--hero-image": `url("${homepage.image}")` } as React.CSSProperties}
      >
        <div className="hero-copy">
          <p>{homepage.eyebrow}</p>
          <h1>{homepage.headline.split(" ").map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              {index > 0 && " "}
              {word}
              {index === Math.floor(homepage.headline.split(" ").length / 2) - 1 && <br />}
            </Fragment>
          ))}</h1>
          <button className="light-btn" onClick={() => go("shop")}>
            SHOP THE DROP <span>↗</span>
          </button>
        </div>
        <div className="side-label">CAIRO, EGYPT — 30.0444° N</div>
      </section>
      <section className="marquee">
        <div>
          <span>{homepage.marquee}</span>
          <span aria-hidden="true">{homepage.marquee}</span>
          <span aria-hidden="true">{homepage.marquee}</span>
          <span aria-hidden="true">{homepage.marquee}</span>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <small>01 / NEW ARRIVALS</small>
            <h2>THE NEW DROP</h2>
          </div>
          <button className="link" onClick={() => go("shop")}>
            VIEW ALL PRODUCTS →
          </button>
        </div>
        <div className="grid">
          {items.slice(0, 4).map((p) => (
            <Card key={p.id} p={p} open={open} add={add} />
          ))}
        </div>
      </section>
      <section
        className="campaign"
        style={
          {
            "--campaign-image": `url("${homepage.campaignImage}")`,
          } as React.CSSProperties
        }
      >
        <div>
          <small>LIMITED SERIES / 026</small>
          <h2>
            AFTER
            <br />
            DARK.
          </h2>
          <p>Uniforms for the ones who keep the city awake.</p>
          <button className="light-btn" onClick={() => go("collections")}>
            EXPLORE THE EDIT
          </button>
        </div>
      </section>
      <section className="story">
        <div
          className="story-img"
          style={
            {
              "--story-image": `url("${homepage.storyImage}")`,
            } as React.CSSProperties
          }
        />
        <div className="story-copy">
          <small>OUR CITY. OUR UNIFORM.</small>
          <h2>
            MADE OF
            <br />
            CAIRO.
          </h2>
          <p>
            WESTERN is an independent streetwear label shaped by the contrast,
            rhythm and raw energy of Egypt&apos;s capital. Designed locally. Made to
            move.
          </p>
          <button className="dark-btn" onClick={() => go("about")}>
            OUR STORY
          </button>
          <div className="stats">
            <span>
              <b>100%</b>LOCAL VISION
            </span>
            <span>
              <b>26</b>CAIRO CODE
            </span>
          </div>
        </div>
      </section>
      <section className="newsletter">
        <small>JOIN THE INNER CIRCLE</small>
        <h2>
          EARLY ACCESS.
          <br />
          NO NOISE.
        </h2>
        <p>Sign up for first access to drops, restocks and private events.</p>
      </section>
    </>
  );
}

function Card({
  p,
  open,
  add,
}: {
  p: Product;
  open: (p: Product) => void;
  add?: (n: number, color?: string, size?: string) => void;
}) {
  return (
    <article className="card">
      <div
        className="pic"
        role="button"
        tabIndex={0}
        onClick={() => open(p)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") open(p);
        }}
      >
        <img src={p.image} alt={p.name} />
        {p.badge && <em>{p.badge}</em>}
        <button
          type="button"
          className="quick"
          disabled={p.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            add?.(p.id, p.color.toUpperCase(), "M");
          }}
        >
          {p.stock === 0 ? "OUT OF STOCK" : "QUICK ADD +"}
        </button>
      </div>
      <div>
        <small>{p.cat}</small>
        <h3>{p.name}</h3>
        <p>
          {p.old && <del>{p.old.toLocaleString("en-US")} EGP</del>}{" "}
          {p.price.toLocaleString("en-US")} EGP
        </p>
      </div>
    </article>
  );
}

function Shop({
  items,
  category,
  setCategory,
  shopSort,
  setShopSort,
  filterOpen,
  setFilterOpen,
  open,
  add,
}: {
  items: Product[];
  category: string;
  setCategory: (s: string) => void;
  shopSort: string;
  setShopSort: (s: string) => void;
  filterOpen: boolean;
  setFilterOpen: (b: boolean) => void;
  open: (p: Product) => void;
  add: (n: number, color?: string, size?: string) => void;
}) {
  return (
    <div className="page">
      <div className="page-title">
        <small>WESTERN / SHOP</small>
        <h1>ALL PRODUCTS</h1>
        <p>ESSENTIALS FOR THE CITY — DESIGNED IN CAIRO.</p>
      </div>
      <div className="shopbar">
        <div>
          {[
            "ALL",
            "T-SHIRTS",
            "HOODIES",
            "CARGOS",
            "JACKETS",
            "ACCESSORIES",
          ].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setFilterOpen(!filterOpen)}>
          FILTER {filterOpen ? "−" : "+"}
        </button>
      </div>
      {filterOpen && (
        <div className="shop-filters">
          <label>
            SORT BY
            <select
              value={shopSort}
              onChange={(e) => setShopSort(e.target.value)}
            >
              <option value="DEFAULT">DEFAULT</option>
              <option value="PRICE_ASC">PRICE: LOW TO HIGH</option>
              <option value="PRICE_DESC">PRICE: HIGH TO LOW</option>
              <option value="NAME">NAME: A–Z</option>
            </select>
          </label>
        </div>
      )}
      <div className="grid shop-grid">
        {items.map((p) => (
          <Card key={p.id} p={p} open={open} add={add} />
        ))}
      </div>
    </div>
  );
}

function ProductPage({
  product: p,
  add,
  wish,
  setWish,
  notify,
}: {
  product: Product;
  add: (n: number, color?: string, size?: string) => void;
  wish: number[];
  setWish: (n: number[]) => void;
  notify: (s: string) => void;
}) {
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableSizes =
    p.sizes && p.sizes.length ? p.sizes : allSizes;
  const [size, setSize] = useState(
    availableSizes.includes("M") ? "M" : availableSizes[0],
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const swatches =
    p.colors && p.colors.length
      ? p.colors.map((hex) => ({ name: hex, hex }))
      : [
          { name: "BLACK", hex: "#171717" },
          { name: "STONE", hex: "#d9d1c2" },
          { name: "OLIVE", hex: "#6e7058" },
        ];
  const [selectedColor, setSelectedColor] = useState(
    swatches.find(
      (swatch) => swatch.name.toLowerCase() === p.color.toLowerCase(),
    )?.name || swatches[0].name,
  );
  const selectedVariant = p.variants?.find(
    (v) =>
      v.color.toLowerCase() === selectedColor.toLowerCase() &&
      v.size.toLowerCase() === size.toLowerCase(),
  );
  const effectiveStock = p.variants?.length
    ? selectedVariant?.stock ?? 0
    : p.stock;
  const colorImageList = p.colorImages
    ?.filter((c) => c.color.toLowerCase() === selectedColor.toLowerCase())
    .map((c) => c.image);
  const galleryImages =
    colorImageList && colorImageList.length ? colorImageList : [p.image, p.image];
  return (
    <div className="product-page">
      <div className="product-gallery">
        {galleryImages.map((src, i) => (
          <img key={`${src}-${i}`} src={src} alt={p.name} />
        ))}
      </div>
      <div className="product-info">
        <small>{p.cat} / DROP 01</small>
        <h1>{p.name}</h1>
        <div className="price">
          {p.old && <del>{p.old.toLocaleString("en-US")} EGP</del>}{" "}
          {p.price.toLocaleString("en-US")} EGP
        </div>
        <p className="stock">
          {effectiveStock === undefined
            ? "● IN STOCK — READY TO SHIP"
            : effectiveStock === 0
              ? "● OUT OF STOCK"
              : effectiveStock <= 5
                ? `● ONLY ${effectiveStock} LEFT IN STOCK`
                : "● IN STOCK — READY TO SHIP"}
        </p>
        <hr />
        <label>COLOR — {selectedColor}</label>
        <div className="swatches">
          {swatches.map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              className={selectedColor === swatch.name ? "active" : ""}
              style={{ background: swatch.hex }}
              aria-label={`Select ${swatch.name} color`}
              onClick={() => setSelectedColor(swatch.name)}
            />
          ))}
        </div>
        <div className="size-row">
          <label>SELECT SIZE</label>
          <button type="button" onClick={() => setSizeGuideOpen(true)}>
            SIZE GUIDE ↗
          </button>
        </div>
        <div className="sizes">
          {allSizes.map((s) => {
            const available = availableSizes.includes(s);
            return (
              <button
                key={s}
                className={
                  !available ? "unavailable" : s === size ? "active" : ""
                }
                disabled={!available}
                onClick={() => setSize(s)}
              >
                {s}
                {!available && <i />}
              </button>
            );
          })}
        </div>
        <button
          className="add"
          disabled={effectiveStock === 0}
          onClick={() => add(p.id, selectedColor, size)}
        >
          {effectiveStock === 0
            ? "OUT OF STOCK"
            : `ADD TO BAG — ${p.price.toLocaleString("en-US")} EGP`}
        </button>
        <button
          className="wish-btn"
          onClick={() => {
            setWish(
              wish.includes(p.id)
                ? wish.filter((x) => x !== p.id)
                : [...wish, p.id],
            );
            notify(
              wish.includes(p.id)
                ? "Removed from wishlist"
                : "Saved to wishlist",
            );
          }}
        >
          ♡ {wish.includes(p.id) ? "SAVED" : "ADD TO WISHLIST"}
        </button>
        <details open>
          <summary>DESCRIPTION</summary>
          <p>
            A heavyweight, relaxed-fit essential inspired by Cairo&apos;s late-night
            streets. Finished with signature 26 detailing.
          </p>
        </details>
        <details>
          <summary>MATERIALS & CARE</summary>
          <p>100% premium cotton. Wash cold, inside out. Made in Egypt.</p>
        </details>
        <details>
          <summary>DELIVERY & EXCHANGES</summary>
          <p>
            Cairo delivery in 2–3 days. Nationwide in 3–5 days. Exchanges within
            14 days.
          </p>
        </details>
      </div>
      {sizeGuideOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setSizeGuideOpen(false)}
        >
          <div
            className="size-guide-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <small>FIT GUIDE</small>
                <h2>SIZE CHART</h2>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <table className="size-chart">
              <thead>
                <tr>
                  <th>SIZE</th>
                  <th>CHEST (CM)</th>
                  <th>LENGTH (CM)</th>
                  <th>SHOULDER (CM)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["XS", "88–92", "66", "42"],
                  ["S", "92–96", "68", "44"],
                  ["M", "96–100", "70", "46"],
                  ["L", "100–104", "72", "48"],
                  ["XL", "104–108", "74", "50"],
                ].map(([s, ...rest]) => (
                  <tr key={s}>
                    <td>
                      <b>{s}</b>
                    </td>
                    {rest.map((v) => (
                      <td key={v}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="size-note">
              Relaxed street fit. Size down for a tighter look.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Collections({ goShop }: { goShop: (cat?: string) => void }) {
  const cols = [
    ["NEW DROPS", "ARRIVING NOW", "ALL"],
    ["SUMMER 26", "HEAT, REFRAMED", "T-SHIRTS"],
    ["WINTER COLLECTION", "CITY LAYERS", "HOODIES"],
    ["BEST SELLERS", "THE CROWD PICKS", "ALL"],
    ["LIMITED EDITION", "ONCE. THEN GONE.", "JACKETS"],
  ];
  return (
    <div className="page">
      <div className="page-title">
        <small>CURATED EDITS</small>
        <h1>COLLECTIONS</h1>
      </div>
      <div className="collection-grid">
        {cols.map((c, i) => (
          <button
            key={c[0]}
            style={{
              backgroundImage: `url(${products[i % products.length].image})`,
            }}
            onClick={() => goShop(c[2])}
          >
            <span>0{i + 1}</span>
            <div>
              <h2>{c[0]}</h2>
              <p>{c[1]} →</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
function About({ homepage }: { homepage: HomepageContent }) {
  return (
    <div className="page">
      <div
        className="about-hero"
        style={
          {
            "--about-image": `url("${homepage.aboutImage}")`,
          } as React.CSSProperties
        }
      >
        <small>EST. CAIRO / 2026</small>
        <h1>
          THE CITY
          <br />
          IS THE LOGO.
        </h1>
      </div>
      <div className="manifesto">
        <small>OUR MANIFESTO</small>
        <h2>We make clothes for people who see beauty in the unfinished.</h2>
        <div>
          <p>
            WESTERN began with a simple idea: Egyptian streetwear should speak
            in its own voice. Not borrowed. Not diluted. Ours.
          </p>
          <p>
            Every piece pulls from the city—its handmade signs, concrete
            textures, midnight traffic and stubborn optimism. We design locally
            in small runs, with considered materials and zero filler.
          </p>
        </div>
      </div>
      <FAQ />
    </div>
  );
}

function Cart({
  cart,
  setCart,
  go,
  items,
  discountCode,
  setDiscountCode,
  discountPercent,
  discountAmount,
  applyDiscount,
}: {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  go: (s: string) => void;
  items: Product[];
  discountCode: string;
  setDiscountCode: (s: string) => void;
  discountPercent: number;
  discountAmount: number;
  applyDiscount: (code: string) => Promise<boolean>;
}) {
  const activeCart = cart.filter((item) => items.some((p) => p.id === item.id));
  const uniqueLines = activeCart.reduce<Array<{ p: Product; item: CartItem; qty: number }>>(
    (acc, item) => {
      const p = items.find((product) => product.id === item.id);
      if (!p) return acc;
      const key = `${p.id}-${item.color}-${item.size}`;
      const existing = acc.find(
        (line) => `${line.p.id}-${line.item.color}-${line.item.size}` === key,
      );
      if (existing) {
        existing.qty += 1;
        return acc;
      }
      acc.push({ p, item, qty: 1 });
      return acc;
    },
    [],
  );
  const subtotal = uniqueLines.reduce(
    (sum, { p, qty }) => sum + p.price * qty,
    0,
  );
  const percentOff = Math.round(subtotal * (discountPercent / 100));
  const total = Math.max(0, subtotal - percentOff - discountAmount);
  return (
    <div className="page narrow">
      <div className="page-title">
        <small>YOUR SELECTION</small>
        <h1>SHOPPING BAG ({activeCart.length})</h1>
      </div>
      <div className="cart-layout">
        <div>
          {uniqueLines.length ? (
            uniqueLines.map(({ p, item, qty }) => {
              const variant = p.variants?.find(
                (v) =>
                  v.color.toLowerCase() === item.color.toLowerCase() &&
                  v.size.toLowerCase() === item.size.toLowerCase(),
              );
              const lineStock = p.variants?.length
                ? (variant?.stock ?? 0)
                : p.stock;
              return (
              <div
                className="cart-line"
                key={`${p.id}-${item.color}-${item.size}`}
              >
                <img src={p.image} alt={p.name} />
                <div>
                  <small>{p.cat}</small>
                  <h3>{p.name}</h3>
                  <p>
                    {item.color.toUpperCase()} / {item.size}
                  </p>
                  <div className="qty">
                    <button
                      onClick={() =>
                        setCart((current) => {
                          const index = current.findLastIndex(
                            (entry) =>
                              entry.id === p.id &&
                              entry.color === item.color &&
                              entry.size === item.size,
                          );
                          if (index === -1) return current;
                          return current.filter((_, x) => x !== index);
                        })
                      }
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      disabled={lineStock !== undefined && qty >= lineStock}
                      onClick={() =>
                        setCart((current) => [
                          ...current,
                          { id: p.id, color: item.color, size: item.size },
                        ])
                      }
                    >
                      +
                    </button>
                  </div>
                  {lineStock !== undefined && lineStock <= 5 && (
                    <p className="line-stock-note">
                      {lineStock === 0 ? "Out of stock" : `Only ${lineStock} left`}
                    </p>
                  )}
                </div>
                <strong>{(p.price * qty).toLocaleString("en-US")} EGP</strong>
                <button
                  className="remove"
                  onClick={() =>
                    setCart((current) =>
                      current.filter(
                        (entry) =>
                          !(entry.id === p.id && entry.color === item.color && entry.size === item.size),
                      ),
                    )
                  }
                >
                  REMOVE
                </button>
              </div>
              );
            })
          ) : (
            <p>Your bag is empty.</p>
          )}
        </div>
        <aside className="summary">
          <h2>ORDER SUMMARY</h2>
          <p>
            <span>SUBTOTAL</span>
            <b>{subtotal.toLocaleString("en-US")} EGP</b>
          </p>
          {(percentOff > 0 || discountAmount > 0) && (
            <p>
              <span>DISCOUNT</span>
              <b>
                −{(percentOff + discountAmount).toLocaleString("en-US")} EGP
              </b>
            </p>
          )}
          <label>DISCOUNT CODE</label>
          <div>
            <input
              placeholder="ENTER CODE"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button
              type="button"
              onClick={() => applyDiscount(discountCode)}
            >
              APPLY
            </button>
          </div>
          <hr />
          <p className="total">
            <span>TOTAL</span>
            <b>{total.toLocaleString("en-US")} EGP</b>
          </p>
          <button
            className="add"
            disabled={!activeCart.length}
            onClick={() => go("checkout")}
          >
            CHECKOUT →
          </button>
        </aside>
      </div>
    </div>
  );
}

function Wishlist({
  wish,
  add,
  items,
  open,
}: {
  wish: number[];
  add: (n: number) => void;
  items: Product[];
  open: (p: Product) => void;
}) {
  const wishedItems = items.filter((p) => wish.includes(p.id));
  return (
    <div className="page">
      <div className="page-title">
        <small>SAVED FOR LATER</small>
        <h1>WISHLIST ({wishedItems.length})</h1>
      </div>
      {wishedItems.length ? (
        <div className="grid">
          {wishedItems.map((p) => (
            <Card key={p.id} p={p} open={open} add={add} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>NOTHING SAVED YET.</h2>
          <p>Tap the heart on a product to keep it here.</p>
        </div>
      )}
    </div>
  );
}

function Checkout({
  cart,
  items,
  discountPercent,
  discountAmount,
  freeShipping,
  deliveryFee,
  freeDeliveryFrom,
  deliveryFees,
  governorate,
  setGovernorate,
  go,
  notify,
  onOrderPlaced,
}: {
  cart: CartItem[];
  items: Product[];
  discountPercent: number;
  discountAmount: number;
  freeShipping: boolean;
  deliveryFee: number;
  freeDeliveryFrom: number;
  deliveryFees: DeliveryFee[];
  governorate: string;
  setGovernorate: (s: string) => void;
  go: (s: string) => void;
  notify: (s: string) => void;
  onOrderPlaced: () => void;
}) {
  const activeCart = cart.filter((item) => items.some((p) => p.id === item.id));
  const lines = activeCart.reduce<Array<{ p: Product; item: CartItem; qty: number }>>(
    (acc, item) => {
      const p = items.find((product) => product.id === item.id);
      if (!p) return acc;
      const key = `${p.id}-${item.color}-${item.size}`;
      const existing = acc.find(
        (line) => `${line.p.id}-${line.item.color}-${line.item.size}` === key,
      );
      if (existing) {
        existing.qty += 1;
        return acc;
      }
      acc.push({ p, item, qty: 1 });
      return acc;
    },
    [],
  );
  const subtotal = lines.reduce(
    (s, { p, qty }) => s + p.price * qty,
    0,
  );
  const percentOff = Math.round(subtotal * (discountPercent / 100));
  const cityFee = deliveryFees.find((item) => item.city === governorate)?.fee ?? deliveryFee;
  const delivery =
    subtotal === 0
      ? 0
      : freeShipping || subtotal >= freeDeliveryFrom
        ? 0
        : cityFee;
  const total = Math.max(0, subtotal - percentOff - discountAmount + delivery);
  const placeOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeCart.length) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const first = String(form.get("first") || "").trim();
    const last = String(form.get("last") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const area = String(form.get("area") || "").trim();
    const address = String(form.get("address") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const paymentMethod = String(form.get("pay") || "cod");
    if (!email || !first || !phone) {
      notify("Please fill in all required fields");
      return;
    }
    const orderPayload = {
      email,
      firstName: first,
      lastName: last,
      phone,
      governorate,
      area,
      address,
      notes,
      paymentMethod,
      country: "EGYPT",
      items: lines.map(({ p, item, qty }) => ({
        id: p.id,
        name: p.name,
        color: item.color,
        size: item.size,
        qty,
        price: p.price,
      })),
      subtotal,
      discount: percentOff + discountAmount,
      delivery,
      total,
    };
    if (paymentMethod === "card") {
      try {
        const response = await fetch("/api/payments/paymob", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.iframeUrl) {
          notify(data.error || "Could not start card payment. Please try again.");
          return;
        }
        window.location.href = data.iframeUrl;
      } catch {
        notify("Could not start card payment. Please try again.");
      }
      return;
    }
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        notify(data.error || "Could not place your order. Please try again.");
        return;
      }
    } catch {
      notify("Could not place your order. Please try again.");
      return;
    }
    onOrderPlaced();
    notify(`Order confirmed — ${total.toLocaleString("en-US")} EGP`);
    go("home");
  };
  if (!cart.length) {
    return (
      <div className="page narrow">
        <div className="page-title">
          <small>CHECKOUT</small>
          <h1>YOUR BAG IS EMPTY</h1>
        </div>
        <button className="add" onClick={() => go("shop")}>
          CONTINUE SHOPPING →
        </button>
      </div>
    );
  }
  return (
    <div className="checkout">
      <div className="checkout-head">
        <button type="button" className="brand" onClick={() => go("home")}>
            WESTERN
        </button>
        <span>SECURE CHECKOUT 🔒</span>
      </div>
      <div className="checkout-grid">
        <form onSubmit={placeOrder}>
          <small>01 / CONTACT</small>
          <h2>YOUR INFORMATION</h2>
          <input name="email" placeholder="EMAIL ADDRESS" required />
          <div className="two">
            <input name="first" placeholder="FIRST NAME" required />
            <input name="last" placeholder="LAST NAME" />
          </div>
          <input
            name="phone"
            placeholder="PHONE NUMBER (+20)"
            required
          />
          <small>02 / DELIVERY</small>
          <h2>SHIPPING ADDRESS</h2>
          <select
            name="governorate"
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
          >
            {deliveryFees.map((item) => (
              <option key={item.city} value={item.city}>
                {item.city}
              </option>
            ))}
          </select>
          <input name="area" placeholder="AREA / DISTRICT" required />
          <input
            name="address"
            placeholder="STREET, BUILDING, FLOOR, APARTMENT"
            required
          />
          <textarea name="notes" placeholder="DELIVERY NOTES (OPTIONAL)" />
          <small>03 / PAYMENT</small>
          <h2>PAYMENT METHOD</h2>
          <label className="pay">
            <input type="radio" defaultChecked name="pay" value="cod" /> CASH
            ON DELIVERY <span>PAY WHEN IT ARRIVES</span>
          </label>
          <label className="pay">
            <input type="radio" name="pay" value="card" /> CREDIT / DEBIT
            CARD <span>VISA • MASTERCARD</span>
          </label>
          <button className="add" type="submit">
            PLACE ORDER — {total.toLocaleString("en-US")} EGP
          </button>
        </form>
        <aside className="summary">
          <h2>YOUR ORDER</h2>
          {lines.map(({ p, item, qty }) => (
            <div className="mini" key={`${p.id}-${item.color}-${item.size}`}>
              <img src={p.image} alt={p.name} />
              <p>
                <b>{p.name}</b>
                <small>
                  {item.color.toUpperCase()} / {item.size} / QTY {qty}
                </small>
              </p>
              <strong>
                {(p.price * qty).toLocaleString("en-US")} EGP
              </strong>
            </div>
          ))}
          {(percentOff > 0 || discountAmount > 0) && (
            <p>
              <span>DISCOUNT</span>
              <b>
                −{(percentOff + discountAmount).toLocaleString("en-US")} EGP
              </b>
            </p>
          )}
          <p>
            <span>DELIVERY</span>
            <b>{delivery === 0 ? "FREE" : `${delivery} EGP`}</b>
          </p>
          <hr />
          <p className="total">
            <span>TOTAL</span>
            <b>{total.toLocaleString("en-US")} EGP</b>
          </p>
        </aside>
      </div>
    </div>
  );
}

function Account({
  go,
  tab,
  setTab,
  notify,
  wishCount,
}: {
  go: (s: string) => void;
  tab: string;
  setTab: (s: string) => void;
  notify: (s: string) => void;
  wishCount: number;
}) {
  const orders = [
    ["#C26-1048", "08 AUG 2026", "3 ITEMS", "3,470 EGP", "SHIPPED"],
    ["#C26-1042", "22 JUL 2026", "1 ITEM", "890 EGP", "DELIVERED"],
    ["#C26-1035", "10 JUL 2026", "2 ITEMS", "2,580 EGP", "DELIVERED"],
    ["#C26-1028", "28 JUN 2026", "1 ITEM", "590 EGP", "DELIVERED"],
  ];
  const tabs = [
    "OVERVIEW",
    "ORDERS",
    "ADDRESSES",
    "WISHLIST",
    "ACCOUNT DETAILS",
  ];
  return (
    <div className="dashboard">
      <aside>
        <button className="brand" onClick={() => go("home")}>
          WESTERN
        </button>
        <p>MY ACCOUNT</p>
        {tabs.map((x) => (
          <button
            key={x}
            className={tab === x ? "active" : ""}
            onClick={() => {
              if (x === "WISHLIST") go("wishlist");
              else setTab(x);
            }}
          >
            {x}
            <span>→</span>
          </button>
        ))}
        <button
          className="logout"
          onClick={() => {
            notify("Logged out successfully");
            go("home");
          }}
        >
          LOG OUT
        </button>
      </aside>
      <section>
        <div className="dash-top">
          <div>
            <small>WELCOME BACK</small>
            <h1>HEY, YOUSSEF.</h1>
          </div>
          <button type="button" onClick={() => go("about")}>
            NEED HELP? ↗
          </button>
        </div>
        {tab === "OVERVIEW" && (
          <>
            <div className="account-cards">
              <article>
                <small>TOTAL ORDERS</small>
                <b>04</b>
                <button type="button" onClick={() => setTab("ORDERS")}>
                  VIEW ORDERS →
                </button>
              </article>
              <article>
                <small>ACTIVE ORDER</small>
                <b>01</b>
                <span className="green">● SHIPPED</span>
              </article>
              <article>
                <small>WISHLIST</small>
                <b>{wishCount}</b>
                <button type="button" onClick={() => go("wishlist")}>
                  VIEW WISHLIST →
                </button>
              </article>
            </div>
            <div className="recent">
              <div className="section-head">
                <h2>RECENT ORDER</h2>
                <button type="button" onClick={() => setTab("ORDERS")}>
                  VIEW ALL →
                </button>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>{orders[0][0]}</td>
                    <td>{orders[0][1]}</td>
                    <td>{orders[0][2]}</td>
                    <td>{orders[0][3]}</td>
                    <td>
                      <i>{orders[0][4]}</i>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() =>
                          notify(`Tracking info for ${orders[0][0]} sent to your email`)
                        }
                      >
                        TRACK →
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "ORDERS" && (
          <div className="recent">
            <div className="section-head">
              <h2>ALL ORDERS</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>DATE</th>
                  <th>ITEMS</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o[0]}>
                    <td>{o[0]}</td>
                    <td>{o[1]}</td>
                    <td>{o[2]}</td>
                    <td>{o[3]}</td>
                    <td>
                      <i>{o[4]}</i>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() =>
                          notify(`Tracking info for ${o[0]} sent to your email`)
                        }
                      >
                        TRACK →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "ADDRESSES" && (
          <div className="settings-card">
            <h2>SAVED ADDRESSES</h2>
            <article className="address-card">
              <b>HOME</b>
              <p>12 Hassan Sabry St, Zamalek</p>
              <p>Cairo, Egypt</p>
              <small>DEFAULT SHIPPING ADDRESS</small>
            </article>
            <button
              type="button"
              className="dark-btn"
              onClick={() => notify("Address book updated")}
            >
              + ADD NEW ADDRESS
            </button>
          </div>
        )}
        {tab === "ACCOUNT DETAILS" && (
          <div className="settings-card">
            <h2>PROFILE</h2>
            <label>
              FULL NAME
              <input defaultValue="Youssef Ahmed" />
            </label>
            <label>
              EMAIL
              <input defaultValue="youssef@email.com" type="email" />
            </label>
            <label>
              PHONE
              <input defaultValue="+20 100 123 4567" />
            </label>
            <button
              type="button"
              className="dark-btn"
              onClick={() => notify("Profile saved")}
            >
              SAVE CHANGES
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Invalid username or password.");
        return;
      }
      onLogin();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-login">
      <form onSubmit={submit}>
        <small>WESTERN / ADMIN</small>
        <h1>ADMIN LOGIN</h1>
        <label>
          USERNAME
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          PASSWORD
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button className="dark-btn" type="submit" disabled={loading}>
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}

function VariantEditor({
  productColor,
  setProductColor,
  selectedColors,
  setSelectedColors,
  colorSizes,
  setColorSizes,
  variantStock,
  setVariantStock,
  colorImages,
  setColorImages,
  includeHiddenInputs = false,
}: {
  productColor: string;
  setProductColor: (s: string) => void;
  selectedColors: string[];
  setSelectedColors: Dispatch<SetStateAction<string[]>>;
  colorSizes: Record<string, string[]>;
  setColorSizes: Dispatch<SetStateAction<Record<string, string[]>>>;
  variantStock: Record<string, string>;
  setVariantStock: Dispatch<SetStateAction<Record<string, string>>>;
  colorImages: Record<string, string[]>;
  setColorImages: Dispatch<SetStateAction<Record<string, string[]>>>;
  includeHiddenInputs?: boolean;
}) {
  const [uploadingColorImage, setUploadingColorImage] = useState<string | null>(
    null,
  );
  const chooseColorImage =
    (color: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        e.target.value = "";
        alert("Please choose an image smaller than 5 MB.");
        return;
      }
      const upload = new FormData();
      upload.set("file", file);
      setUploadingColorImage(color);
      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: upload,
        });
        if (!response.ok) throw new Error("Upload failed");
        const { url } = await response.json();
        setColorImages((current) => ({
          ...current,
          [color]: [...(current[color] || []), url],
        }));
      } catch {
        alert("Image upload failed. Please try again.");
      } finally {
        setUploadingColorImage(null);
        e.target.value = "";
      }
    };
  const removeColorImage = (color: string, image: string) => {
    setColorImages((current) => ({
      ...current,
      [color]: (current[color] || []).filter((img) => img !== image),
    }));
  };
  return (
    <>
      <label>
        COLORS
        <div className="color-picker-row">
          <input
            type="color"
            value={productColor}
            onChange={(e) => setProductColor(e.target.value)}
            aria-label="Choose product color"
          />
          <button
            type="button"
            className="table-action"
            onClick={() =>
              setSelectedColors((current) =>
                current.includes(productColor)
                  ? current
                  : [...current, productColor],
              )
            }
          >
            + ADD COLOR
          </button>
        </div>
        <div className="color-swatch-list">
          {selectedColors.map((c) => (
            <span key={c} className="color-swatch-chip">
              <i style={{ background: c }} />
              {includeHiddenInputs && (
                <input type="hidden" name="colors" value={c} />
              )}
              <button
                type="button"
                aria-label={`Remove ${c}`}
                onClick={() =>
                  setSelectedColors((current) => current.filter((x) => x !== c))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </label>
      {selectedColors.map((c) => (
        <div key={c} className="color-variant-group">
          <span className="color-sizes-label">
            <i style={{ background: c }} /> IMAGES FOR THIS COLOR
          </span>
          <div className="color-image-row">
            {(colorImages[c] || []).map((img) => (
              <span key={img} className="color-image-chip">
                <img src={img} alt={`${c} preview`} className="color-image-preview" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeColorImage(c, img)}
                >
                  ×
                </button>
              </span>
            ))}
            <label className="hero-upload">
              ADD IMAGE
              <input
                type="file"
                accept="image/*"
                onChange={chooseColorImage(c)}
                disabled={uploadingColorImage === c}
              />
              <span className="outline-admin">
                {uploadingColorImage === c ? "UPLOADING..." : "CHOOSE IMAGE"}
              </span>
            </label>
          </div>
          <span className="color-sizes-label">
            <i style={{ background: c }} /> SIZES FOR THIS COLOR
          </span>
          <div className="size-options">
            {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
              <label key={size} className="size-option">
                <input
                  type="checkbox"
                  checked={(colorSizes[c] || []).includes(size)}
                  onChange={(e) =>
                    setColorSizes((current) => {
                      const sizes = current[c] || [];
                      return {
                        ...current,
                        [c]: e.target.checked
                          ? [...sizes, size]
                          : sizes.filter((x) => x !== size),
                      };
                    })
                  }
                />
                {size}
              </label>
            ))}
          </div>
          {(colorSizes[c] || []).length > 0 && (
            <div className="variant-stock-row">
              {(colorSizes[c] || []).map((sz) => (
                <label key={sz} className="variant-stock-input">
                  <small>{sz}</small>
                  <input
                    type="number"
                    min="0"
                    placeholder="QTY"
                    value={variantStock[`${c}_${sz}`] || ""}
                    onChange={(e) =>
                      setVariantStock((current) => ({
                        ...current,
                        [`${c}_${sz}`]: e.target.value,
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      {includeHiddenInputs &&
        Array.from(new Set(Object.values(colorSizes).flat())).map((size) => (
          <input key={size} type="hidden" name="sizes" value={size} />
        ))}
    </>
  );
}

function Admin({
  catalog,
  deliveryFees,
  onDeliveryFeesChange,
  homepage,
  onHomepageChange,
  onProductAdded,
  onProductDeleted,
}: {
  catalog: Product[];
  deliveryFees: DeliveryFee[];
  onDeliveryFeesChange: Dispatch<SetStateAction<DeliveryFee[]>>;
  homepage: HomepageContent;
  onHomepageChange: Dispatch<SetStateAction<HomepageContent>>;
  onProductAdded: (product: {
    id: number;
    name: string;
    category: string;
    price: number;
    salePrice?: number | null;
    image: string;
    colors?: string;
  }) => void;
  onProductDeleted: (id: number) => void;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);
  const logOut = () => {
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAuthenticated(false);
  };
  const adminTabs = [
    "OVERVIEW",
    "PRODUCTS",
    "ORDERS",
    "CUSTOMERS",
    "COLLECTIONS",
    "CATEGORIES",
    "DELIVERY FEES",
    "DISCOUNTS",
    "HOMEPAGE",
    "SETTINGS",
  ];
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((data) => {
        type OrderRow = {
          id: number;
          firstName: string;
          lastName: string | null;
          email: string;
          phone: string;
          governorate: string | null;
          area: string | null;
          address: string | null;
          paymentMethod: string;
          items: string;
          subtotal: string;
          discount: string;
          delivery: string;
          total: string;
          status: string;
          createdAt: string;
        };
        setOrders(
          (data.orders || []).map((o: OrderRow) => {
            let items: AdminOrderItem[] = [];
            try {
              items = JSON.parse(o.items || "[]");
            } catch {
              items = [];
            }
            return {
              id: o.id,
              ref: `#C26-${o.id}`,
              customer: [o.firstName, o.lastName].filter(Boolean).join(" "),
              email: o.email,
              phone: o.phone,
              governorate: o.governorate || "",
              area: o.area || "",
              address: o.address || "",
              paymentMethod: o.paymentMethod,
              items,
              subtotal: Number(o.subtotal),
              discount: Number(o.discount),
              delivery: Number(o.delivery),
              total: `${Number(o.total).toLocaleString("en-US")} EGP`,
              totalValue: Number(o.total),
              status: o.status,
              createdAt: o.createdAt,
            };
          }),
        );
      })
      .catch(() => {});
  }, []);
  const [tab, setTab] = useState("OVERVIEW"),
    [showForm, setShowForm] = useState(false),
    [saved, setSaved] = useState<
      {
        name: string;
        category: string;
        price: string;
        stock: string;
        salePrice?: string | null;
        image: string;
        id?: number;
      }[]
    >([]),
    [savedNotice, setSavedNotice] = useState(false),
    [imagePreview, setImagePreview] = useState(""),
    [productColor, setProductColor] = useState("#171717"),
    [selectedColors, setSelectedColors] = useState<string[]>(["#171717"]),
    [colorSizes, setColorSizes] = useState<Record<string, string[]>>({}),
    [variantStock, setVariantStock] = useState<Record<string, string>>({}),
    [colorImages, setColorImages] = useState<Record<string, string[]>>({}),
    [range, setRange] = useState(7);
  const totalStock = selectedColors.reduce(
    (sum, c) =>
      sum +
      (colorSizes[c] || []).reduce(
        (s, sz) => s + (Number(variantStock[`${c}_${sz}`]) || 0),
        0,
      ),
    0,
  );
  const liveProductCount = catalog.length || saved.length || products.length;
  const pctChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };
  const trendLabel = (pct: number) =>
    `${pct >= 0 ? "↗" : "↘"} ${Math.abs(pct).toFixed(1)}% THIS MONTH`;
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const ordersThisMonth = orders.filter(
    (o) => new Date(o.createdAt) >= currentMonthStart,
  );
  const ordersLastMonth = orders.filter((o) => {
    const created = new Date(o.createdAt);
    return created >= previousMonthStart && created < currentMonthStart;
  });
  const sumRevenue = (list: AdminOrder[]) =>
    list.reduce((s, o) => s + o.totalValue, 0);
  const totalRevenue = sumRevenue(orders);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const revenueThisMonth = sumRevenue(ordersThisMonth);
  const revenueLastMonth = sumRevenue(ordersLastMonth);
  const avgThisMonth = ordersThisMonth.length
    ? revenueThisMonth / ordersThisMonth.length
    : 0;
  const avgLastMonth = ordersLastMonth.length
    ? revenueLastMonth / ordersLastMonth.length
    : 0;
  const revenueTrend = trendLabel(pctChange(revenueThisMonth, revenueLastMonth));
  const ordersTrend = trendLabel(
    pctChange(ordersThisMonth.length, ordersLastMonth.length),
  );
  const avgOrderTrend = trendLabel(pctChange(avgThisMonth, avgLastMonth));
  const salesByProduct = new Map<string, { qty: number; revenue: number }>();
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const entry = salesByProduct.get(item.name) || { qty: 0, revenue: 0 };
      entry.qty += item.qty;
      entry.revenue += item.qty * item.price;
      salesByProduct.set(item.name, entry);
    });
  });
  const bestSeller = [...salesByProduct.entries()].sort(
    (a, b) => b[1].qty - a[1].qty,
  )[0];
  const bestSellerProduct = bestSeller
    ? catalog.find((p) => p.name === bestSeller[0])
    : undefined;
  const chartRange = (() => {
    const days = range;
    const buckets = Array.from({ length: days }, (_, i) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - (days - 1 - i),
      );
      return { date, total: 0 };
    });
    orders.forEach((o) => {
      const created = new Date(o.createdAt);
      const dayStart = new Date(
        created.getFullYear(),
        created.getMonth(),
        created.getDate(),
      ).getTime();
      const bucket = buckets.find((b) => b.date.getTime() === dayStart);
      if (bucket) bucket.total += o.totalValue;
    });
    const max = Math.max(1, ...buckets.map((b) => b.total));
    return {
      total: `${buckets
        .reduce((s, b) => s + b.total, 0)
        .toLocaleString("en-US")} EGP`,
      points: buckets.map((b) =>
        b.total ? Math.max(4, Math.round((b.total / max) * 100)) : 0,
      ),
      labels: buckets.map((b) =>
        days <= 7
          ? b.date
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase()
          : String(b.date.getDate()),
      ),
    };
  })();
  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((data) =>
        setSaved(
          data.products.map(
            (p: SavedProduct & { price: number; stock: number }) => ({
              ...p,
              price: String(p.price),
              stock: String(p.stock),
              salePrice: p.salePrice ? String(p.salePrice) : null,
            }),
          ),
        ),
      )
      .catch(() => {});
  }, []);
  if (checkingSession) return null;
  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  const closeForm = () => {
    setShowForm(false);
    setImagePreview("");
    setProductColor("#171717");
    setSelectedColors(["#171717"]);
    setColorSizes({});
    setVariantStock({});
    setColorImages({});
  };
  const chooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      e.target.value = "";
      alert("Please choose an image smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const upload = new FormData();
    upload.set("file", data.get("image") as File);
    const uploadResponse = await fetch("/api/uploads", {
      method: "POST",
      body: upload,
    });
    if (!uploadResponse.ok) {
      alert("Image upload failed. Please try again.");
      return;
    }
    const { url } = await uploadResponse.json();
    const variants = selectedColors.flatMap((color) =>
      (colorSizes[color] || []).map((size) => ({
        color,
        size,
        stock: Number(variantStock[`${color}_${size}`]) || 0,
      })),
    );
    const colorImagesPayload = Object.entries(colorImages).flatMap(
      ([color, images]) => images.map((image) => ({ color, image })),
    );
    const payload = {
      name: String(data.get("name")),
      category: String(data.get("category")),
      collection: String(data.get("collection")),
      price: Number(data.get("price")),
      salePrice: data.get("salePrice") ? Number(data.get("salePrice")) : null,
      stock: Number(data.get("stock")),
      image: url,
      sizes: data.getAll("sizes").join(", "),
      colors: data.getAll("colors").join(","),
      description: String(data.get("description")),
      variants,
      colorImages: colorImagesPayload,
    };
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      alert("Product could not be saved.");
      return;
    }
    const { product } = await response.json();
    onProductAdded(product);
    setSaved([
      {
        ...product,
        price: String(product.price),
        stock: String(product.stock),
        salePrice: product.salePrice ? String(product.salePrice) : null,
      },
      ...saved,
    ]);
    closeForm();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };
  return (
    <div className="admin">
      <aside>
        <div className="admin-logo">
          WESTERN<span>ADMIN</span>
        </div>
        {adminTabs.map((x, i) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={tab === x ? "active" : ""}
          >
            {["▦", "□", "▤", "◇", "⌁", "%", "▣", "⚙"][i]} &nbsp; {x}
          </button>
        ))}
        <div className="admin-user">
          <i>YA</i>
          <p>
            <b>abdoumagdy</b>
            <small>OWNER</small>
          </p>
        </div>
        <button
          className="logout"
          onClick={logOut}
        >
          LOG OUT
        </button>
      </aside>
      <section className={tab === "OVERVIEW" ? "" : "admin-section-alt"}>
        <header>
          <div>
            <small>ADMIN / {tab}</small>
            <h1>{tab === "OVERVIEW" ? "GOOD MORNING, YOUSSEF." : tab}</h1>
          </div>
          {tab === "PRODUCTS" && (
            <button className="dark-btn" onClick={() => setShowForm(true)}>
              + ADD PRODUCT
            </button>
          )}
        </header>
        {tab !== "OVERVIEW" && (
          <AdminPanel
            tab={tab}
            catalog={catalog}
            deliveryFees={deliveryFees}
            onDeliveryFeesChange={onDeliveryFeesChange}
            saved={saved}
            setSaved={setSaved}
            homepage={homepage}
            onHomepageChange={onHomepageChange}
            addProduct={() => setShowForm(true)}
            notify={() => {
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 2500);
            }}
            onProductChanged={onProductAdded}
            onProductDeleted={onProductDeleted}
            orders={orders}
            setOrders={setOrders}
          />
        )}
        <div className="metric-grid">
          <article>
            <small>TOTAL REVENUE</small>
            <b>
              {totalRevenue.toLocaleString("en-US")} <i>EGP</i>
            </b>
            <span>{revenueTrend}</span>
          </article>
          <article>
            <small>TOTAL ORDERS</small>
            <b>{totalOrders}</b>
            <span>{ordersTrend}</span>
          </article>
          <article>
            <small>PRODUCT CATALOG</small>
            <b>{liveProductCount}</b>
            <span>
              {saved.length
                ? `${saved.length} ACTIVE PRODUCT${saved.length > 1 ? "S" : ""}`
                : "READY TO MANAGE"}
            </span>
          </article>
          <article>
            <small>AVG. ORDER VALUE</small>
            <b>
              {Math.round(avgOrderValue).toLocaleString("en-US")} <i>EGP</i>
            </b>
            <span>{avgOrderTrend}</span>
          </article>
        </div>
        <div className="admin-mid">
          <article className="chart">
            <div className="section-head">
              <div>
                <small>SALES OVERVIEW</small>
                <h2>{chartRange.total}</h2>
              </div>
              <div className="range-picker">
                <span className="sheet-icon" aria-label="Sales range selector">
                  ▦
                </span>
                <select
                  value={range}
                  onChange={(e) => setRange(Number(e.target.value) as 7 | 15 | 30)}
                >
                  <option value={7}>LAST 7 DAYS</option>
                  <option value={15}>LAST 15 DAYS</option>
                  <option value={30}>LAST 30 DAYS</option>
                </select>
              </div>
            </div>
            <div className="bars">
              {chartRange.points.map((n, i) => (
                <div key={`${range}-${i}`}>
                  <i style={{ height: n + "%" }} />
                  <small>{chartRange.labels[i]}</small>
                </div>
              ))}
            </div>
          </article>
          <article className="top-product">
            <small>BEST SELLER</small>
            {bestSeller ? (
              <>
                {bestSellerProduct && (
                  <img
                    src={bestSellerProduct.image}
                    alt={bestSellerProduct.name}
                  />
                )}
                <h3>{bestSeller[0]}</h3>
                <p>
                  <span>{bestSeller[1].qty} SOLD</span>
                  <b>{bestSeller[1].revenue.toLocaleString("en-US")} EGP</b>
                </p>
              </>
            ) : (
              <>
                <h3>No sales yet</h3>
                <p>
                  <span>0 SOLD</span>
                  <b>0 EGP</b>
                </p>
              </>
            )}
          </article>
        </div>
        {saved.length > 0 && (
          <div className="orders">
            <div className="section-head">
              <h2>NEW PRODUCTS</h2>
              <small>SAVED THIS SESSION</small>
            </div>
            <table>
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {saved.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div className="saved-product">
                        <img src={p.image} alt={p.name} />
                        <b>{p.name}</b>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>{Number(p.price).toLocaleString("en-US")} EGP</td>
                    <td>{p.stock}</td>
                    <td>
                      <i>ACTIVE</i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="orders">
          <div className="section-head">
            <h2>RECENT ORDERS</h2>
            <button onClick={() => setTab("ORDERS")}>VIEW ALL ORDERS →</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>{o.ref}</td>
                    <td>{o.customer}</td>
                    <td>{o.total}</td>
                    <td>
                      <i>{o.status}</i>
                    </td>
                    <td>•••</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {showForm && (
        <div className="modal-backdrop" onMouseDown={closeForm}>
          <div
            className="product-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <small>PRODUCT CATALOG</small>
                <h2>ADD NEW PRODUCT</h2>
              </div>
              <button type="button" onClick={closeForm} aria-label="Close">
                ×
              </button>
            </div>
            <form onSubmit={submit}>
              <label>
                PRODUCT NAME
                <input
                  name="name"
                  required
                  placeholder="E.G. DOWNTOWN HEAVY TEE"
                />
              </label>
              <div className="form-two">
                <label>
                  CATEGORY
                  <select name="category" required>
                    <option>T-SHIRTS</option>
                    <option>HOODIES</option>
                    <option>CARGOS</option>
                    <option>JACKETS</option>
                    <option>CAPS</option>
                    <option>ACCESSORIES</option>
                  </select>
                </label>
                <label>
                  COLLECTION
                  <select name="collection">
                    <option>NEW DROPS</option>
                    <option>SUMMER 26</option>
                    <option>BEST SELLERS</option>
                    <option>LIMITED EDITION</option>
                  </select>
                </label>
              </div>
              <label>
                PRICE (EGP)
                <input
                  name="price"
                  type="number"
                  min="1"
                  required
                  placeholder="890"
                />
              </label>
              <input type="hidden" name="stock" value={totalStock} />
              <label>
                SALE PRICE (EGP) — OPTIONAL
                <input
                  name="salePrice"
                  type="number"
                  min="1"
                  placeholder="LEAVE EMPTY FOR NO SALE"
                />
              </label>
              <label>
                PRODUCT IMAGE
                <div
                  className={
                    "image-upload " + (imagePreview ? "has-image" : "")
                  }
                >
                  <input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={chooseImage}
                  />
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Product preview" />
                      <span>CHANGE IMAGE</span>
                    </>
                  ) : (
                    <>
                      <b>↑</b>
                      <strong>CHOOSE IMAGE FROM DEVICE</strong>
                      <small>JPG, PNG OR WEBP — MAX 5 MB</small>
                    </>
                  )}
                </div>
              </label>
              <VariantEditor
                productColor={productColor}
                setProductColor={setProductColor}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                colorSizes={colorSizes}
                setColorSizes={setColorSizes}
                variantStock={variantStock}
                setVariantStock={setVariantStock}
                colorImages={colorImages}
                setColorImages={setColorImages}
                includeHiddenInputs
              />
              <label>
                DESCRIPTION
                <textarea
                  name="description"
                  rows={3}
                  placeholder="PRODUCT DETAILS, FIT AND MATERIALS"
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={closeForm}>
                  CANCEL
                </button>
                <button className="dark-btn" type="submit">
                  SAVE PRODUCT →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {savedNotice && <div className="toast">✓ PRODUCT ADDED SUCCESSFULLY</div>}
    </div>
  );
}

type SavedProduct = {
  id?: number;
  name: string;
  category: string;
  price: string;
  salePrice?: string | null;
  stock: string;
  image: string;
  colors?: string;
};

function AdminPanel({
  tab,
  catalog,
  deliveryFees,
  onDeliveryFeesChange,
  saved,
  setSaved,
  addProduct,
  notify,
  homepage,
  onHomepageChange,
  onProductChanged,
  onProductDeleted,
  orders,
  setOrders,
}: {
  tab: string;
  catalog: Product[];
  deliveryFees: DeliveryFee[];
  onDeliveryFeesChange: Dispatch<SetStateAction<DeliveryFee[]>>;
  saved: SavedProduct[];
  setSaved: (items: SavedProduct[]) => void;
  addProduct: () => void;
  notify: () => void;
  homepage: HomepageContent;
  onHomepageChange: Dispatch<SetStateAction<HomepageContent>>;
  onProductChanged: (product: {
    id: number;
    name: string;
    category: string;
    price: number;
    salePrice?: number | null;
    image: string;
    colors?: string;
  }) => void;
  onProductDeleted: (id: number) => void;
  orders: AdminOrder[];
  setOrders: Dispatch<SetStateAction<AdminOrder[]>>;
}) {
  const action = () => notify();
  const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const customers = useMemo(() => {
    const map = new Map<
      string,
      { name: string; email: string; phone: string; orders: AdminOrder[] }
    >();
    for (const o of orders) {
      const key = o.email.toLowerCase();
      const existing = map.get(key);
      if (existing) existing.orders.push(o);
      else map.set(key, { name: o.customer, email: o.email, phone: o.phone, orders: [o] });
    }
    return [...map.values()]
      .map((c) => ({
        ...c,
        orderCount: c.orders.length,
        totalSpent: c.orders.reduce((s, o) => s + o.totalValue, 0),
      }))
      .sort((a, b) => b.orderCount - a.orderCount);
  }, [orders]);
  const filteredCustomers = customerSearch.trim()
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(customerSearch.trim().toLowerCase()) ||
          c.email.toLowerCase().includes(customerSearch.trim().toLowerCase()),
      )
    : customers;
  const [viewCustomer, setViewCustomer] = useState<
    (typeof customers)[number] | null
  >(null);
  const updateOrderStatus = async (id: number, status: string) => {
    const response = await fetch("/api/orders", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) return;
    setOrders((current) =>
      current.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    notify();
  };
  const displayedProducts: SavedProduct[] = saved.length
    ? saved
    : catalog.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.cat,
        price: String(product.price),
        stock: "0",
        image: product.image,
        colors: (product.colors || []).join(","),
      }));
  const [uploadingField, setUploadingField] = useState<
    "image" | "campaignImage" | "storyImage" | "aboutImage" | null
  >(null);
  const [collections, setCollections] = useState<
    { id?: number; name: string }[]
  >([
    { name: "NEW DROPS" },
    { name: "SUMMER 26" },
    { name: "CITY LAYERS" },
    { name: "BEST SELLERS" },
    { name: "LIMITED EDITION" },
  ]);
  const [managedCollection, setManagedCollection] = useState<string | null>(
    null,
  );
  const [newCollectionName, setNewCollectionName] = useState("");
  const [renamingCollection, setRenamingCollection] = useState<string | null>(
    null,
  );
  const [renameValue, setRenameValue] = useState("");
  const [pendingDeleteCollection, setPendingDeleteCollection] = useState<
    string | null
  >(null);
  const [categories, setCategories] = useState<{ id?: number; name: string }[]>(
    [],
  );
  const [newCategory, setNewCategory] = useState("");
  const [newDeliveryCity, setNewDeliveryCity] = useState("");
  const [newDeliveryFee, setNewDeliveryFee] = useState("");
  const [editingProduct, setEditingProduct] = useState<SavedProduct | null>(null);
  const [managingVariants, setManagingVariants] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [variantProductColor, setVariantProductColor] = useState("#171717");
  const [variantSelectedColors, setVariantSelectedColors] = useState<string[]>([]);
  const [variantColorSizes, setVariantColorSizes] = useState<
    Record<string, string[]>
  >({});
  const [variantStockEdit, setVariantStockEdit] = useState<
    Record<string, string>
  >({});
  const [variantColorImagesEdit, setVariantColorImagesEdit] = useState<
    Record<string, string[]>
  >({});
  const [variantsLoading, setVariantsLoading] = useState(false);
  const openVariantEditor = async (product: { id?: number; name: string }) => {
    if (!product.id) return;
    setManagingVariants({ id: product.id, name: product.name });
    setVariantsLoading(true);
    try {
      const response = await fetch(`/api/products/${product.id}/variants`);
      const data = await response.json();
      const rows: { color: string; size: string; stock: number }[] =
        data.variants || [];
      const imageRows: { color: string; image: string }[] =
        data.colorImages || [];
      const colors = [
        ...new Set([
          ...rows.map((row) => row.color),
          ...imageRows.map((row) => row.color),
        ]),
      ];
      const sizesByColor: Record<string, string[]> = {};
      const stockByKey: Record<string, string> = {};
      for (const row of rows) {
        sizesByColor[row.color] = [...(sizesByColor[row.color] || []), row.size];
        stockByKey[`${row.color}_${row.size}`] = String(row.stock);
      }
      const imagesByColor: Record<string, string[]> = {};
      for (const row of imageRows)
        imagesByColor[row.color] = [...(imagesByColor[row.color] || []), row.image];
      setVariantSelectedColors(colors);
      setVariantColorSizes(sizesByColor);
      setVariantStockEdit(stockByKey);
      setVariantColorImagesEdit(imagesByColor);
    } catch {
      setVariantSelectedColors([]);
      setVariantColorSizes({});
      setVariantStockEdit({});
      setVariantColorImagesEdit({});
    } finally {
      setVariantsLoading(false);
    }
  };
  const saveVariants = async () => {
    if (!managingVariants) return;
    const variants = variantSelectedColors.flatMap((color) =>
      (variantColorSizes[color] || []).map((size) => ({
        color,
        size,
        stock: Number(variantStockEdit[`${color}_${size}`]) || 0,
      })),
    );
    const colorImages = Object.entries(variantColorImagesEdit).flatMap(
      ([color, images]) => images.map((image) => ({ color, image })),
    );
    const response = await fetch(
      `/api/products/${managingVariants.id}/variants`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ variants, colorImages }),
      },
    );
    if (!response.ok) {
      alert("Could not save variants.");
      return;
    }
    const { stock } = await response.json();
    setSaved(
      saved.map((p) =>
        p.id === managingVariants.id ? { ...p, stock: String(stock) } : p,
      ),
    );
    setManagingVariants(null);
    notify();
  };
  const [discountCodesList, setDiscountCodesList] = useState<
    {
      id: number;
      code: string;
      type: string;
      value: string | null;
      active: boolean;
      uses: number;
    }[]
  >([]);
  const [newDiscountCode, setNewDiscountCode] = useState("");
  const [newDiscountType, setNewDiscountType] = useState("percent");
  const [newDiscountValue, setNewDiscountValue] = useState("");
  const chooseImage =
    (field: "image" | "campaignImage" | "storyImage" | "aboutImage") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        e.target.value = "";
        alert("Please choose an image smaller than 5 MB.");
        return;
      }
      const upload = new FormData();
      upload.set("file", file);
      setUploadingField(field);
      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: upload,
        });
        if (!response.ok) throw new Error("Upload failed");
        const { url } = await response.json();
        onHomepageChange((current) => ({ ...current, [field]: url }));
      } catch {
        alert("Image upload failed. Please try again.");
      } finally {
        setUploadingField(null);
        e.target.value = "";
      }
    };
  const saveBackgroundImages = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        heroImage: homepage.image,
        campaignImage: homepage.campaignImage,
        storyImage: homepage.storyImage,
        aboutImage: homepage.aboutImage,
      }),
    });
    notify();
  };
  const saveSocialSettings = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        instagramUrl: homepage.instagramUrl,
        tiktokUrl: homepage.tiktokUrl,
        facebookUrl: homepage.facebookUrl,
        whatsappNumber: homepage.whatsappNumber,
        storeLocation: homepage.storeLocation,
      }),
    });
    notify();
  };
  const downloadHeroImage = async () => {
    try {
      const response = await fetch(homepage.image);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "western-hero-banner";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(homepage.image, "_blank", "noopener,noreferrer");
    }
  };
  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        setCollections(
          data.collections.length
            ? data.collections
            : [
                { name: "NEW DROPS" },
                { name: "SUMMER 26" },
                { name: "CITY LAYERS" },
                { name: "BEST SELLERS" },
                { name: "LIMITED EDITION" },
              ],
        );
        setCategories(data.categories);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    fetch("/api/discounts")
      .then((r) => r.json())
      .then((data) => setDiscountCodesList(data.discountCodes || []))
      .catch(() => {});
  }, []);
  const addDiscountCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = newDiscountCode.trim().toUpperCase();
    if (!code) return;
    const response = await fetch("/api/discounts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code,
        type: newDiscountType,
        value: newDiscountValue,
        active: true,
      }),
    });
    if (!response.ok) {
      alert("Could not create discount code (the code may already exist).");
      return;
    }
    const { discountCode } = await response.json();
    setDiscountCodesList([discountCode, ...discountCodesList]);
    setNewDiscountCode("");
    setNewDiscountValue("");
    notify();
  };
  const toggleDiscountActive = async (code: {
    id: number;
    active: boolean;
  }) => {
    const response = await fetch("/api/discounts", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: code.id, active: !code.active }),
    });
    if (!response.ok) return;
    const { discountCode } = await response.json();
    setDiscountCodesList(
      discountCodesList.map((x) => (x.id === code.id ? discountCode : x)),
    );
    notify();
  };
  const deleteDiscountCode = async (id: number) => {
    await fetch(`/api/discounts?id=${id}`, { method: "DELETE" });
    setDiscountCodesList(discountCodesList.filter((x) => x.id !== id));
    notify();
  };
  const addCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCollectionName.trim().toUpperCase();
    if (!name || collections.some((x) => x.name === name)) return;
    const response = await fetch("/api/catalog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "collection", name }),
    });
    if (!response.ok) return;
    const { item } = await response.json();
    setCollections([...collections, item]);
    setNewCollectionName("");
    notify();
  };
  const startRenameCollection = (collection: { id?: number; name: string }) => {
    setPendingDeleteCollection(null);
    setRenamingCollection(collection.name);
    setRenameValue(collection.name);
  };
  const saveRenameCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const collection = collections.find((x) => x.name === renamingCollection);
    const trimmed = renameValue.trim().toUpperCase();
    if (!collection || !trimmed || trimmed === collection.name) {
      setRenamingCollection(null);
      return;
    }
    if (collection.id) {
      const response = await fetch("/api/catalog", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "collection",
          id: collection.id,
          name: trimmed,
        }),
      });
      if (!response.ok) return;
    }
    setCollections(
      collections.map((x) => (x === collection ? { ...x, name: trimmed } : x)),
    );
    if (managedCollection === collection.name) setManagedCollection(trimmed);
    setRenamingCollection(null);
    notify();
  };
  const deleteCollection = async (collection: { id?: number; name: string }) => {
    if (collection.id) {
      await fetch(`/api/catalog?type=collection&id=${collection.id}`, {
        method: "DELETE",
      });
    }
    setCollections(collections.filter((x) => x !== collection));
    if (managedCollection === collection.name) setManagedCollection(null);
    setPendingDeleteCollection(null);
    notify();
  };
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategory.trim().toUpperCase();
    if (!name || categories.some((x) => x.name === name)) return;
    const response = await fetch("/api/catalog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "category", name }),
    });
    if (!response.ok) return;
    const { item } = await response.json();
    setCategories([...categories, item]);
    setNewCategory("");
    notify();
  };
  const addDeliveryFee = (e: React.FormEvent) => {
    e.preventDefault();
    const city = newDeliveryCity.trim().toUpperCase();
    const fee = Number(newDeliveryFee);
    if (!city || !Number.isFinite(fee) || fee < 0) return;
    onDeliveryFeesChange((current) => [
      ...current.filter((item) => item.city !== city),
      { city, fee },
    ]);
    setNewDeliveryCity("");
    setNewDeliveryFee("");
    notify();
  };
  const saveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = editingProduct;
    if (!product?.id || !product.name.trim() || !product.price) return;
    const response = await fetch("/api/products", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...product,
        name: product.name.trim(),
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        stock: Number(product.stock),
      }),
    });
    if (!response.ok) return;
    const { product: updated } = await response.json();
    onProductChanged(updated);
    setSaved(
      saved.map((p) =>
        p.id === updated.id
          ? {
              ...updated,
              price: String(updated.price),
              stock: String(updated.stock),
              salePrice: updated.salePrice ? String(updated.salePrice) : null,
            }
          : p,
      ),
    );
    setEditingProduct(null);
    notify();
  };
  if (tab === "PRODUCTS")
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>CATALOG MANAGEMENT</small>
            <h2>ALL PRODUCTS ({displayedProducts.length})</h2>
          </div>
          <button className="dark-btn" onClick={addProduct}>
            + ADD PRODUCT
          </button>
        </div>
        <div className="orders">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>SALE</th>
                <th>STOCK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((p, i) => (
                <Fragment key={p.id || p.name + i}>
                <tr>
                  <td>
                    <div className="saved-product">
                      <img src={p.image} alt={p.name} />
                      <b>{p.name}</b>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{Number(p.price).toLocaleString("en-US")} EGP</td>
                  <td>
                    {p.salePrice
                      ? `${Number(p.salePrice).toLocaleString("en-US")} EGP`
                      : "—"}
                  </td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => setEditingProduct({ ...p })}
                    >
                      UPDATE
                    </button>
                    <button
                      className="table-action"
                      onClick={() => openVariantEditor(p)}
                    >
                      VARIANTS
                    </button>
                    <button
                      className="table-action danger"
                      onClick={async () => {
                        if (!p.id) return;
                        try {
                          const response = await fetch(`/api/products?id=${p.id}`, {
                            method: "DELETE",
                          });
                          if (!response.ok) {
                            alert("Could not delete this product. Please try again.");
                            return;
                          }
                        } catch {
                          alert("Could not delete this product. Please try again.");
                          return;
                        }
                        onProductDeleted(p.id);
                        setSaved(saved.filter((_, x) => x !== i));
                        notify();
                      }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
                {editingProduct?.id === p.id && (
                  <tr className="product-edit-row">
                    <td colSpan={6}>
                      <form className="product-edit-list" onSubmit={saveProductEdit}>
                        <label>
                          <span>PRODUCT NAME</span>
                          <input
                            value={editingProduct!.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })}
                            required
                          />
                        </label>
                        <label>
                          <span>CATEGORY</span>
                          <select
                            value={editingProduct!.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct!, category: e.target.value })}
                          >
                            {categories.map((category) => (
                              <option key={category.id || category.name}>{category.name}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>PRICE (EGP)</span>
                          <input
                            type="number"
                            min="0"
                            value={editingProduct!.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct!, price: e.target.value })}
                            required
                          />
                        </label>
                        <label>
                          <span>SALE PRICE</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="NO SALE"
                            value={editingProduct!.salePrice || ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct!, salePrice: e.target.value || null })}
                          />
                        </label>
                        <label>
                          <span>STOCK</span>
                          <input
                            type="number"
                            min="0"
                            value={editingProduct!.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct!, stock: e.target.value })}
                          />
                        </label>
                        <label>
                          <span>COLORS</span>
                          <input
                            value={editingProduct!.colors || ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct!, colors: e.target.value })}
                            placeholder="e.g. #171717, #ffffff"
                          />
                        </label>
                        <div className="product-edit-actions">
                          <button type="button" className="table-action" onClick={() => setEditingProduct(null)}>
                            CANCEL
                          </button>
                          <button type="submit" className="dark-btn">SAVE UPDATE</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {managingVariants && (
          <div
            className="modal-backdrop"
            onMouseDown={() => setManagingVariants(null)}
          >
            <div
              className="product-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <div>
                  <small>STOCK BY SIZE / COLOR</small>
                  <h2>{managingVariants.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setManagingVariants(null)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              {variantsLoading ? (
                <p>Loading…</p>
              ) : (
                <>
                  <VariantEditor
                    productColor={variantProductColor}
                    setProductColor={setVariantProductColor}
                    selectedColors={variantSelectedColors}
                    setSelectedColors={setVariantSelectedColors}
                    colorSizes={variantColorSizes}
                    setColorSizes={setVariantColorSizes}
                    variantStock={variantStockEdit}
                    setVariantStock={setVariantStockEdit}
                    colorImages={variantColorImagesEdit}
                    setColorImages={setVariantColorImagesEdit}
                  />
                  <div className="product-edit-actions">
                    <button
                      type="button"
                      className="table-action"
                      onClick={() => setManagingVariants(null)}
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      className="dark-btn"
                      onClick={saveVariants}
                    >
                      SAVE VARIANTS
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  if (tab === "ORDERS")
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>FULFILMENT</small>
            <h2>ORDER MANAGEMENT</h2>
          </div>
          <button className="outline-admin export-orders" onClick={action}>
            EXPORT ORDERS
          </button>
        </div>
        <div className="orders">
          <table>
            <thead>
              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>TOTAL</th>
                <th>UPDATE STATUS</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <b>{o.ref}</b>
                    </td>
                    <td>{o.customer}</td>
                    <td>{o.total}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      >
                        {[
                          "PENDING",
                          "CONFIRMED",
                          "PREPARING",
                          "SHIPPED",
                          "DELIVERED",
                          "CANCELLED",
                          "RETURNED",
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="table-action"
                        onClick={() => setViewOrder(o)}
                      >
                        VIEW →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {viewOrder && (
          <div
            className="order-modal-backdrop"
            onMouseDown={() => setViewOrder(null)}
          >
            <div
              className="order-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <div>
                  <small>ORDER DETAILS</small>
                  <h2>{viewOrder.ref}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setViewOrder(null)}
                  aria-label="Close order details"
                >
                  ×
                </button>
              </div>
              <p><b>CUSTOMER</b>{viewOrder.customer}</p>
              <p><b>EMAIL</b>{viewOrder.email}</p>
              <p><b>PHONE</b>{viewOrder.phone}</p>
              <p>
                <b>ADDRESS</b>
                {[viewOrder.address, viewOrder.area, viewOrder.governorate]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
              <p>
                <b>PAYMENT</b>
                {viewOrder.paymentMethod === "card"
                  ? "CREDIT / DEBIT CARD"
                  : "CASH ON DELIVERY"}
              </p>
              <hr />
              <div className="order-modal-items">
                <small>ITEMS ({viewOrder.items.length})</small>
                {viewOrder.items.map((item, i) => (
                  <div className="order-modal-item" key={i}>
                    <div>
                      <b>{item.name}</b>
                      <small>
                        {item.color.toUpperCase()} / {item.size} × {item.qty}
                      </small>
                    </div>
                    <span>
                      {(item.price * item.qty).toLocaleString("en-US")} EGP
                    </span>
                  </div>
                ))}
              </div>
              <hr />
              <p><b>SUBTOTAL</b>{viewOrder.subtotal.toLocaleString("en-US")} EGP</p>
              {viewOrder.discount > 0 && (
                <p><b>DISCOUNT</b>−{viewOrder.discount.toLocaleString("en-US")} EGP</p>
              )}
              <p><b>DELIVERY</b>{viewOrder.delivery.toLocaleString("en-US")} EGP</p>
              <p><b>TOTAL</b>{viewOrder.total}</p>
              <p><b>STATUS</b>{viewOrder.status}</p>
            </div>
          </div>
        )}
      </div>
    );
  if (tab === "CUSTOMERS")
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>COMMUNITY</small>
            <h2>CUSTOMER ACCOUNTS</h2>
          </div>
          <input
            className="admin-search"
            placeholder="SEARCH CUSTOMERS"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />
        </div>
        <div className="panel-cards">
          {filteredCustomers.length ? (
            filteredCustomers.map((c) => (
              <article key={c.email}>
                <i>
                  {c.name
                    .split(" ")
                    .filter(Boolean)
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </i>
                <h3>{c.name}</h3>
                <p>{c.email}</p>
                <button onClick={() => setViewCustomer(c)}>
                  {c.orderCount} ORDER{c.orderCount === 1 ? "" : "S"} →
                </button>
              </article>
            ))
          ) : (
            <p>No customers yet — they'll show up here once orders come in.</p>
          )}
        </div>
        {viewCustomer && (
          <div
            className="order-modal-backdrop"
            onMouseDown={() => setViewCustomer(null)}
          >
            <div
              className="order-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <div>
                  <small>CUSTOMER DETAILS</small>
                  <h2>{viewCustomer.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setViewCustomer(null)}
                  aria-label="Close customer details"
                >
                  ×
                </button>
              </div>
              <p><b>EMAIL</b>{viewCustomer.email}</p>
              <p><b>PHONE</b>{viewCustomer.phone}</p>
              <p><b>TOTAL ORDERS</b>{viewCustomer.orderCount}</p>
              <p><b>TOTAL SPENT</b>{viewCustomer.totalSpent.toLocaleString("en-US")} EGP</p>
              <div className="orders">
                <table>
                  <thead>
                    <tr>
                      <th>ORDER</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewCustomer.orders.map((o) => (
                      <tr key={o.id}>
                        <td>{o.ref}</td>
                        <td>
                          {new Date(o.createdAt).toLocaleDateString("en-US")}
                        </td>
                        <td>{o.total}</td>
                        <td>
                          <i>{o.status}</i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  if (tab === "COLLECTIONS")
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>MERCHANDISING</small>
            <h2>COLLECTIONS</h2>
          </div>
          <form className="new-collection-form" onSubmit={addCollection}>
            <input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="NEW COLLECTION NAME"
              required
            />
            <button className="dark-btn" type="submit">
              + ADD
            </button>
          </form>
        </div>
        <div className="panel-cards collections-admin">
          {collections.map((x, i) => (
            <article
              key={x.id ?? x.name}
              className={managedCollection === x.name ? "selected" : ""}
            >
              <small>0{i + 1}</small>
              {renamingCollection === x.name ? (
                <form
                  className="collection-rename-form"
                  onSubmit={saveRenameCollection}
                >
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    autoFocus
                    required
                  />
                  <div className="collection-card-actions">
                    <button type="submit">SAVE</button>
                    <button
                      type="button"
                      onClick={() => setRenamingCollection(null)}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{x.name}</h3>
                  <p>{[8, 12, 10, 6, 4][i] ?? 0} PRODUCTS</p>
                  {pendingDeleteCollection === x.name ? (
                    <div className="collection-card-actions">
                      <span>DELETE THIS COLLECTION?</span>
                      <button
                        className="danger"
                        aria-label={`Confirm delete ${x.name}`}
                        onClick={() => deleteCollection(x)}
                      >
                        CONFIRM
                      </button>
                      <button
                        onClick={() => setPendingDeleteCollection(null)}
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <div className="collection-card-actions">
                      <button
                        aria-label={`Rename ${x.name}`}
                        onClick={() => startRenameCollection(x)}
                      >
                        RENAME
                      </button>
                      <button
                        className="danger"
                        aria-label={`Delete ${x.name}`}
                        onClick={() => setPendingDeleteCollection(x.name)}
                      >
                        DELETE
                      </button>
                      <button onClick={() => setManagedCollection(x.name)}>
                        MANAGE →
                      </button>
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
        {managedCollection && (
          <section className="collection-manager">
            <div className="panel-toolbar">
              <div>
                <small>EDITING COLLECTION</small>
                <h2>{managedCollection}</h2>
              </div>
              <button
                className="outline-admin"
                onClick={() => setManagedCollection(null)}
              >
                CLOSE
              </button>
            </div>
            <div className="category-editor">
              <div>
                <small>PRODUCT CATEGORIES</small>
                <p>
                  Add or remove the categories available inside this collection.
                </p>
              </div>
              <form onSubmit={addCategory}>
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="NEW CATEGORY NAME"
                  required
                />
                <button type="submit">+ ADD CATEGORY</button>
              </form>
              <div className="category-list">
                {categories.map((category) => (
                  <div key={category.id ?? category.name}>
                    <span>{category.name}</span>
                    <button
                      aria-label={`Delete ${category.name}`}
                      onClick={async () => {
                        if (category.id)
                          await fetch(
                            `/api/catalog?type=category&id=${category.id}`,
                            { method: "DELETE" },
                          );
                        setCategories(categories.filter((x) => x !== category));
                        notify();
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
              <button className="dark-btn save-collection" onClick={action}>
                SAVE COLLECTION CHANGES
              </button>
            </div>
          </section>
        )}
      </div>
    );
  if (tab === "DISCOUNTS") {
    const formatDiscount = (type: string, value: string | null) =>
      type === "percent"
        ? `${Number(value)}%`
        : type === "amount"
          ? `${Number(value).toLocaleString("en-US")} EGP`
          : "FREE DELIVERY";
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>OFFERS</small>
            <h2>DISCOUNT CODES</h2>
          </div>
        </div>
        <div className="settings-card">
          <form onSubmit={addDiscountCode} className="form-two">
            <label>
              CODE
              <input
                value={newDiscountCode}
                onChange={(e) => setNewDiscountCode(e.target.value)}
                placeholder="E.G. CAIRO10"
                required
              />
            </label>
            <label>
              TYPE
              <select
                value={newDiscountType}
                onChange={(e) => setNewDiscountType(e.target.value)}
              >
                <option value="percent">PERCENT OFF</option>
                <option value="amount">FIXED AMOUNT OFF</option>
                <option value="free_shipping">FREE SHIPPING</option>
              </select>
            </label>
            {newDiscountType !== "free_shipping" && (
              <label>
                VALUE {newDiscountType === "percent" ? "(%)" : "(EGP)"}
                <input
                  type="number"
                  min="0"
                  value={newDiscountValue}
                  onChange={(e) => setNewDiscountValue(e.target.value)}
                  required
                />
              </label>
            )}
            <button type="submit" className="dark-btn">
              + CREATE CODE
            </button>
          </form>
        </div>
        <div className="orders">
          <table>
            <thead>
              <tr>
                <th>CODE</th>
                <th>DISCOUNT</th>
                <th>USES</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {discountCodesList.length ? (
                discountCodesList.map((code) => (
                  <tr key={code.id}>
                    <td>
                      <b>{code.code}</b>
                    </td>
                    <td>{formatDiscount(code.type, code.value)}</td>
                    <td>{code.uses}</td>
                    <td>
                      <i>{code.active ? "ACTIVE" : "INACTIVE"}</i>
                    </td>
                    <td>
                      <button
                        className="table-action"
                        onClick={() => toggleDiscountActive(code)}
                      >
                        {code.active ? "DEACTIVATE" : "ACTIVATE"}
                      </button>
                      <button
                        className="table-action danger"
                        onClick={() => deleteDiscountCode(code.id)}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No discount codes yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (tab === "CATEGORIES")
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>STORE CATALOG</small>
            <h2>PRODUCT CATEGORIES</h2>
          </div>
        </div>
        <div className="settings-card category-editor">
          <p>Add categories that can be selected when creating products.</p>
          <form onSubmit={addCategory}>
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="NEW CATEGORY NAME"
              required
            />
            <button type="submit" className="dark-btn">
              + ADD CATEGORY
            </button>
          </form>
          <div className="category-list">
            {categories.map((category) => (
              <div key={category.id ?? category.name}>
                <span>{category.name}</span>
                <button
                  type="button"
                  aria-label={`Delete ${category.name}`}
                  onClick={async () => {
                    if (category.id)
                      await fetch(
                        `/api/catalog?type=category&id=${category.id}`,
                        { method: "DELETE" },
                      );
                    setCategories(categories.filter((x) => x !== category));
                    notify();
                  }}
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  if (tab === "DELIVERY FEES")
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>SHIPPING SETTINGS</small>
            <h2>DELIVERY FEES</h2>
          </div>
        </div>
        <div className="settings-card category-editor">
          <p>Add a delivery fee for each governorate / city you deliver to.</p>
          <form onSubmit={addDeliveryFee}>
            <input
              value={newDeliveryCity}
              onChange={(e) => setNewDeliveryCity(e.target.value)}
              placeholder="GOVERNORATE / CITY"
              required
            />
            <input
              type="number"
              min="0"
              value={newDeliveryFee}
              onChange={(e) => setNewDeliveryFee(e.target.value)}
              placeholder="FEE (EGP)"
              required
            />
            <button type="submit" className="dark-btn">
              + ADD DELIVERY FEE
            </button>
          </form>
          <div className="category-list">
            {deliveryFees.map((item) => (
              <div key={item.city}>
                <span>{item.city}</span>
                <strong>{item.fee.toLocaleString("en-US")} EGP</strong>
                <button
                  type="button"
                  onClick={() =>
                    onDeliveryFeesChange((current) =>
                      current.filter((fee) => fee.city !== item.city),
                    )
                  }
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  if (tab === "HOMEPAGE")
    return (
      <div className="admin-panel">
        <div className="panel-toolbar">
          <div>
            <small>STOREFRONT</small>
            <h2>HOMEPAGE CONTENT</h2>
          </div>
          <button className="dark-btn" onClick={saveBackgroundImages}>
            SAVE CHANGES
          </button>
        </div>
        <div className="settings-card">
          <label>
            ANNOUNCEMENT BAR
            <input
              value={homepage.ticker[0]}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  ticker: [e.target.value, current.ticker[1], current.ticker[2]],
                }))
              }
            />
          </label>
          <label>
            TICKER MESSAGE 2
            <input
              value={homepage.ticker[1]}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  ticker: [current.ticker[0], e.target.value, current.ticker[2]],
                }))
              }
            />
          </label>
          <label>
            TICKER MESSAGE 3
            <input
              value={homepage.ticker[2]}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  ticker: [current.ticker[0], current.ticker[1], e.target.value],
                }))
              }
            />
          </label>
          <label>
            MARQUEE TEXT
            <input
              value={homepage.marquee}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  marquee: e.target.value,
                }))
              }
            />
          </label>
          <label>
            HERO EYEBROW
            <input
              value={homepage.eyebrow}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  eyebrow: e.target.value,
                }))
              }
            />
          </label>
          <label>
            HERO HEADLINE
            <input
              value={homepage.headline}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  headline: e.target.value,
                }))
              }
            />
          </label>
          <label>
            FEATURED COLLECTION
            <select>
              <option>NEW DROPS</option>
              <option>BEST SELLERS</option>
              <option>LIMITED EDITION</option>
            </select>
          </label>
          <h3>BACKGROUND IMAGES</h3>
          <label>
            HERO IMAGE URL
            <input
              value={homepage.image}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  image: e.target.value,
                }))
              }
            />
          </label>
          <label className="hero-upload">
            UPLOAD HERO IMAGE FROM PC
            <input
              type="file"
              accept="image/*"
              onChange={chooseImage("image")}
              disabled={uploadingField === "image"}
            />
            <span className="outline-admin">
              {uploadingField === "image" ? "UPLOADING..." : "CHOOSE IMAGE"}
            </span>
          </label>
          <button
            type="button"
            className="outline-admin"
            onClick={downloadHeroImage}
          >
            DOWNLOAD CURRENT IMAGE
          </button>
          <label>
            CAMPAIGN BANNER IMAGE URL
            <input
              value={homepage.campaignImage}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  campaignImage: e.target.value,
                }))
              }
            />
          </label>
          <label className="hero-upload">
            UPLOAD CAMPAIGN IMAGE FROM PC
            <input
              type="file"
              accept="image/*"
              onChange={chooseImage("campaignImage")}
              disabled={uploadingField === "campaignImage"}
            />
            <span className="outline-admin">
              {uploadingField === "campaignImage"
                ? "UPLOADING..."
                : "CHOOSE IMAGE"}
            </span>
          </label>
          <label>
            STORY SECTION IMAGE URL
            <input
              value={homepage.storyImage}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  storyImage: e.target.value,
                }))
              }
            />
          </label>
          <label className="hero-upload">
            UPLOAD STORY IMAGE FROM PC
            <input
              type="file"
              accept="image/*"
              onChange={chooseImage("storyImage")}
              disabled={uploadingField === "storyImage"}
            />
            <span className="outline-admin">
              {uploadingField === "storyImage"
                ? "UPLOADING..."
                : "CHOOSE IMAGE"}
            </span>
          </label>
          <label>
            ABOUT PAGE IMAGE URL
            <input
              value={homepage.aboutImage}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  aboutImage: e.target.value,
                }))
              }
            />
          </label>
          <label className="hero-upload">
            UPLOAD ABOUT IMAGE FROM PC
            <input
              type="file"
              accept="image/*"
              onChange={chooseImage("aboutImage")}
              disabled={uploadingField === "aboutImage"}
            />
            <span className="outline-admin">
              {uploadingField === "aboutImage"
                ? "UPLOADING..."
                : "CHOOSE IMAGE"}
            </span>
          </label>
        </div>
      </div>
    );
  return (
    <div className="admin-panel">
      <div className="panel-toolbar">
        <div>
          <small>STORE CONFIGURATION</small>
          <h2>SETTINGS</h2>
        </div>
        <button className="dark-btn" onClick={saveSocialSettings}>
          SAVE SETTINGS
        </button>
      </div>
      <div className="settings-card">
        <div className="form-two">
          <label>
            STORE NAME
            <input defaultValue="WESTERN" />
          </label>
          <label>
            CURRENCY
            <select>
              <option>EGP — EGYPTIAN POUND</option>
            </select>
          </label>
        </div>
        <label>
          SUPPORT EMAIL
          <input defaultValue="hello@western.com" />
        </label>
        <label>
          STORE LOCATION
          <input
            value={homepage.storeLocation}
            onChange={(e) =>
              onHomepageChange((current) => ({
                ...current,
                storeLocation: e.target.value,
              }))
            }
          />
        </label>
        <h3>SOCIAL LINKS</h3>
        <label>
          WHATSAPP NUMBER
          <input
            value={homepage.whatsappNumber}
            placeholder="e.g. 201000000026"
            onChange={(e) =>
              onHomepageChange((current) => ({
                ...current,
                whatsappNumber: e.target.value,
              }))
            }
          />
        </label>
        <label>
          INSTAGRAM URL
          <input
            value={homepage.instagramUrl}
            placeholder="https://instagram.com/yourstore"
            onChange={(e) =>
              onHomepageChange((current) => ({
                ...current,
                instagramUrl: e.target.value,
              }))
            }
          />
        </label>
        <label>
          TIKTOK URL
          <input
            value={homepage.tiktokUrl}
            placeholder="https://tiktok.com/@yourstore"
            onChange={(e) =>
              onHomepageChange((current) => ({
                ...current,
                tiktokUrl: e.target.value,
              }))
            }
          />
        </label>
        <label>
          FACEBOOK URL
          <input
            value={homepage.facebookUrl}
            placeholder="https://facebook.com/yourstore"
            onChange={(e) =>
              onHomepageChange((current) => ({
                ...current,
                facebookUrl: e.target.value,
              }))
            }
          />
        </label>
        <div className="form-two">
          <label>
            CAIRO DELIVERY FEE
            <input
              type="number"
              min="0"
              value={homepage.deliveryFee}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  deliveryFee: Number(e.target.value),
                }))
              }
            />
          </label>
          <label>
            FREE DELIVERY FROM
            <input
              type="number"
              min="0"
              value={homepage.freeDeliveryFrom}
              onChange={(e) =>
                onHomepageChange((current) => ({
                  ...current,
                  freeDeliveryFrom: Number(e.target.value),
                }))
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <section className="faq">
      <small>NEED TO KNOW</small>
      <h2>FAQ</h2>
      {[
        "HOW LONG DOES DELIVERY TAKE?",
        "CAN I EXCHANGE OR RETURN AN ITEM?",
        "HOW DO I FIND MY SIZE?",
        "WHAT PAYMENT METHODS DO YOU ACCEPT?",
      ].map((q, i) => (
        <details key={q}>
          <summary>
            {q}
            <span>+</span>
          </summary>
          <p>
            {i === 0
              ? "Cairo orders arrive in 2–3 working days; other governorates in 3–5."
              : i === 1
                ? "Yes. Request an exchange within 14 days, with the item unworn and tags attached."
                : i === 2
                  ? "Use the size guide on every product page, or message us for a fit check."
                  : "Cash on delivery and secure card payments are available across Egypt."}
          </p>
        </details>
      ))}
    </section>
  );
}
function Footer({
  go,
  homepage,
}: {
  go: (s: string) => void;
  homepage: HomepageContent;
}) {
  return (
    <footer>
      <div className="foot-brand-col">
        <div className="brand foot-brand">
          WESTERN
        </div>
        <p>
          STREETWEAR, BORN IN CAIRO.
          <br />
          MADE FOR EVERYWHERE.
        </p>
      </div>
      <div>
        <b>SHOP</b>
        {["NEW DROPS", "T-SHIRTS", "HOODIES", "CARGOS", "ACCESSORIES"].map(
          (x) => (
            <button key={x} onClick={() => go("shop")}>
              {x}
            </button>
          ),
        )}
      </div>
      <div>
        <b>HELP</b>
        {[
          "CONTACT US",
          "DELIVERY",
          "EXCHANGES & RETURNS",
          "SIZE GUIDE",
          "FAQ",
        ].map((x) => (
          <button key={x} onClick={() => go("about")}>
            {x}
          </button>
        ))}
      </div>
      <div>
        <b>FIND US</b>
        {homepage.instagramUrl && (
          <a href={homepage.instagramUrl} target="_blank" rel="noopener noreferrer">
            INSTAGRAM ↗
          </a>
        )}
        {homepage.tiktokUrl && (
          <a href={homepage.tiktokUrl} target="_blank" rel="noopener noreferrer">
            TIKTOK ↗
          </a>
        )}
        {homepage.facebookUrl && (
          <a href={homepage.facebookUrl} target="_blank" rel="noopener noreferrer">
            FACEBOOK ↗
          </a>
        )}
        {homepage.whatsappNumber && (
          <a
            href={`https://wa.me/${homepage.whatsappNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WHATSAPP ↗
          </a>
        )}
        <a href="mailto:hello@western.com">HELLO@WESTERN.COM</a>
        <p>
          {(() => {
            const parts = homepage.storeLocation.split(",").map((s) => s.trim());
            const country = parts.length > 1 ? parts.pop() : null;
            return (
              <>
                {parts.join(", ").toUpperCase()}
                {country && (
                  <>
                    <br />
                    {country.toUpperCase()}
                  </>
                )}
              </>
            );
          })()}
        </p>
      </div>
      <div className="copyright">
        <span>© 2026 WESTERN</span>
        <span>CAIRO — 30.0444° N, 31.2357° E</span>
      </div>
    </footer>
  );
}
