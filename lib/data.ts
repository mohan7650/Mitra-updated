// ---- Onboarding: pet types --------------------------------------------

export type PetType = {
  id: string;
  label: string;
  emoji: string;
  ring: string; // tailwind bg for the emoji circle
  paw: string; // tailwind text colour for the paw label
};

export const petTypes: PetType[] = [
  { id: "dog", label: "Dog", emoji: "🐶", ring: "bg-forest-400/20", paw: "text-forest-600" },
  { id: "cat", label: "Cat", emoji: "🐱", ring: "bg-coral-400/20", paw: "text-coral-500" },
  { id: "bird", label: "Bird", emoji: "🦜", ring: "bg-sky-200/50", paw: "text-sky-600" },
  { id: "rabbit", label: "Rabbit", emoji: "🐰", ring: "bg-forest-400/15", paw: "text-forest-600" },
  { id: "small", label: "Small Pet", emoji: "🐹", ring: "bg-amber-500/20", paw: "text-amber-600" },
  { id: "reptile", label: "Reptile", emoji: "🐢", ring: "bg-forest-500/15", paw: "text-forest-500" },
];

// ---- Onboarding: pet-details select options ----------------------------

export const breedsBySpecies: Record<string, string[]> = {
  dog: [
    "Golden Retriever",
    "Labrador Retriever",
    "German Shepherd",
    "Shiba Inu",
    "Poodle",
    "Beagle",
    "Bulldog",
    "Other",
  ],
  cat: [
    "Domestic Shorthair",
    "Maine Coon",
    "Siamese",
    "Persian",
    "Bengal",
    "British Shorthair",
    "Ragdoll",
    "Other",
  ],
  bird: [
    "Budgerigar",
    "Cockatiel",
    "African Grey",
    "Macaw",
    "Canary",
    "Lovebird",
    "Cockatoo",
    "Other",
  ],
  rabbit: [
    "Holland Lop",
    "Netherland Dwarf",
    "Mini Rex",
    "Lionhead",
    "Flemish Giant",
    "Dutch",
    "Other",
  ],
  small: [
    "Hamster",
    "Guinea Pig",
    "Gerbil",
    "Chinchilla",
    "Ferret",
    "Mouse",
    "Other",
  ],
  reptile: [
    "Bearded Dragon",
    "Leopard Gecko",
    "Ball Python",
    "Corn Snake",
    "Red-Eared Slider",
    "Chameleon",
    "Other",
  ],
  other: ["Other"],
};

export const breeds = breedsBySpecies.dog;

export const sizes = [
  "Small (0 - 10 kg)",
  "Medium (10 - 20 kg)",
  "Large (20 - 40 kg)",
  "Giant (40 kg +)",
];

export const coatTypes = ["Short", "Medium", "Long", "Curly", "Hairless"];

export const coatColors = [
  { label: "Golden", swatch: "#C98A2B" },
  { label: "Black", swatch: "#2B2B2B" },
  { label: "White", swatch: "#EFE9DC" },
  { label: "Brown", swatch: "#7A4A28" },
  { label: "Grey", swatch: "#9AA0A6" },
];

// ---- Welcome: feature strip -------------------------------------------

export type Feature = { id: string; label: string; icon: string; tint: string };

export const features: Feature[] = [
  { id: "health", label: "Health\n& Care", icon: "heart-pulse", tint: "text-coral-500" },
  { id: "vets", label: "Find Vets", icon: "stethoscope", tint: "text-forest-500" },
  { id: "grooming", label: "Grooming", icon: "scissors", tint: "text-amber-500" },
  { id: "community", label: "Pet\nCommunity", icon: "users", tint: "text-sky-500" },
  { id: "shop", label: "Shop", icon: "shopping-bag", tint: "text-violet-500" },
  { id: "insurance", label: "Insurance", icon: "shield-check", tint: "text-teal-500" },
];

// ---- Home: stories ----------------------------------------------------

export type Story = {
  id: string;
  name: string;
  emoji: string;
  bg: string; // gradient behind the pet avatar
  online?: boolean;
};

