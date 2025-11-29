
import { Category, Experience, Slot, Testimonial } from './types';

export const APP_NAME = 'ESCAPE';

export const INDIAN_CITIES = [
  'Delhi NCR',
  'Mumbai',
  'Pune',
  'Bangalore',
  'Hyderabad'
];

// Authentic neighborhoods for realism
const CITY_NEIGHBORHOODS: Record<string, string[]> = {
  'Delhi NCR': ['Hauz Khas', 'Connaught Place', 'Mehrauli', 'Vasant Kunj', 'Gurgaon', 'Noida', 'Saket', 'Chanakyapuri'],
  'Mumbai': ['Bandra West', 'Colaba', 'Juhu', 'Lower Parel', 'Versova', 'Powai', 'Fort', 'Andheri'],
  'Pune': ['Koregaon Park', 'Kalyani Nagar', 'Baner', 'Viman Nagar', 'Aundh'],
  'Bangalore': ['Indiranagar', 'Koramangala', 'Cubbon Park', 'Whitefield', 'JP Nagar', 'Church Street', 'Lavelle Road'],
  'Hyderabad': ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Charminar', 'Hitech City']
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ADVENTURE]: 'bg-orange-500 text-white',
  [Category.FOOD]: 'bg-yellow-400 text-midnight',
  [Category.ART]: 'bg-indigo-500 text-white',
  [Category.MUSIC]: 'bg-rose-500 text-white',
  [Category.WORKSHOP]: 'bg-teal-400 text-midnight',
  [Category.WELLNESS]: 'bg-emerald-300 text-midnight',
};

// --- DATA GENERATION HELPERS ---

const generateSlots = (basePrice: number): Slot[] => {
  const slots: Slot[] = [];
  const now = new Date();
  
  // Generate 4-6 slots over the next 2 weeks
  const numSlots = Math.floor(Math.random() * 3) + 4;

  for (let i = 1; i <= numSlots; i++) {
    const slotDate = new Date(now);
    // Spread slots out every 1-3 days
    slotDate.setDate(now.getDate() + (i * 2) + Math.floor(Math.random() * 2));
    
    // Set realistic evening times: 6:00 PM, 6:30 PM, 7:00 PM, 7:30 PM, 8:00 PM, 8:30 PM
    const hour = 18 + Math.floor(Math.random() * 3); 
    const minute = Math.random() > 0.5 ? 30 : 0;
    
    slotDate.setHours(hour, minute, 0, 0);

    const total = 10 + Math.floor(Math.random() * 10);
    const available = Math.floor(Math.random() * total);

    slots.push({
      id: `s${i}_${Date.now()}_${Math.random()}`,
      time: slotDate.toISOString(),
      seatsAvailable: available === 0 ? 0 : Math.max(2, available), 
      totalSeats: total,
      price: basePrice
    });
  }
  
  return slots;
};

interface EventTemplate {
  title: string;
  desc: string;
  img: string; // Unsplash Photo ID or Full URL
  host: string;
  hostAvatar: string;
  price: number;
}

