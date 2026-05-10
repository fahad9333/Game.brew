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
        name: "Silent Wolf",
        role: "Google Review",
        text: "Amazing experience I’ve been to the gaming zone a few times since it started and let me tell u the vibes are perfecttt as soon as u enter u get a gaming vibe pool tables private ps5 gaming zones car simulator and especially the pc zone let me tell u the pc area is soo well set up the lights the vibes that u don’t know how the time passes would definitely recommend to anyone who wants to get the best first experience in a gaming zone",
        rating: 5,
    },
    {
        name: "Shradha Panalkar",
        role: "Google Review",
        text: "Great place to visit with friends, perfect for anyone who loves cafe vibes and gaming all in one spot, the setup is crazy and the cozy ambiance makes it even better.",
        rating: 5,
    },
    {
        name: "Ishan Poal",
        role: "Google Review",
        text: "Excellent arrangements, best ps5 games , good experience",
        rating: 5,
    },
    {
        name: "Vansh Kapurani",
        role: "Google Review",
        text: "Best place to visit with friends. Good atmosphere and vibe. No competition 🫡",
        rating: 5,
    },
    {
        name: "Suraaj Vhatkar",
        role: "Google Review",
        text: "Great place to visit with your friends. Highly Recommended.",
        rating: 5,
    },
    {
        name: "Swayam Patil",
        role: "Google Review",
        text: "Best gaming cafe in belgaum",
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

export const GAMES_MENU = {
    pc: [
        { name: "Valorant", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500" },
        { name: "CS Source", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=500" },
        { name: "CS GO", image: "https://images.unsplash.com/photo-1610041321420-a596dd148c90?auto=format&fit=crop&q=80&w=500" },
        { name: "CS 2", image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=500" },
        { name: "GTA 5", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=500" },
        { name: "Call of Duty MW", image: "https://images.unsplash.com/photo-1603484435881-817ab41d3151?auto=format&fit=crop&q=80&w=500" },
        { name: "League of Legends", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500" },
    ],
    ps5: [
        { name: "FIFA 26", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=500" },
        { name: "WWE 26", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=500" },
        { name: "Tekken 8", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=500" },
        { name: "Mortal Kombat 11", image: "https://images.unsplash.com/photo-1580234797602-22c37b4a6217?auto=format&fit=crop&q=80&w=500" },
        { name: "Cricket 24", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=500" },
        { name: "GTA 5", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=500" },
        { name: "Spider-Man 2", image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=500" },
        { name: "Spider-Man Miles Morales", image: "https://images.unsplash.com/photo-1608889476561-6242cb3ce893?auto=format&fit=crop&q=80&w=500" },
    ],
    racing: [
        { name: "Forza Horizon 5", image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=500" },
        { name: "Gran Turismo 7", image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&q=80&w=500" },
        { name: "Need for Speed", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=500" },
        { name: "Assetto Corsa", image: "https://images.unsplash.com/photo-1503370621402-bde17b4865bd?auto=format&fit=crop&q=80&w=500" },
    ],
    cafe: [
        { name: "Monster & Redbull", image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&q=80&w=500" },
        { name: "Cold Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500" },
        { name: "Momos", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=500" },
        { name: "Maggi", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=500" },
        { name: "Fries & many more", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=500" },
        { name: "Cold Milkshakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=500" },
    ],
    pool: [
        { name: "2 American V-leg Pool Tables", image: "https://images.unsplash.com/photo-1596700813958-fce07de3fc3c?auto=format&fit=crop&q=80&w=500" },
    ]
};
