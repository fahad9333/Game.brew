export const IMAGES = {
    logo: "/assets/images/logo.jpeg",
    pc: "/assets/images/pc.jpeg",
    racing: "/assets/images/racing.jpeg",
    ps5: "/assets/images/ps5.jpeg",
    pool: "/assets/images/pool.jpeg",
    ps5Rooms: "/assets/images/ps5-rooms.jpeg",
    skullPc: "/assets/images/skull-pc.jpeg",
};

export const SERVICE_IMAGES = {
    pc: IMAGES.ps5,
    ps5: IMAGES.pc,
    racing: IMAGES.racing,
    pool: IMAGES.pool,
};

export const TESTIMONIALS = [
    {
        name: "Arjun S.",
        role: "CS:GO Player",
        text: "Best gaming café in Belagavi, hands down. The PCs are insane and the vibe is pure cyberpunk.",
        rating: 5,
    },
    {
        name: "Priya K.",
        role: "Birthday party host",
        text: "Booked the whole café for my brother's 18th. Staff was amazing and the setup felt like a real esports event.",
        rating: 5,
    },
    {
        name: "Rohan M.",
        role: "Sim Racing enthusiast",
        text: "The force-feedback racing rigs are the real deal. Drove here from 40km away and it was worth it.",
        rating: 5,
    },
    {
        name: "Ayesha T.",
        role: "PS5 Regular",
        text: "Private PS5 rooms + cold coffee = perfect Saturday night. Mortal Kombat hits different here.",
        rating: 5,
    },
];

export const FEATURES = [
    { title: "10 Gaming PCs", desc: "RTX GPUs, 144Hz panels, mechanical keys.", icon: "monitor" },
    { title: "4 PS5 Rooms", desc: "Private, soundproofed, 4K TVs.", icon: "gamepad-2" },
    { title: "2 Sim Racers", desc: "Full-motion force feedback rigs.", icon: "car" },
    { title: "2 Pool Tables", desc: "American 8-ball under moody neon.", icon: "circle-dot" },
    { title: "Café & Drinks", desc: "Energy fuel to keep you in the game.", icon: "coffee" },
    { title: "Full Café Events", desc: "Book the whole place for parties.", icon: "party-popper" },
];