export const stories: Story[] = [
  { id: "rocky", name: "Rocky", emoji: "🐶", bg: "from-amber-200 to-amber-100" },
  { id: "luna", name: "Luna", emoji: "🐕", bg: "from-orange-200 to-stone-200", online: true },
  { id: "milo", name: "Milo", emoji: "🐱", bg: "from-stone-200 to-amber-100", online: true },
  { id: "buddy", name: "Buddy", emoji: "🦊", bg: "from-amber-200 to-orange-100", online: true },
  { id: "coco", name: "Coco", emoji: "🐩", bg: "from-orange-200 to-amber-100", online: true },
  { id: "pip", name: "Pip", emoji: "🦜", bg: "from-lime-200 to-emerald-100", online: true },
];

// ---- Home: feed posts -------------------------------------------------

export type Post = {
  id: string;
  name: string;
  emoji: string;
  avatarBg: string;
  breed: string;
  location: string;
  time: string;
  caption: string;
  photoCount: number;
  photoBg: string; // gradient standing in for the post photo
  photoEmoji: string;
  scene: string; // short label for the placeholder photo
};

export const posts: Post[] = [
  {
    id: "rocky",
    name: "Rocky",
    emoji: "🐶",
    avatarBg: "from-amber-200 to-amber-100",
    breed: "Golden Retriever",
    location: "Chicago, USA",
    time: "2h ago",
    caption: "Beach day is the best day! 🐾🌊☀️",
    photoCount: 4,
    photoBg: "from-orange-300 via-amber-200 to-sky-200",
    photoEmoji: "🏖️",
    scene: "Golden hour at the shore",
  },
  {
    id: "luna",
    name: "Luna",
    emoji: "🐕",
    avatarBg: "from-orange-200 to-stone-200",
    breed: "Shiba Inu",
    location: "Toronto, Canada",
    time: "5h ago",
    caption: "Met a new friend today! Making memories 🐶💕",
    photoCount: 3,
    photoBg: "from-pink-200 via-rose-100 to-emerald-100",
    photoEmoji: "🌸",
    scene: "Cherry blossom park",
  },
  {
    id: "milo",
    name: "Milo",
    emoji: "🐱",
    avatarBg: "from-stone-200 to-amber-100",
    breed: "Maine Coon",
    location: "Austin, USA",
    time: "1d ago",
    caption: "Sunday naps hit different 😴💤",
    photoCount: 2,
    photoBg: "from-stone-300 via-amber-100 to-stone-100",
    photoEmoji: "😴",
    scene: "Cozy afternoon nap",
  },
];

// ====== PROFILE ========================================================

export const rocky = {
  name: "Rocky",
  breed: "Golden Retriever",
  age: "2 years",
  tags: [
    { label: "Friendly", tint: "bg-forest-400/15 text-forest-600" },
    { label: "Playful", tint: "bg-sky-100 text-sky-600" },
    { label: "Loves Swimming", tint: "bg-violet-100 text-violet-600" },
  ],
  location: "Chicago, IL",
  born: "Born on May 20, 2022",
  petId: "MIT-ROCKY-2022",
};

export const profileTabs = [
  "Overview",
  "About",
  "Health",
  "Records",
  "Moments",
  "Paw Pals",
];

export const highlights = [
  { id: "h1", emoji: "🎾", bg: "from-lime-200 to-emerald-100", video: true },
  { id: "h2", emoji: "🐶", bg: "from-amber-200 to-orange-100", video: false },
  { id: "h3", emoji: "🏊", bg: "from-sky-300 to-cyan-200", video: true },
  { id: "h4", emoji: "🌸", bg: "from-violet-200 to-purple-100", video: false },
];

export const profileStats = [
  { label: "Paw Moments", value: "28", icon: "image", tint: "bg-emerald-100 text-emerald-600" },
  { label: "Paw Pals", value: "12", icon: "users", tint: "bg-violet-100 text-violet-600" },
  { label: "Meetups", value: "6", icon: "calendar", tint: "bg-rose-100 text-rose-500" },
  { label: "Paw It Forward", value: "4", icon: "gift", tint: "bg-orange-100 text-orange-500" },
];

export const aboutRocky = [
  { k: "Breed", v: "Golden Retriever" },
  { k: "Gender", v: "Male ♂" },
  { k: "Weight", v: "68 lbs" },
  { k: "Color", v: "Golden" },
  { k: "Personality", v: "Friendly, Playful" },
  { k: "Favorite Activities", v: "Swimming, Fetch, Long Walks" },
  { k: "Favorite Treats", v: "Peanut Butter Biscuits" },
];

// ====== SHOP ===========================================================