// STRICT TEMPLATES: 6 Categories x 5 Events each
// UPDATED IMAGES TO BE HIGHLY RELEVANT
const TEMPLATES: Record<Category, EventTemplate[]> = {
  [Category.ADVENTURE]: [
    {
      title: "Night Kayaking",
      desc: "Paddle through calm waters under the moonlight.",
      img: "https://images.unsplash.com/photo-1624296560677-e3694c46b684", // EXACT URL PROVIDED
      host: "Aqua Trails",
      hostAvatar: "1500648767791-00dcc994a43e",
      price: 1800
    },
    {
      title: "Indoor Rock Climbing",
      desc: "Challenge yourself on bouldering walls for all levels.",
      img: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056", // EXACT URL PROVIDED
      host: "Climb Central",
      hostAvatar: "1531427186611-ecfd6d936c79",
      price: 1200
    },
    {
      title: "Midnight Cycling",
      desc: "Explore the city's iconic landmarks on an empty street ride.",
      img: "https://images.unsplash.com/photo-1632302494725-b05fe177eee4", 
      host: "Pedal Power",
      hostAvatar: "1527980965255-d3b416303d12",
      price: 800
    },
    {
      title: "Go-Karting Grand Prix",
      desc: "Race your friends on a professional karting track.",
      img: "https://images.unsplash.com/photo-1505570554449-69ce7d4fa36b", 
      host: "Speed Zone",
      hostAvatar: "1570295999919-56ceb5ecca61",
      price: 1500
    },
    {
      title: "Forest Ziplining",
      desc: "Fly through the canopy on a thrilling zipline course.",
      img: "https://plus.unsplash.com/premium_photo-1683133798886-86e6d9bc11dc", 
      host: "Sky High",
      hostAvatar: "1501196354995-cbb51c65aaea",
      price: 2000
    }
  ],
  [Category.FOOD]: [
    { 
        title: "Wine Tasting", 
        desc: "Sip on premium reds and whites paired with artisanal cheese.", 
        img: "https://images.unsplash.com/photo-1558670460-cad0c19b1840", // EXACT URL PROVIDED
        host: "Sommelier Vinay", 
        hostAvatar: "1583394838336-acd977736f90",
        price: 3500 
    },
    { 
        title: "Sushi Making Class", 
        desc: "Roll the perfect maki with fresh ingredients and expert guidance.", 
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80", 
        host: "Chef Kenji", 
        hostAvatar: "1581299894007-aaa50297cf16",
        price: 4000 
    },
    { 
        title: "Pizza Making Workshop", 
        desc: "Toss dough and bake authentic wood-fired pizzas from scratch.", 
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591", // EXACT URL PROVIDED
        host: "Luigi's Kitchen", 
        hostAvatar: "1583394293214-28ded15ee548",
        price: 2000 
    },
    {
        title: "Bar Hopping Crawl",
        desc: "Explore the city's best cocktail bars with a fun group.",
        img: "https://images.unsplash.com/photo-1597290282695-edc43d0e7129", // EXACT URL PROVIDED
        host: "Night Owl",
        hostAvatar: "1530268729831-4b0b9e170218",
        price: 2500
    },
    { 
        title: "Gourmet Dessert Tasting", 
        desc: "Indulge in a curated flight of handcrafted cakes and pastries.", 
        img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80", 
        host: "Sweet Tooth", 
        hostAvatar: "1507003211169-0a1dd7228f2d",
        price: 1500 
    }
  ],
  [Category.MUSIC]: [
    { 
        title: "Silent Disco", 
        desc: "Dance to your own beat with wireless headphones and 3 DJ channels.", 
        img: "https://images.unsplash.com/photo-1667355745772-8c6b7990d044", // EXACT URL PROVIDED
        host: "Quiet Clubbing", 
        hostAvatar: "1493224272065-c36956060c18",
        price: 1200 
    },
    { 
        title: "Karaoke Night", 
        desc: "Belt out your favorite anthems on stage. No judgement, just vibes.", 
        img: "https://images.unsplash.com/photo-1738156793840-e7ad46384761", // EXACT URL PROVIDED
        host: "Sing Along", 
        hostAvatar: "1516280440614-6697288d5d38",
        price: 1000 
    },
    { 
        title: "Bollywood Dance Class", 
        desc: "Learn high-energy choreography to trending Bollywood hits.", 
        img: "https://images.unsplash.com/photo-1619982998302-752bc70afcff", // EXACT URL PROVIDED
        host: "Dance Inc.", 
        hostAvatar: "1487412720507-e7ab37603c6f",
        price: 900 
    },
    { 
        title: "Live Indie Band", 
        desc: "Catch the city's best upcoming bands performing live.", 
        img: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc", // EXACT URL PROVIDED
        host: "Garage Gigs", 
        hostAvatar: "1522075469751-3a6694fb2f61",
        price: 800 
    },
    { 
        title: "DJ Night", 
        desc: "Spinning house, techno, and disco all night long.", 
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745", // EXACT URL PROVIDED
        host: "Club Vibe", 
        hostAvatar: "1566492031773-4fbc75279055",
        price: 1500 
    }
  ],
  [Category.ART]: [
    { 
        title: "Pottery Class", 
        desc: "Get your hands dirty and shape clay on the wheel.", 
        img: "https://images.unsplash.com/photo-1595351298020-038700609878", // EXACT URL PROVIDED
        host: "Studio Mitti", 
        hostAvatar: "1517404215738-15263e9f9178",
        price: 2500 
    },
    { 
        title: "Paint & Sip", 
        desc: "Follow along to create a masterpiece with wine in hand.", 
        img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80", 
        host: "Canvas Club", 
        hostAvatar: "1534528741775-53994a69daeb",
        price: 2000 
    },
    { 
        title: "Calligraphy Session", 
        desc: "Master the art of beautiful writing with ink and brush.", 
        img: "https://images.unsplash.com/photo-1597402173627-95df96e45536", // EXACT URL PROVIDED
        host: "Ink Flow", 
        hostAvatar: "1506794778202-cad84cf45f1d",
        price: 1500 
    },
    { 
        title: "Clay Sculpting", 
        desc: "Hand-build unique sculptures using air-dry clay.", 
        img: "https://images.unsplash.com/photo-1758522277740-8ed5be25d2b6", // EXACT URL PROVIDED
        host: "Sculpt Space", 
        hostAvatar: "1438761681033-6461ffad8d80",
        price: 1800 
    },
    {
        title: "Watercolor Workshop",
        desc: "Learn blending techniques to paint serene landscapes.",
        img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80", 
        host: "Color Splash",
        hostAvatar: "1544005313-94ddf0286df2",
        price: 1200
    }
  ],
  [Category.WELLNESS]: [
    { 
        title: "Puppy Yoga", 
        desc: "The cutest yoga session ever with playful puppies.", 
        img: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80", 
        host: "Paws & Pose", 
        hostAvatar: "1554151228-14d9def656ec",
        price: 2200 
    },
    { 
        title: "Meditation Circle", 
        desc: "Find your inner peace with a guided group meditation session.",
        img: "https://images.unsplash.com/photo-1559595500-e15296bdbb48", 
        host: "Mindful Souls", 
        hostAvatar: "1544005313-94ddf0286df2",
        price: 500 
    },
    {
        title: "Sound Healing",
        desc: "Immerse yourself in the healing vibrations of tibetan singing bowls.",
        img: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=800&q=80", // EXACT URL PROVIDED
        host: "Vibe Tribe",
        hostAvatar: "1517841905240-472988babdf9",
        price: 1200
    },
    {
        title: "Morning Nature Walk",
        desc: "Reconnect with nature on a guided trail walk at sunrise.",
        img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
        host: "Eco Treks",
        hostAvatar: "1438761681033-6461ffad8d80",
        price: 300
    },
    {
        title: "Stretch & Relax",
        desc: "A gentle flow class to release tension and improve flexibility.",
        img: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=800&q=80",
        host: "Flex Studio",
        hostAvatar: "1534528741775-53994a69daeb",
        price: 700
    }
  ],
  [Category.WORKSHOP]: [
    {
        title: "Watchmaking Basics",
        desc: "Learn the intricate mechanics of assembling a mechanical watch.",
        img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e", // Exact URL
        host: "Horology House",
        hostAvatar: "1507003211169-0a1dd7228f2d",
        price: 5000
    },
    {
        title: "Coffee Brewing",
        desc: "Master the art of the perfect pour-over and espresso shot.",
        img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        host: "Bean There",
        hostAvatar: "1583394293214-28ded15ee548",
        price: 1500
    },
    {
        title: "Candle Making",
        desc: "Create your own scented soy wax candles.",
        img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
        host: "Wick & Wax",
        hostAvatar: "1534528741775-53994a69daeb",
        price: 1200
    },
    {
        title: "Photography Basics",
        desc: "Learn manual mode and composition with a pro photographer.",
        img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
        host: "Shutterbug",
        hostAvatar: "1531427186611-ecfd6d936c79",
        price: 2000
    },
    {
        title: "Resin Crafting",
        desc: "Design and pour your own epoxy resin art pieces.",
        img: "https://images.unsplash.com/photo-1713097458865-34f9821d60f3", // Exact URL
        host: "Art Flow",
        hostAvatar: "1517404215738-15263e9f9178",
        price: 1800
    }
  ]
};

