export const categories = ["Keychains", "Medals", "Charms", "Small things"];

export const filters = ["All", ...categories];

export const defaultProducts = [
  {
    id: "momo-the-cat",
    name: "Momo the Cat",
    price: 250,
    category: "Keychains",
    badge: "NEW",
    accent: "pink",
    image: "",
    alt: "Hand-painted cat keychain with a tiny bell",
    edition: "Made to order",
    size: "6 cm tall",
    material: "Hand-sculpted clay, metal keyring",
    finish: "Hand-painted, gloss sealed",
    description:
      "A round little cat with a bell, a smug face, and absolutely no remorse about the things he has knocked off your desk.",
    details: ["Sculpted and painted by hand", "Sturdy split ring", "Ships in 3–5 days"],
  },
  {
    id: "sakura-spirit",
    name: "Sakura Spirit",
    price: 280,
    category: "Keychains",
    badge: "BESTSELLER",
    accent: "acid",
    image: "",
    alt: "Blossom spirit keychain with pink petals",
    edition: "Made to order",
    size: "5.5 cm tall",
    material: "Hand-sculpted clay, metal keyring",
    finish: "Hand-painted, gloss sealed",
    description:
      "A tiny spirit resting under a blossom branch. Every petal is painted one at a time, so no two ever land the same way.",
    details: ["Sculpted and painted by hand", "Sturdy split ring", "Ships in 3–5 days"],
  },
  {
    id: "chibi-knight",
    name: "Chibi Knight",
    price: 420,
    category: "Medals",
    badge: "1 OF 1",
    accent: "cream",
    image: "",
    alt: "Small knight medal with a sword and helmet",
    edition: "One-of-one",
    size: "7 cm tall",
    material: "Hand-sculpted clay, ribbon loop",
    finish: "Hand-painted, matte sealed",
    description:
      "A palm-sized knight with a chipped sword and a very serious helmet. He has never won a battle and has never once considered giving up.",
    details: ["One-of-one character", "Ribbon loop included", "Ships in 3–5 days"],
  },
  {
    id: "onigiri-buddy",
    name: "Onigiri Buddy",
    price: 180,
    category: "Charms",
    badge: "NEW",
    accent: "pink",
    image: "",
    alt: "Rice ball charm with a tiny painted face",
    edition: "Made to order",
    size: "4 cm",
    material: "Hand-sculpted clay, clasp",
    finish: "Hand-painted, gloss sealed",
    description:
      "Rice ball, tiny face, permanently unbothered. The most emotionally stable object you will ever clip to a bag.",
    details: ["Sculpted and painted by hand", "Lobster clasp", "Ships in 3–5 days"],
  },
  {
    id: "cloud-fox",
    name: "Cloud Fox",
    price: 300,
    category: "Keychains",
    badge: "LOW STOCK",
    accent: "acid",
    image: "",
    alt: "Leaping fox keychain with a cloud-shaped tail",
    edition: "Edition of 10",
    size: "6.5 cm wide",
    material: "Hand-sculpted clay, metal keyring",
    finish: "Hand-painted, gloss sealed",
    description:
      "A fox caught mid-leap, tail curled into a cloud. Suspended in the one second before gravity notices.",
    details: ["Sculpted and painted by hand", "Sturdy split ring", "Ships in 3–5 days"],
  },
  {
    id: "ramen-bowl",
    name: "Tiny Ramen Bowl",
    price: 220,
    category: "Small things",
    badge: "STUDIO FAVE",
    accent: "cream",
    image: "",
    alt: "Miniature ramen bowl charm with toppings",
    edition: "Made to order",
    size: "3.5 cm wide",
    material: "Hand-sculpted clay, clasp",
    finish: "Hand-painted, gloss sealed",
    description:
      "A miniature bowl of ramen you cannot eat. Deeply tragic, deeply adorable, weirdly satisfying to hold.",
    details: ["Every topping placed by hand", "Lobster clasp", "Ships in 3–5 days"],
  },
  {
    id: "ghost-pup",
    name: "Ghost Pup",
    price: 200,
    category: "Charms",
    badge: "",
    accent: "pink",
    image: "",
    alt: "Small ghost charm with floppy dog ears",
    edition: "Made to order",
    size: "4.5 cm tall",
    material: "Hand-sculpted clay, clasp",
    finish: "Hand-painted, glow sealed",
    description:
      "A small ghost with dog ears. He haunts your bag, not your house, and mostly just wants to be carried around.",
    details: ["Sculpted and painted by hand", "Lobster clasp", "Ships in 3–5 days"],
  },
  {
    id: "star-guardian",
    name: "Star Guardian Medal",
    price: 450,
    category: "Medals",
    badge: "NEW",
    accent: "acid",
    image: "",
    alt: "Star-shaped medal with a painted guardian face",
    edition: "Made to order",
    size: "8 cm across",
    material: "Hand-sculpted clay, ribbon loop",
    finish: "Hand-painted, gloss sealed",
    description:
      "A star-shaped medal for people who have, frankly, been through it. Award it to yourself. You have earned it.",
    details: ["One-of-one character", "Ribbon loop included", "Ships in 3–5 days"],
  },
];

// Kept for any code that still imports the old name.
export const products = defaultProducts;

export const journal = [
  {
    image: "/images/journal-01.jpg",
    category: "Care guide",
    title: "How to keep a tiny friend looking new",
    read: "3 min read",
  },
  {
    image: "/images/journal-02.jpg",
    category: "Studio notes",
    title: "From sketch to keyring: designing a character",
    read: "5 min read",
  },
  {
    image: "/images/journal-03.jpg",
    category: "Behind the scenes",
    title: "Packing forty keychains without losing your mind",
    read: "4 min read",
  },
];

export const reviews = [
  {
    quote:
      "The little knight now guards my keys. I have dropped them twice and he has not flinched once. Ten out of ten guardian.",
    name: "Nia R.",
    detail: "Collector, Brooklyn",
    accent: "acid",
  },
  {
    quote:
      "Bought one for my bag. Came back two weeks later for five more. My friends have started placing orders through me.",
    name: "Marcus L.",
    detail: "Collector, London",
    accent: "pink",
  },
  {
    quote:
      "The paintwork is absurdly clean for something this small. You can tell a real person sat there with a tiny brush.",
    name: "Sofia M.",
    detail: "Collector, Lisbon",
    accent: "paper",
  },
];