export const shopCategoriesRail = [
  { id: "food", label: "Food", emoji: "🍖", bg: "bg-amber-100" },
  { id: "treats", label: "Treats", emoji: "🦴", bg: "bg-orange-100" },
  { id: "toys", label: "Toys", emoji: "🎾", bg: "bg-rose-100" },
  { id: "acc", label: "Accessories", emoji: "🔴", bg: "bg-red-100" },
  { id: "health", label: "Health &\nWellness", emoji: "🛡️", bg: "bg-violet-100" },
  { id: "groom", label: "Grooming", emoji: "🧴", bg: "bg-sky-100" },
  { id: "beds", label: "Beds &\nHome", emoji: "🏠", bg: "bg-emerald-100" },
];

export const shopCategories = [
  { id: "food", label: "Food", sub: "Dry, Wet & Raw food", emoji: "🥣", bg: "from-amber-100 to-orange-50" },
  { id: "treats", label: "Treats", sub: "Healthy & tasty treats", emoji: "🦴", bg: "from-orange-100 to-amber-50" },
  { id: "toys", label: "Toys", sub: "Fun & interactive toys", emoji: "🧸", bg: "from-rose-100 to-pink-50" },
  { id: "acc", label: "Accessories", sub: "Collars, leashes & more", emoji: "🔗", bg: "from-violet-100 to-purple-50" },
  { id: "health", label: "Health & Wellness", sub: "Vitamins, supplements & care", emoji: "💊", bg: "from-sky-100 to-blue-50" },
  { id: "groom", label: "Grooming", sub: "Shampoos, brushes & supplies", emoji: "🧴", bg: "from-emerald-100 to-teal-50" },
  { id: "beds", label: "Beds & Home", sub: "Beds, crates & travel gear", emoji: "🛏️", bg: "from-stone-100 to-amber-50" },
  { id: "clothing", label: "Clothing", sub: "Apparel for all seasons", emoji: "🧥", bg: "from-indigo-100 to-blue-50" },
];

export const topPicks = [
  { id: "p1", name: "Blue Buffalo Life Protection Dog Food", emoji: "🥡", bg: "from-blue-100 to-sky-50", rating: 4.8, price: "$59.99", badge: "Best Seller", badgeTint: "bg-coral-500/15 text-coral-500" },
  { id: "p2", name: "KONG Puppy Chew Toy", emoji: "🐘", bg: "from-sky-100 to-cyan-50", rating: 4.7, price: "$9.59", was: "$11.99", badge: "20% OFF", badgeTint: "bg-emerald-100 text-emerald-600" },
  { id: "p3", name: "Mitra Premium Dog Collar", emoji: "⚫", bg: "from-stone-200 to-stone-100", rating: 4.9, price: "$16.99", badge: "Best Seller", badgeTint: "bg-coral-500/15 text-coral-500" },
  { id: "p4", name: "Salmon Oil for Dogs", emoji: "🐟", bg: "from-amber-100 to-yellow-50", rating: 4.6, price: "$16.14", was: "$18.99", badge: "15% OFF", badgeTint: "bg-emerald-100 text-emerald-600" },
];

export const shopTrust = [
  { icon: "truck", title: "Free Shipping", sub: "on orders $49+", tint: "text-emerald-600" },
  { icon: "package", title: "Easy Returns", sub: "30-day returns", tint: "text-amber-600" },
  { icon: "shield-check", title: "Secure Payments", sub: "100% safe checkout", tint: "text-forest-600" },
  { icon: "heart", title: "Happy Pets", sub: "Loved by thousands", tint: "text-coral-500" },
];

// ====== CARE ===========================================================

