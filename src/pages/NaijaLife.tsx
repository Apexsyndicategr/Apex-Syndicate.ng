import React, { useState } from 'react';
import { Product, OwnerSettings } from '../types';
import {
  Globe,
  Plane,
  MapPin,
  Flame,
  Building2,
  Users,
  Laptop,
  Play,
  ArrowRight,
  Check,
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
  setActiveTab,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [showPlayWarningModal, setShowPlayWarningModal] = useState<boolean>(false);

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

  const resolvedGameUrl =
    settings?.naijaLifeGameUrl || product?.externalUrl || 'https://naijalife-rpg.vercel.app';

  return (
    <div className="space-y-20 pb-24">
      {/* ========================================================
          HERO BANNER & ABOVE-THE-FOLD PLAY EARLY ACCESS CTA
         ======================================================== */}
      <section className="pt-12 sm:pt-16 pb-12 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
              <span className="text-[#FF5500] font-semibold">Apex Syndicate Games</span>
              <span aria-hidden="true">·</span>
              <span>Early Access Web Demo</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.02]">
              NAIJA <span className="text-[#FF5500]">LIFE</span>
            </h1>

            <p className="text-base sm:text-xl font-semibold text-zinc-200 tracking-wide uppercase font-mono">
              The Open-World Nigeria Simulator &amp; Japa RPG
            </p>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Inspired by the viral <strong className="text-white font-semibold">Lagos Life</strong> phenomenon,{' '}
              <strong className="text-[#FF5500] font-semibold">Naija Life</strong> breaks past city borders to encompass all{' '}
              <strong className="text-white font-semibold">36 Nigerian States + FCT Abuja</strong>, plus complete{' '}
              <strong className="text-white font-semibold">International Travel (&ldquo;Japa&rdquo;)</strong> to the UK,
              Canada, US, and UAE.
            </p>

            {/* Above-the-Fold Play Early Access Button — Directly under intro copy */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowPlayWarningModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF5500] hover:bg-[#FF6E26] text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                title="Launch Naija Life Early Access Game"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Early Access</span>
              </button>

              <a
                href="#states-map-section"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#111114] hover:bg-[#17171c] text-zinc-200 font-semibold text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#FF5500]" />
                <span>Explore 36 States</span>
              </a>
            </div>

            <div className="text-xs font-mono text-zinc-500">
              Web Browser Alpha Build · PC Recommended · Mobile In Optimization
            </div>
          </div>

          {/* Hero Visual Preview Frame */}
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden bg-[#111114] border border-white/[0.08] relative group">
            <img
              src="/images/naija_life_hero.jpg"
              alt="Naija Life Open World Game Art"
              className="w-full h-auto aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/45 to-transparent pointer-events-none" />

            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#FF5500] font-mono text-xs font-semibold uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  <span>Nationwide Scale · 36 States + Global Diaspora</span>
                </div>
                <p className="text-white font-bold text-lg sm:text-2xl">
                  From Danfo Hustle to High-Tower Corporate Titans
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPlayWarningModal(true)}
                className="px-5 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play Web Build</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <a
              href="#specs-section"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/40 text-zinc-300 hover:text-white transition-colors"
            >
              <Laptop className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Platform Specs (PC · Mobile · Web)</span>
            </a>
            {setActiveTab && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111114] border border-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          GAME DEFINITION & NARRATIVE PILLARS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-[#FF5500] font-medium">Game Overview</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            What Is Naija Life?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            An open-world simulator built to capture the unfiltered pace, street economy, and ambition of modern Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 flex items-center justify-center text-[#FF5500]">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              From Viral &ldquo;Lagos Life&rdquo; to Nationwide Scale
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              When the viral <strong>Lagos Life</strong> concept caught fire online, players connected with its street realism: yellow Danfo minibuses, toll-gate hustle, and surviving unexpected grid outages.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              <strong>Naija Life</strong> expands that world nationwide. Instead of remaining locked inside a single city, you can travel, trade, invest, and build across all <strong>36 Nigerian States</strong> and <strong>FCT Abuja</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 flex items-center justify-center text-[#FF5500]">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              The &ldquo;Japa&rdquo; International Travel System
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              International airports across Lagos, Abuja, Enugu, and Kano operate as connected travel hubs. Navigate embassy interviews, secure work or study permits, and board flights to <strong>London, Toronto, Dubai, Houston, Atlanta, and Accra</strong>.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Earn in FX, track live exchange rates, send remittances back home, or return as a multinational investor.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 flex items-center justify-center text-[#FF5500]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Authentic Careers &amp; Social Ladders
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Start from the ground up: drive a Keke Napep or commercial Danfo, ship software from Yaba, act in Nollywood productions, produce Afrobeats records, or campaign for public office.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Manage mobile bank alerts, POS liquidity, real estate across Eko Atlantic and Maitama, and rising family expectations.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#111114] border border-white/[0.08] space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/25 flex items-center justify-center text-[#FF5500]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Cultural Fidelity, Dialects &amp; Street Humor
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Cities react with authentic detail: backyard generators humming during outages, late-night suya spots, Owambe weekend celebrations, and dialogue across Nigerian Pidgin, Yoruba, Igbo, and Hausa.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              No recycled western sandbox tropes—crafted directly around Nigerian resilience, humor, and ambition.
            </p>
          </div>
        </div>

        {/* Travel Hub Concept Frame */}
        <div className="rounded-2xl overflow-hidden bg-[#111114] border border-white/[0.08] relative">
          <img
            src="/images/naija_travel_hub.jpg"
            alt="Naija Life International Departure Lounge & 36 States Map"
            className="w-full h-auto aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/45 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-mono font-semibold text-[#FF5500] uppercase tracking-wider">
                In-Game Concept · International Departure Terminal
              </p>
              <h4 className="text-lg sm:text-2xl font-bold text-white">
                International Japa Flight Departure Gates &amp; Interstate Highways
              </h4>
            </div>
            <span className="text-xs font-mono text-zinc-300 shrink-0">
              Map Rework Planned for Full Release
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          INTERACTIVE 36 STATES & JAPA HUB EXPLORER
         ======================================================== */}
      <section
        id="states-map-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/[0.08] space-y-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-[#FF5500] font-medium">
              Territory Preview
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              All 36 States + Global Destinations
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Each region features distinct economic sectors, transit links, cultural voice lines, and local opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#111114] p-1 rounded-xl border border-white/[0.08]">
            {['ALL', 'SOUTH-WEST', 'SOUTH-EAST', 'SOUTH-SOUTH', 'NORTH-CENTRAL', 'NORTH-WEST', 'NORTH-EAST', 'JAPA'].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wide transition-colors cursor-pointer ${
                  selectedZone === z
                    ? 'bg-[#FF5500] text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {z === 'JAPA' ? 'International' : z}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {filteredRegions.map((region, rIdx) => (
            <div key={rIdx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <h3 className="text-sm font-mono font-bold text-[#FF5500] uppercase tracking-wider">
                  {region.zone}
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  {region.states.length} Locations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {region.states.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-[#FF5500]/40 transition-colors space-y-2.5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-base font-bold text-white">{st.name}</h4>
                      <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                        {st.capital}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#FF5500] font-medium">
                      {st.tag}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
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
          PLATFORM SPECIFICATIONS
         ======================================================== */}
      <section
        id="specs-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/[0.08] space-y-8"
      >
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-[#FF5500] font-medium">
            Technical Profile
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Specifications &amp; Rollout
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Playable today as an early-access web demo while full-production systems, map rework, and mobile optimizations remain underway.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Target Platforms', value: 'PC, Mobile & Web (Played on the web)' },
            { label: 'Graphics Engine', value: 'TBD' },
            { label: 'Multiplayer & RP', value: 'Naija RP Server Network' },
            { label: 'Commercial Pricing', value: 'TBD' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-xl bg-[#111114] border border-white/[0.08] space-y-1.5"
            >
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                {item.label}
              </div>
              <div className="text-base font-bold text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#111114] border border-white/[0.08] divide-y divide-white/[0.06] font-mono text-xs sm:text-sm">
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-zinc-400">Target Platforms</span>
            <span className="font-semibold text-[#FF5500]">
              PC, Mobile &amp; Web (Played directly in the web browser)
            </span>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-zinc-400">Graphics Engine</span>
            <span className="font-semibold text-white">TBD</span>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-zinc-400">Current Build Status</span>
            <span className="font-semibold text-white">
              Early Access Web Demo Out Now (Full Release Coming Soon)
            </span>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-zinc-400">Minimum System Requirements</span>
            <span className="font-semibold text-zinc-300">TBD (Desktop Browser Recommended)</span>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-zinc-400">Recommended System Requirements</span>
            <span className="font-semibold text-zinc-300">TBD (PC / Laptop Browser)</span>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-zinc-400">Full Production Roadmap</span>
            <span className="font-semibold text-zinc-300">
              Complete Map Design Rework &amp; Mobile Performance Pass Planned
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          BOTTOM EARLY ACCESS LAUNCH CARD
         ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#111114] border border-[#FF5500]/30 p-8 sm:p-10 text-center space-y-6">
          <div className="space-y-2 max-w-xl mx-auto">
            <div className="text-xs font-mono text-[#FF5500] font-semibold uppercase tracking-wider">
              Playable Browser Build
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Try Naija Life Early Access
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Targeted for PC, Mobile, and played directly on the web with a TBD graphics engine. Launch the current alpha build now or explore our full studio catalogue.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowPlayWarningModal(true)}
              className="px-6 py-3 rounded-lg bg-[#FF5500] hover:bg-[#FF6E26] text-black font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play Early Access</span>
            </button>

            {setActiveTab && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium text-sm border border-white/[0.08] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-[#FF5500]" />
                <span>Browse All Products</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Early Access Disclaimers & Game Launcher Modal */}
      <NaijaLifeWarningModal
        isOpen={showPlayWarningModal}
        onClose={() => setShowPlayWarningModal(false)}
        gameUrl={resolvedGameUrl}
      />
    </div>
  );
};
