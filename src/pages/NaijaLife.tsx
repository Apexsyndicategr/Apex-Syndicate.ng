import React, { useState } from 'react';
import { Product, OwnerSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Globe,
  Plane,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Car,
  Building2,
  Users,
  Compass,
  Laptop,
  Flame,
  ChevronRight,
  Lock,
  Tag,
  Radio,
  Share2,
  Layers,
  FileText,
  Play,
} from 'lucide-react';
import { NaijaLifeWarningModal } from '../components/NaijaLifeWarningModal';

interface NaijaLifeProps {
  product?: Product | null;
  settings?: OwnerSettings;
  openDownloadModal?: (product: Product) => void;
  setActiveTab?: (tab: string) => void;
}

export const NaijaLife: React.FC<NaijaLifeProps> = ({
  product,
  settings,
  openDownloadModal,
  setActiveTab,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [showPlayWarningModal, setShowPlayWarningModal] = useState<boolean>(false);

  // Nigerian Geopolitical Zones and Key States Teaser
  const stateRegions = [
    {
      zone: 'SOUTH-WEST',
      states: [
        { name: 'Lagos', capital: 'Ikeja', tag: 'Center of Excellence', lore: 'Eko Atlantic, Danfo gridlock, Lekki tech hub, Computer Village, Balogun market and buzzing nightlife.' },
        { name: 'Oyo', capital: 'Ibadan', tag: 'Pace Setter', lore: 'Ancient brown roofs, University of Ibadan, Bodija commerce, and rich Yoruba heritage.' },
        { name: 'Ogun', capital: 'Abeokuta', tag: 'Gateway State', lore: 'Olumo Rock fortress, manufacturing industrial zones, and major interstate expressways.' },
        { name: 'Osun', capital: 'Osogbo', tag: 'Land of Virtue', lore: 'Sacred Osun-Osogbo groves, ancient royal palaces, and vibrant cultural arts.' },
        { name: 'Ondo', capital: 'Akure', tag: 'Sunshine State', lore: 'Idanre hills, lush cocoa farming belts, and coastal bitumen reserves.' },
        { name: 'Ekiti', capital: 'Ado-Ekiti', tag: 'Land of Honour', lore: 'Ikogosi warm springs, scenic mountain valleys, and scholarly institutions.' },
      ],
    },
    {
      zone: 'SOUTH-EAST',
      states: [
        { name: 'Enugu', capital: 'Enugu', tag: 'Coal City', lore: 'Rolling Milken hills, relaxed modern nightlife, Independence Layout, and film studios.' },
        { name: 'Anambra', capital: 'Awka', tag: 'Light of the Nation', lore: 'Onitsha Main Market commercial empire, Nnewi auto-parts manufacturing, and billionaire villas.' },
        { name: 'Imo', capital: 'Owerri', tag: 'Eastern Heartland', lore: 'Luxury hotels, high-energy party culture, Douglas road commerce, and academic hubs.' },
        { name: 'Abia', capital: 'Umuahia', tag: 'God’s Own State', lore: 'Aba commercial manufacturing capital, leathercraft, and bustling Ariaria International Market.' },
        { name: 'Ebonyi', capital: 'Abakaliki', tag: 'Salt of the Nation', lore: 'Fertile rice valleys, salt lake reserves, and rapid modern infrastructure expansion.' },
      ],
    },
    {
      zone: 'SOUTH-SOUTH',
      states: [
        { name: 'Rivers', capital: 'Port Harcourt', tag: 'Treasure Base', lore: 'Garden City oil refineries, luxury GRA mansions, Trans-Amadi industrial grid, and creek waterways.' },
        { name: 'Delta', capital: 'Asaba', tag: 'The Big Heart', lore: 'Warri street hustle, Asaba Nollywood film sets, and expansive Niger River banks.' },
        { name: 'Edo', capital: 'Benin City', tag: 'Heart Beat of the Nation', lore: 'Historic Benin Kingdom royal palace, ancient bronze artworks, and vibrant Ring Road traffic.' },
        { name: 'Cross River', capital: 'Calabar', tag: 'The People’s Paradise', lore: 'Calabar Christmas Carnival, lush tropical rainforest reserves, and Tinapa resort.' },
        { name: 'Akwa Ibom', capital: 'Uyo', tag: 'Land of Promise', lore: 'World-class modern stadium, palm tree highways, clean city streets, and coastal fisheries.' },
        { name: 'Bayelsa', capital: 'Yenagoa', tag: 'Glory of All Lands', lore: 'Magnificent Niger Delta creeks, mangrove waterways, speedboats, and oil exploration.' },
      ],
    },
    {
      zone: 'NORTH-CENTRAL & FCT',
      states: [
        { name: 'FCT Abuja', capital: 'Abuja', tag: 'Center of Unity', lore: 'Aso Rock villa, Maitama mansions, National Assembly, wide expressways, and diplomatic corridors.' },
        { name: 'Plateau', capital: 'Jos', tag: 'Home of Peace & Tourism', lore: 'Crisp cold mountain weather, Shere hills, tin mining legacy, and scenic fruit orchards.' },
        { name: 'Kwara', capital: 'Ilorin', tag: 'State of Harmony', lore: 'Traditional pottery, Arabic scholarship, and strategic central transit connecting north and south.' },
        { name: 'Benue', capital: 'Makurdi', tag: 'Food Basket of the Nation', lore: 'Expansive River Benue, agricultural harvest barges, and vibrant cultural dances.' },
        { name: 'Niger', capital: 'Minna', tag: 'The Power State', lore: 'Kainji & Shiroro hydroelectric dams, sprawling savannah, and monumental rock formations.' },
        { name: 'Nasarawa', capital: 'Lafia', tag: 'Home of Solid Minerals', lore: 'Farin Ruwa waterfalls, gemstone mining quarries, and scenic rural hills.' },
        { name: 'Kogi', capital: 'Lokoja', tag: 'The Confluence State', lore: 'Historic confluence where the Niger and Benue rivers merge beneath Mount Patti.' },
      ],
    },
    {
      zone: 'NORTH-WEST',
      states: [
        { name: 'Kano', capital: 'Kano', tag: 'Center of Commerce', lore: 'Ancient Kurmi market, centuries-old city walls, majestic Durbar horse festivals, and textile trades.' },
        { name: 'Kaduna', capital: 'Kaduna', tag: 'Center of Learning', lore: 'Historic military academies, textile manufacturing heritage, and interstate train lines.' },
        { name: 'Sokoto', capital: 'Sokoto', tag: 'Seat of the Caliphate', lore: 'Sultanate palace, historic desert trading routes, and hand-crafted leather goods.' },
        { name: 'Katsina', capital: 'Katsina', tag: 'Home of Hospitality', lore: 'Ancient Gobarau Minaret, royal Emirate palaces, and cross-border commercial links.' },
        { name: 'Kebbi', capital: 'Birnin Kebbi', tag: 'Land of Equity', lore: 'Argungu international fishing festival, vast rice paddies, and historic river trade.' },
        { name: 'Jigawa', capital: 'Dutse', tag: 'The New World', lore: 'Granite rock outcrops, date palm plantations, and peaceful savannah horizons.' },
        { name: 'Zamfara', capital: 'Gusau', tag: 'Farming is Our Pride', lore: 'Rich gold mineral fields, grain storehouses, and traditional farming communities.' },
      ],
    },
    {
      zone: 'NORTH-EAST',
      states: [
        { name: 'Bauchi', capital: 'Bauchi', tag: 'Pearl of Tourism', lore: 'Yankari Game Reserve with warm springs, safari elephants, and ancient rock paintings.' },
        { name: 'Borno', capital: 'Maiduguri', tag: 'Home of Peace', lore: 'Lake Chad basin trade, historic Kanem-Borno empire heritage, and desert crossroad markets.' },
        { name: 'Adamawa', capital: 'Yola', tag: 'Land of Beauty', lore: 'Mandara mountain ranges, River Benue navigation, and pastoral cattle ranches.' },
        { name: 'Taraba', capital: 'Jalingo', tag: 'Nature’s Gift to the Nation', lore: 'Mambilla plateau tea estates, breathtaking high-altitude green peaks, and waterfalls.' },
        { name: 'Gombe', capital: 'Gombe', tag: 'Jewel in the Savannah', lore: 'Rapidly growing transit hub, limestone hills, and vibrant multi-ethnic trading markets.' },
        { name: 'Yobe', capital: 'Damaturu', tag: 'Pride of the Sahel', lore: 'Sahel desert dunes, ancient Dufuna canoe discovery site, and gum arabic harvesting.' },
      ],
    },
    {
      zone: 'INTERNATIONAL TRAVEL (JAPA)',
      states: [
        { name: 'London, United Kingdom', capital: 'London', tag: 'The UK Diaspora', lore: 'Peckham high street, Heathrow arrivals, FX pound conversions, and corporate tech/healthcare roles.' },
        { name: 'Toronto, Canada', capital: 'Toronto', tag: 'The Great White North', lore: 'Cold winter snow mechanics, international student permits, and thriving Canadian tech industry.' },
        { name: 'Dubai, UAE', capital: 'Dubai', tag: 'City of Gold', lore: 'Skyscraper penthouses, luxury desert quad biking, gold souks, and international business trading.' },
        { name: 'Atlanta & Houston, USA', capital: 'United States', tag: 'American Hustle', lore: 'Massive Nigerian-American communities, Afrobeat concerts, and cross-border remittance wiring.' },
        { name: 'Accra, Ghana', capital: 'Accra', tag: 'West Coast Escape', lore: 'Chale Wote street festivals, Labadi beach getaways, and Detty December cross-border road trips.' },
        { name: 'Johannesburg, South Africa', capital: 'Johannesburg', tag: 'Rainbow Metropolis', lore: 'Sandton financial district, pan-African music recording studios, and international airport hubs.' },
      ],
    },
  ];

  const filteredRegions =
    selectedZone === 'ALL'
      ? stateRegions
      : stateRegions.filter((r) => r.zone.includes(selectedZone));

  return (
    <div className="relative min-h-screen text-white select-none overflow-hidden pb-24">
      {/* Dynamic Background Nigerian Ambient Glow & Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute -top-40 left-1/3 w-[550px] h-[550px] bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* ========================================================
          HERO BANNER & TITLE SECTION
         ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20 text-center">
        {/* Top Status Capsule */}
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 font-mono text-xs sm:text-sm font-bold shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-xl mb-6 animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>OFFICIAL ANNOUNCEMENT • EVERYTHING COMING SOON</span>
        </div>

        {/* Massive Glowing Title */}
        <div className="space-y-4 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-[0.95] bg-gradient-to-r from-emerald-400 via-teal-200 via-amber-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(16,185,129,0.5)]">
            NAIJA LIFE
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-amber-300 tracking-wide uppercase font-mono">
            THE OPEN-WORLD NIGERIA SIMULATOR & JAPA RPG
          </p>

          <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed pt-2">
            Inspired by the viral <strong className="text-white font-bold">Lagos Life</strong> phenomenon, 
            <strong className="text-emerald-400 font-bold"> Naija Life</strong> breaks past city borders to encompass all 
            <strong className="text-amber-300 font-bold"> 36 Nigerian States + FCT Abuja</strong>, plus complete 
            <strong className="text-white font-bold"> International Travel ("Japa")</strong> to the UK, Canada, US, and UAE.
          </p>
        </div>

        {/* Hero Visual Preview Image */}
        <div className="mt-10 sm:mt-14 relative max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_20px_90px_rgba(16,185,129,0.3)] group">
          <img
            src="/images/naija_life_hero.jpg"
            alt="Naija Life Open World Game Art"
            className="w-full h-auto aspect-video object-cover transform scale-100 group-hover:scale-102 transition-transform duration-700 ease-out"
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Floating Hero Badges */}
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-none">
            <div className="text-left space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs sm:text-sm font-black uppercase">
                <Globe className="w-4 h-4" />
                <span>NATIONWIDE SCALE • 36 STATES + GLOBAL DIASPORA</span>
              </div>
              <p className="text-white font-extrabold text-base sm:text-2xl drop-shadow-md">
                From Danfo Hustle to High-Tower Corporate Titans
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowPlayWarningModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 hover:from-amber-300 hover:to-emerald-300 text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.7)] flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer btn-shimmer-sweep"
                title="Play Early Access Web Build"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>PLAY WEB BUILD</span>
              </button>
              <div className="px-4 py-2.5 rounded-2xl bg-black/80 border border-amber-500/60 text-amber-300 font-mono font-black text-xs uppercase tracking-wider backdrop-blur-xl shadow-xl flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span>STATUS: COMING SOON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Grid */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPlayWarningModal(true)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-sm sm:text-base font-mono uppercase tracking-wider shadow-[0_0_35px_rgba(16,185,129,0.7)] flex items-center gap-2.5 cursor-pointer btn-shimmer-sweep"
            title="Launch Naija Life Early Access Game"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>PLAY EARLY ACCESS (WEB BUILD)</span>
          </motion.button>

          <a
            href="#states-map-section"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm sm:text-base font-mono uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
          >
            <MapPin className="w-5 h-5 text-black" />
            <span>EXPLORE 36 STATES & JAPA HUB</span>
          </a>

          <a
            href="#specs-section"
            className="px-7 py-4 rounded-2xl bg-black/80 hover:bg-white/10 text-white border border-emerald-500/40 font-mono font-bold text-sm sm:text-base uppercase tracking-wider flex items-center gap-2.5 backdrop-blur-md transition-all cursor-pointer"
          >
            <Laptop className="w-5 h-5 text-emerald-400" />
            <span>PLATFORM SPECS (PC • MOBILE • WEB)</span>
          </a>

          {setActiveTab && (
            <button
              onClick={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/15 text-gray-300 font-mono text-sm uppercase tracking-wider border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>VIEW ALL PRODUCTS</span>
            </button>
          )}
        </div>
      </section>

      {/* ========================================================
          LONG DEFINITION & ABOUT SECTION
         ======================================================== */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-white/10">
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5" />
            <span>THE DEFINITIVE GAME DEFINITION & ABOUT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            WHAT IS NAIJA LIFE?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            A comprehensive overview of the upcoming open-world simulator built to capture the unfiltered soul, hustle, and ambition of Nigeria.
          </p>
        </div>

        {/* Narrative Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: The Evolution from Lagos Life */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-black/80 border border-emerald-500/40 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              FROM VIRAL "LAGOS LIFE" TO NATIONWIDE SCALE
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              When the viral <strong>Lagos Life</strong> game took the internet by storm, millions of players fell in love with its raw street realism: yellow Danfo minibuses yelling "Oshodi Underbridge!", dodging agberos at toll gates, and scrambling for fuel during grid power cuts.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              <strong>Naija Life</strong> is the official evolution. We took that beloved concept and broke open the map. Instead of remaining locked inside Lagos, players now have the freedom to travel, trade, build political dynasties, or escape across all <strong>36 Nigerian States</strong> and the <strong>Federal Capital Territory (Abuja)</strong>.
            </p>
          </div>

          {/* Card 2: The "Japa" International Travel System */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-black/80 border border-teal-500/40 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              THE "JAPA" INTERNATIONAL TRAVEL SYSTEM
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Leaving Nigeria or returning as a wealthy international investor is a cornerstone of modern culture. In <strong>Naija Life</strong>, international airports (Murtala Muhammed Lagos, Nnamdi Azikiwe Abuja, Akanu Ibiam Enugu, and Aminu Kano) are fully functional hubs.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Navigate visa embassy appointments, secure work/student permits, board international flights to <strong>London, Toronto, Dubai, Houston, Atlanta, and Accra</strong>. Earn in Foreign Exchange (FX), handle black market Bureau de Change (BDC) rates, send remittances home, or build multi-national trade conglomerates.
            </p>
          </div>

          {/* Card 3: Dynamic Street Hustle & Career Paths */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-black/80 border border-amber-500/40 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              AUTHENTIC NIGERIAN CAREERS & SOCIAL LADDERS
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Start from the ground up: hawk cold water in traffic, drive a Keke Napep or commercial Danfo, code remotely as a Yaba/Lekki tech bro, act in Nollywood blockbusters, become an Afrobeat music sensation, or rise to become a State Governor or Federal Senator with police convoys.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Experience the real-time bank alert economy: mobile transfers, POS operators, real estate speculation in Eko Atlantic and Maitama, and managing family expectations when your bank balance grows.
            </p>
          </div>

          {/* Card 4: Living Culture, Music & Humor */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-black/80 border border-orange-500/40 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              CULTURAL FIDELITY, DIALECTS & STREET HUMOR
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Every city pulses with authentic life: the roar of "I pass my neighbor" generators during national power outages, midnight Suya spots, Owambe Saturday parties with live Fuji and Juju music, street food joints (Amala, Boli, Asun), and hilarious banter in Nigerian Pidgin, Yoruba, Igbo, and Hausa.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              No generic western game tropes—this is a handcrafted, unapologetic tribute to Nigerian resilience, humor, fashion, and hustle, powered by cutting-edge next-gen rendering.
            </p>
          </div>
        </div>

        {/* Travel Hub Showcase Photo Card */}
        <div className="mt-10 sm:mt-12 rounded-3xl overflow-hidden border border-emerald-500/40 relative shadow-2xl">
          <img
            src="/images/naija_travel_hub.jpg"
            alt="Naija Life International Departure Lounge & 36 States Map"
            className="w-full h-auto aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div>
              <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                IN-GAME CONCEPT ART • INTERNATIONAL DEPARTURE TERMINAL
              </p>
              <h4 className="text-lg sm:text-2xl font-black text-white uppercase">
                International Japa Flight Departure Gates & State Highways
              </h4>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-black/80 border border-white/20 text-white font-mono text-xs font-bold uppercase backdrop-blur-md">
              COMING SOON
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          INTERACTIVE 36 STATES & JAPA HUB EXPLORER
         ======================================================== */}
      <section id="states-map-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-white/10">
        <div className="text-center space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>TERRITORY & GEOGRAPHY PREVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            ALL 36 STATES + GLOBAL DESTINATIONS
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Every region in Nigeria features distinct geography, economic activities, cultural voice lines, and unique challenges.
          </p>

          {/* Region Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {['ALL', 'SOUTH-WEST', 'SOUTH-EAST', 'SOUTH-SOUTH', 'NORTH-CENTRAL', 'NORTH-WEST', 'NORTH-EAST', 'JAPA'].map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedZone === z
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                {z === 'JAPA' ? '✈️ INTERNATIONAL' : z}
              </button>
            ))}
          </div>
        </div>

        {/* States Display Grid */}
        <div className="space-y-10">
          {filteredRegions.map((region, rIdx) => (
            <div key={rIdx} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-base sm:text-lg font-black font-mono text-amber-300 uppercase tracking-widest">
                  {region.zone} REGION
                </h3>
                <span className="text-xs font-mono text-gray-400">
                  ({region.states.length} Locations)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {region.states.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/50 transition-all space-y-3 relative overflow-hidden group shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-lg font-black text-white uppercase group-hover:text-emerald-300 transition-colors">
                          {st.name}
                        </h4>
                        <p className="text-xs font-mono text-emerald-400 font-semibold">
                          Capital: {st.capital}
                        </p>
                      </div>

                      <div className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>SOON</span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono text-gray-300 font-medium inline-block">
                      "{st.tag}"
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      {st.lore}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SPECIFICATIONS & "EVERYTHING COMING SOON" HUB
         ======================================================== */}
      <section id="specs-section" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-white/10">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            <span>PLATFORM SPECIFICATIONS & ROLLOUT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            SPECIFICATIONS & LAUNCH SCHEDULE
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
            All release dates, hardware specifications, and commercial pricing are in pre-production. Everything is currently Coming Soon.
          </p>
        </div>

        {/* Specs Table Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/30 text-center space-y-2 backdrop-blur-md">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              TARGET PLATFORMS
            </div>
            <p className="text-lg font-black text-white uppercase">
              PC • MOBILE • WEB (PLAYED ON THE WEB)
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              STATUS: COMING SOON
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-black/60 border border-teal-500/30 text-center space-y-2 backdrop-blur-md">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              GRAPHICS ENGINE
            </div>
            <p className="text-lg font-black text-white uppercase">
              TBD
            </p>
            <div className="pt-2 text-xs font-mono text-teal-400 font-bold uppercase">
              STATUS: COMING SOON
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-black/60 border border-amber-500/30 text-center space-y-2 backdrop-blur-md">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              MULTIPLAYER & RP
            </div>
            <p className="text-lg font-black text-white uppercase">
              NAIJA RP SERVER NETWORK
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400 font-bold uppercase">
              STATUS: COMING SOON
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-black/60 border border-red-500/30 text-center space-y-2 backdrop-blur-md">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              COMMERCIAL PRICING
            </div>
            <p className="text-lg font-black text-white uppercase">
              TBD (TO BE ANNOUNCED)
            </p>
            <div className="pt-2 text-xs font-mono text-red-400 font-bold uppercase">
              STATUS: COMING SOON
            </div>
          </div>
        </div>

        {/* Detailed Spec List */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 font-mono text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <span className="text-gray-400">Target Platforms:</span>
            <span className="font-bold text-emerald-400">PC, Mobile & Web (Played directly in the web browser)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <span className="text-gray-400">Graphics Engine:</span>
            <span className="font-bold text-teal-400">TBD</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <span className="text-gray-400">Release Date:</span>
            <span className="font-bold text-amber-300">COMING SOON (In Active Pre-Production)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <span className="text-gray-400">Minimum System Requirements:</span>
            <span className="font-bold text-white">COMING SOON / TBD</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <span className="text-gray-400">Recommended System Requirements:</span>
            <span className="font-bold text-white">COMING SOON / TBD</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <span className="text-gray-400">Playable Alpha / Beta Access:</span>
            <span className="font-bold text-emerald-400">COMING SOON / TBD</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-gray-400">Official Game Access & Downloads:</span>
            <span className="font-bold text-gray-400">COMING SOON (Web & Client Builds Pending Studio Release)</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          STUDIO ANNOUNCEMENT & ROLLOUT BANNER
         ======================================================== */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-black to-[#06120b] border-2 border-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.3)] space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            <Gamepad2 className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>APEX SYNDICATE OFFICIAL ANNOUNCEMENT</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              NAIJA LIFE • EVERYTHING COMING SOON
            </h3>
            <p className="text-sm sm:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
              Targeted for PC, Mobile, and played directly on the web. Graphics engine is currently TBD. Stay tuned to the Apex Syndicate official portal for upcoming dev logs, roadmap milestones, and playable web builds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowPlayWarningModal(true)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 hover:from-amber-300 hover:to-emerald-300 text-black font-mono text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all cursor-pointer flex items-center gap-2 btn-shimmer-sweep"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>PLAY EARLY ACCESS (WEB BUILD)</span>
            </button>
            {setActiveTab && (
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
              >
                RETURN TO LATEST UPDATES
              </button>
            )}
            {setActiveTab && (
              <button
                onClick={() => {
                  setActiveTab('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-mono text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
              >
                BROWSE ALL PRODUCTS
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Early Access Disclaimers & Game Launcher Modal */}
      <NaijaLifeWarningModal
        isOpen={showPlayWarningModal}
        onClose={() => setShowPlayWarningModal(false)}
        gameUrl={settings?.naijaLifeGameUrl || product?.externalUrl || 'https://naijalife.ai.studio/'}
      />
    </div>
  );
};