export const careServices = [
  { id: "grooming", title: "Grooming", desc: "Find trusted groomers near you. Book with ease.", emoji: "🐩", icon: "scissors", bg: "from-violet-100 to-purple-50", badge: "bg-violet-100 text-violet-600" },
  { id: "vet", title: "Veterinary Care", desc: "Book vet appointments, find clinics & emergency care near you.", emoji: "🩺", icon: "stethoscope", bg: "from-sky-100 to-blue-50", badge: "bg-sky-100 text-sky-600" },
  { id: "walking", title: "Dog Walking", desc: "Find trusted walkers for happy & healthy walks.", emoji: "🦮", icon: "footprints", bg: "from-emerald-100 to-green-50", badge: "bg-emerald-100 text-emerald-600" },
  { id: "sitting", title: "Pet Care / Sitting", desc: "Caregivers, boarding & daycare for your pet's comfort.", emoji: "🏡", icon: "home", bg: "from-amber-100 to-orange-50", badge: "bg-amber-100 text-amber-600" },
  { id: "insurance", title: "Pet Insurance", desc: "Explore & compare pet insurance plans that protect.", emoji: "☂️", icon: "shield", bg: "from-indigo-100 to-blue-50", badge: "bg-indigo-100 text-indigo-600" },
  { id: "vaccinations", title: "Vaccinations", desc: "Track schedules, get reminders & store vaccination records.", emoji: "💉", icon: "syringe", bg: "from-rose-100 to-pink-50", badge: "bg-rose-100 text-rose-500" },
  { id: "wellness", title: "Pet Wellness", desc: "Preventive care, health checkups & wellness tips.", emoji: "🐕", icon: "heart-pulse", bg: "from-teal-100 to-emerald-50", badge: "bg-teal-100 text-teal-600" },
  { id: "safety", title: "Safety & Precautions", desc: "Foods to avoid, seasonal risks, travel safety, heat/cold care & more.", emoji: "🧰", icon: "alert-triangle", bg: "from-amber-100 to-yellow-50", badge: "bg-amber-100 text-amber-600" },
];

// ====== COMMUNITY ======================================================

export const communityShortcuts = [
  { id: "near", label: "Pets Near You", emoji: "📍", bg: "from-emerald-100 to-green-50" },
  { id: "discover", label: "Discover Paws", emoji: "✨", bg: "from-amber-100 to-orange-50" },
  { id: "packs", label: "Packs", emoji: "🐾", bg: "from-rose-100 to-pink-50" },
];

export const petsNearYou = [
  { id: "buddy", name: "Buddy", sex: "m", breed: "Labradoodle", age: "2y", dist: "0.6 mi", emoji: "🐶", bg: "from-amber-200 to-orange-100", tags: [{ t: "Playful", c: "bg-emerald-100 text-emerald-600" }, { t: "Friendly", c: "bg-violet-100 text-violet-600" }] },
  { id: "bailey", name: "Bailey", sex: "f", breed: "Corgi", age: "1y 6m", dist: "0.8 mi", emoji: "🦊", bg: "from-orange-200 to-amber-100", tags: [{ t: "Smart", c: "bg-amber-100 text-amber-600" }, { t: "Active", c: "bg-sky-100 text-sky-600" }] },
  { id: "luna", name: "Luna", sex: "f", breed: "Labrador", age: "3y", dist: "1.2 mi", emoji: "🐕‍🦺", bg: "from-stone-300 to-stone-200", tags: [{ t: "Calm", c: "bg-sky-100 text-sky-600" }, { t: "Loyal", c: "bg-violet-100 text-violet-600" }] },
  { id: "milo", name: "Milo", sex: "m", breed: "Aussie", age: "2y", dist: "1.5 mi", emoji: "🐕", bg: "from-amber-200 to-stone-200", tags: [{ t: "Energetic", c: "bg-amber-100 text-amber-600" }, { t: "Smart", c: "bg-sky-100 text-sky-600" }] },
];

export const connectionRequests = [
  { id: "cooper", name: "Cooper", sex: "m", breed: "Golden Retriever", age: "2y", mutual: "2 mutual friends", emoji: "🐶", bg: "from-amber-200 to-orange-100" },
  { id: "zoe", name: "Zoe", sex: "f", breed: "Border Collie", age: "2y", mutual: "3 mutual friends", emoji: "🐕‍🦺", bg: "from-stone-300 to-stone-100" },
  { id: "daisy", name: "Daisy", sex: "f", breed: "Bichon Frise", age: "1y", mutual: "1 mutual friend", emoji: "🐩", bg: "from-rose-100 to-pink-50" },
];

export const meetups = [
  { id: "playdate", title: "Dog Park Playdate", emoji: "🐾", date: "Sun, May 26 • 10:00 AM", place: "Humboldt Park, Chicago", bg: "from-lime-200 to-emerald-100", scene: "🐕🐕🐕", extra: "+12" },
  { id: "pawty", title: "Pawty Time", emoji: "🎂", date: "Sat • 4:00 PM", place: "Lincoln Park, Chicago", bg: "from-rose-200 to-pink-100", scene: "🎈🐶", extra: "+8" },
];