// --- VENUES ---
export const VENUES_BY_CATEGORY: Record<Category, string[]> = {
  [Category.ADVENTURE]: ["The Edge Climbing Gym", "Riverfront Kayak Center", "City Karting Track", "Forest Adventure Park", "Urban Trails"],
  [Category.FOOD]: ["The Tasting Room", "Luigi's Pizzeria", "Sakura Sushi Bar", "The Barrel House", "Sugar & Spice Patisserie"],
  [Category.ART]: ["Mitti Pottery Studio", "Canvas & Wine", "The Ink Spot", "Sculpt Atelier", "Creative Corner"],
  [Category.MUSIC]: ["The Silent Box", "Melody Karaoke Bar", "Rhythm Dance Floor", "The Basement Gig", "Club Neon"],
  [Category.WORKSHOP]: ["The Maker's Lab", "Brew & Bean", "Scent Studio", "Focus Photo School", "Craft Collective"],
  [Category.WELLNESS]: ["Zen Garden", "Sacred Sound Space", "Sunrise Yoga Deck", "Nature's Path", "Soul Sanctuary"]
};

// --- TESTIMONIALS ---
export const TESTIMONIALS: Testimonial[] = [
    { id: '1', name: 'Aarav M.', role: 'Explorer', quote: 'Found my new favorite hobby through the pottery workshop!', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
    { id: '2', name: 'Sneha P.', role: 'Foodie', quote: 'The blind wine tasting was an absolute blast. Highly recommend.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    { id: '3', name: 'Rohan K.', role: 'Musician', quote: 'Silent disco in Mumbai was a surreal experience. Loved it.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
];

const generateAllExperiences = (): Experience[] => {
  const experiences: Experience[] = [];
  
  INDIAN_CITIES.forEach(city => {
    Object.entries(TEMPLATES).forEach(([cat, templates]) => {
      templates.forEach((template, index) => {
        const id = `${city.replace(' ', '')}_${cat}_${index}`;
        
        // Pick a venue
        const venues = VENUES_BY_CATEGORY[cat as Category] || [];
        const venue = venues[index % venues.length] || "City Center";

        // Generate map link
        const mapsQuery = encodeURIComponent(`${venue} in ${city}`);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

        // Ensure image URL is valid (if it's an ID, convert it)
        let imageUrl = template.img;
        if (!imageUrl.startsWith('http')) {
           imageUrl = `https://images.unsplash.com/photo-${imageUrl}?auto=format&fit=crop&w=800&q=80`;
        }

        experiences.push({
          id,
          title: template.title,
          description: template.desc,
          hostName: template.host,
          hostAvatar: `https://images.unsplash.com/photo-${template.hostAvatar}?auto=format&fit=crop&w=100&q=80`,
          image: imageUrl,
          location: `${venue}, ${city}`,
          coordinates: { lat: 19.0760, lng: 72.8777 }, // Mock coordinates
          categories: [cat as Category],
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: 10 + Math.floor(Math.random() * 200),
          reviews: [
              { id: 'r1', userId: 'u1', userName: 'Ananya', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', rating: 5, comment: "Absolutely loved it! A must-try.", date: "2 days ago" }
          ],
          slots: generateSlots(template.price),
          isPopular: Math.random() > 0.7,
          isTrending: Math.random() > 0.8
        });
      });
    });
  });

  return experiences;
};

export const MOCK_EXPERIENCES = generateAllExperiences();
