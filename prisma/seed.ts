import {
  Gender,
  NoteType,
  PrismaClient,
} from '@prisma/client';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function guessGender(name: string): Gender {
  const n = name.toLowerCase();
  if (n.includes('man') || n.includes('male') || n.includes('sauvage') || n.includes('eros') || n.includes('explorer') || n.includes('azzaro')) {
    return Gender.MALE;
  }
  if (n.includes('woman') || n.includes('daisy') || n.includes('flora') || n.includes('feminine') || n.includes('chloè') || n.includes('bombshell') || n.includes('my way') || n.includes('libre') || n.includes('guidance')) {
    return Gender.FEMALE;
  }
  return Gender.UNISEX;
}

function parseVolumeToMl(volume: string): number {
  if (!volume) return 0;
  const matches = volume.match(/\d+/g);
  if (!matches) return 0;
  return matches.reduce((sum, val) => sum + parseInt(val, 10), 0);
}

function getNotesForCategory(category: string): string[] {
  const c = category.toLowerCase();
  if (c.includes('fresh')) {
    return ['Sitrus', 'Yalpiz', 'Dengiz notalari', 'Lavanda', 'Sadr daraxti', 'Oq mushk'];
  }
  if (c.includes('oriental')) {
    return ['Zafaron', 'Bergamot', 'Atirgul', 'Oud', 'Sandal daraxti', 'Vanil'];
  }
  if (c.includes('woody')) {
    return ['Kardamon', 'Greypfrut', 'Sadr daraxti', 'Vetiver', 'Sandal daraxti', 'Mushk'];
  }
  if (c.includes('floral')) {
    return ['Neroli', 'Shaftoli', 'Atirgul', 'Yasmin', 'Oq mushk', 'Vanil'];
  }
  return ['Sitrus', 'Gul notalari', 'Yog\'och notalari', 'Ziravorlar', 'Ambar', 'Mushk'];
}

const prisma = new PrismaClient();

const categoriesData = [
  {
    name: 'Oriental',
    slug: 'oriental',
    description: 'Issiq, ekzotik va shahvoniy sharqona iforlar.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
  },
  {
    name: 'Floral',
    slug: 'floral',
    description: 'Atirgul, yasmin va pion notalariga boy nafis gul iforlari.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800',
  },
  {
    name: 'Woody',
    slug: 'woody',
    description: 'Sadr, sandal va vetiver daraxtlari notalariga asoslangan olijanob iforlar.',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800',
  },
  {
    name: 'Fresh',
    slug: 'fresh',
    description: 'Yorqin, toza va tetiklashtiruvchi sitrus hamda dengiz iforlari.',
    image: 'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=800',
  },
  {
    name: 'Gift Set',
    slug: 'gift-set',
    description: 'Sovg\'a qilish uchun maxsus chiroyli qadoqlangan premium to\'plamlar.',
    image: '/images/products/placeholder.png',
  },
  {
    name: 'Probnik',
    slug: 'probnik',
    description: 'Turli iforlarni arzon narxda sinab ko\'rish uchun qulay mini namunalar.',
    image: '/images/products/placeholder.png',
  }
];

const productsData = [
  { name: "Mercedes Benz Man", price: 150000, oldPrice: 130000, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 15, rating: 4.7, description: "Mercedes Benz Man — zamonaviy erkak uchun yaratilgan elegant ifor. Yangi va yengil notalar bilan kundalik foydalanishga ideal.", image: "/images/products/placeholder.png" },
  { name: "JPG Le Male", price: 200000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "HIT", stock: 10, rating: 4.8, description: "Jean Paul Gaultier Le Male — ikonik erkakona ifor. Lavanda va vanil notalarining uyg'un kombinatsiyasi.", image: "/images/products/placeholder.png" },
  { name: "Louis Vuitton", price: 455000, oldPrice: 490000, volume: "10 ml", category: "Woody", badge: "LUX", stock: 6, rating: 4.9, description: "Louis Vuitton — fransuz luksining timsoli bo'lgan premium ifor. Noyob yog'och va sharq notalarining nafis aralashmasi.", image: "/images/products/placeholder.png" },
  { name: "Moscow 2", price: 180000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "YANGI", stock: 8, rating: 4.5, description: "Moscow 2 — sharqona va issiq notalar bilan boyitilgan kuchli ifor. Kechki tadbirlar uchun mukammal tanlov.", image: "/images/products/placeholder.png" },
  { name: "Imagination", price: 160000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "YANGI", stock: 12, rating: 4.4, description: "Imagination — erkin va ijodiy ruhni aks ettiruvchi yorqin ifor. Sitrus va gul notalarining uyg'un qo'shilmasi.", image: "/images/products/placeholder.png" },
  { name: "Analogy Dubai", price: 220000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "HIT", stock: 9, rating: 4.6, description: "Analogy Dubai — Dubai ilhomidan yaratilgan boy va hashamatli ifor. Ud va ambar notalarining kuchli kombinatsiyasi.", image: "/images/products/placeholder.png" },
  { name: "Valentino", price: 190000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "YANGI", stock: 11, rating: 4.5, description: "Valentino — italyan elegantligini aks ettiruvchi nafis ifor. Gul va meva notalarining romantik qo'shilmasi.", image: "/images/products/placeholder.png" },
  { name: "YSL Y", price: 200000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 14, rating: 4.7, description: "YSL Y — zamonaviy erkak uchun kuchli va o'ziga xos ifor. Alma va zanjabil notalarining jonli uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "TT Kirke", price: 1152000, oldPrice: 1408000, volume: "10 ml", category: "Woody", badge: "LUX", stock: 4, rating: 4.9, description: "TT Kirke — noyob va eksklyuziv premium ifor. Chuqur yog'och va sharq notalarining betakror kombinatsiyasi.", image: "/images/products/placeholder.png" },
  { name: "Escentric 02", price: 1856000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "LUX", stock: 3, rating: 4.8, description: "Escentric 02 — molekulyar parfyumeriyaning noyob namunasi. O'ziga xos va uzoq davom etuvchi ifor.", image: "/images/products/placeholder.png" },
  { name: "Probnik To'plam", price: 35000, oldPrice: null, volume: "50 ml", category: "Probnik", badge: "YANGI", stock: 50, rating: 4.3, description: "Umumiy probniklar to'plami — turli iforlarni sinab ko'rish imkoniyati. Sovg'a sifatida ham ideal.", image: "/images/products/placeholder.png" },
  { name: "Probnik Boadicea", price: 35000, oldPrice: null, volume: "50 ml", category: "Probnik", badge: "YANGI", stock: 30, rating: 4.4, description: "Boadicea brendining probnik to'plami. Premium iforlarni arzon narxda sinab ko'ring.", image: "/images/products/placeholder.png" },
  { name: "Probnik Chloè", price: 30000, oldPrice: null, volume: "30 ml", category: "Probnik", badge: "YANGI", stock: 40, rating: 4.5, description: "Chloè brendining probnik namunasi. Nafis va feminlik iforini sinab ko'ring.", image: "/images/products/placeholder.png" },
  { name: "Probnik Wood 20ml", price: 25000, oldPrice: null, volume: "20 ml", category: "Probnik", badge: "YANGI", stock: 45, rating: 4.3, description: "Yog'och notali iforlar probnik to'plami. Woody kategoriyasini arzon narxda tatib ko'ring.", image: "/images/products/placeholder.png" },
  { name: "Probnik Wood 30ml", price: 30000, oldPrice: null, volume: "30 ml", category: "Probnik", badge: "YANGI", stock: 35, rating: 4.3, description: "Yog'och notali iforlar katta probnik to'plami. Woody kategoriyasini to'liq his eting.", image: "/images/products/placeholder.png" },
  { name: "Probnik Mramor", price: 15000, oldPrice: null, volume: "10 ml", category: "Probnik", badge: "YANGI", stock: 60, rating: 4.2, description: "Mramor seriyasining mini probnik namunasi. Yangi iforni eng arzon narxda sinab ko'ring.", image: "/images/products/placeholder.png" },
  { name: "Probnik Leather", price: 25000, oldPrice: null, volume: "10 ml", category: "Probnik", badge: "YANGI", stock: 40, rating: 4.4, description: "Teri notali iforlar probnik namunasi. Kuchli va o'ziga xos Leather kategoriyasini his eting.", image: "/images/products/placeholder.png" },
  { name: "Probnik (Plastik, 10ml)", price: 5000, oldPrice: null, volume: "10 ml", category: "Probnik", badge: "YANGI", stock: 100, rating: 4.0, description: "Plastik qopqoqli probnik idishi. Iforingizni qulay tarzda olib yuring.", image: "/images/products/placeholder.png" },
  { name: "Probnik (Plastik, 5ml)", price: 3500, oldPrice: null, volume: "5 ml", category: "Probnik", badge: "YANGI", stock: 100, rating: 4.0, description: "Plastik qopqoqli mini probnik idishi. Sayohat uchun eng qulay variant.", image: "/images/products/placeholder.png" },
  { name: "Probnik (Metall, 10ml)", price: 6000, oldPrice: null, volume: "10 ml", category: "Probnik", badge: "YANGI", stock: 80, rating: 4.2, description: "Metall qopqoqli probnik idishi. Chiroyli va bardoshli dizayn.", image: "/images/products/placeholder.png" },
  { name: "Probnik (Metall, 5ml)", price: 4000, oldPrice: null, volume: "5 ml", category: "Probnik", badge: "YANGI", stock: 80, rating: 4.2, description: "Metall qopqoqli mini probnik idishi. Premium ko'rinish, qulay o'lcham.", image: "/images/products/placeholder.png" },
  { name: "Mancera Red Tobacco Intense", price: 200000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "HIT", stock: 8, rating: 4.8, description: "Mancera Red Tobacco Intense — tamaki va qizil meva notalarining kuchli uyg'unligi. Kechki tadbirlar uchun ideal ifor.", image: "/images/products/placeholder.png" },
  { name: "LV Symphony", price: 850000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "LUX", stock: 5, rating: 4.9, description: "Louis Vuitton Symphony — murakkab gul notalarining simfoniyasi. Eksklyuziv va unutilmas ifor.", image: "/images/products/placeholder.png" },
  { name: "MJ Daisy So Fresh", price: 135000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "HIT", stock: 18, rating: 4.6, description: "Marc Jacobs Daisy So Fresh — bahorgi gul notalarining yengil va yangi ifori. Kundalik foydalanish uchun mukammal.", image: "/images/products/placeholder.png" },
  { name: "Versace Dylan Purple", price: 155000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "HIT", stock: 14, rating: 4.6, description: "Versace Dylan Purple — binafsha va tropik meva notalarining yorqin kombinatsiyasi. Hayajonli va zamonaviy ifor.", image: "/images/products/placeholder.png" },
  { name: "Gucci Flora Intense", price: 250000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "PREMIUM", stock: 9, rating: 4.7, description: "Gucci Flora Intense — gul notalarining to'q va boyitilgan versiyasi. Italyan elegantligining timsoli.", image: "/images/products/placeholder.png" },
  { name: "Giorgio Armani My Way", price: 200000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "PREMIUM", stock: 11, rating: 4.7, description: "Giorgio Armani My Way — sayohat ilhomidan yaratilgan ozod va nafis ifor. Bergamot va yasmin notalarining uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "VS Bombshell", price: 200000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "HIT", stock: 13, rating: 4.6, description: "Victoria's Secret Bombshell — tropik meva va gul notalarining portlovchi kombinatsiyasi. Quvnoq va hayajonli ifor.", image: "/images/products/placeholder.png" },
  { name: "Chloè Cedrus", price: 300000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "PREMIUM", stock: 7, rating: 4.7, description: "Chloè Cedrus — sadr daraxti va yog'och notalarining nafis uyg'unligi. Tabiatdan ilhomlanib yaratilgan ifor.", image: "/images/products/placeholder.png" },
  { name: "Xerjoff Erba Pura", price: 300000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "LUX", stock: 6, rating: 4.8, description: "Xerjoff Erba Pura — italyan parfyumeriyasining eng noyob namunalaridan biri. Vanil va musk notalarining boylik ifori.", image: "/images/products/placeholder.png" },
  { name: "Marc-Antoine Barrois", price: 350000, oldPrice: 450000, volume: "10 ml", category: "Woody", badge: "SALE", stock: 5, rating: 4.8, description: "Marc-Antoine Barrois — fransuz haute couture ruhidagi eksklyuziv ifor. Chuqur va murakkab notalar uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "Creed Silver Mountain", price: 400000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "LUX", stock: 7, rating: 4.9, description: "Creed Silver Mountain Water — tog' chashmasining toza va kristall ifori. Sporty va elegant erkaklar uchun.", image: "/images/products/placeholder.png" },
  { name: "PDM Haltane & Greenlay", price: 300000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "PREMIUM", stock: 6, rating: 4.7, description: "Parfums de Marly Haltane & Greenlay — yog'och va yashil notalarining aristokratik uyg'unligi. Klassik va zamonaviy.", image: "/images/products/placeholder.png" },
  { name: "TK Star Chaser", price: 250000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "HIT", stock: 9, rating: 4.6, description: "TK Star Chaser — yulduzlardan ilhomlanib yaratilgan mistik va chuqur ifor. Kechqi osmondek cheksiz nafosati bor.", image: "/images/products/placeholder.png" },
  { name: "Chrome Azzaro", price: 135000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 20, rating: 4.5, description: "Azzaro Chrome — klassik erkakona ifor. Toza va yangi notalar bilan har kuni yangi his eting.", image: "/images/products/placeholder.png" },
  { name: "Gucci Guilty Essence", price: 200000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "HIT", stock: 12, rating: 4.6, description: "Gucci Guilty Essence — aybdorlik his-tuyg'usini aks ettiruvchi kuchli va o'ziga jalb etuvchi ifor.", image: "/images/products/placeholder.png" },
  { name: "Bvlgari Omnia", price: 200000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "PREMIUM", stock: 10, rating: 4.6, description: "Bvlgari Omnia — italyan zargarligidan ilhomlanib yaratilgan issiq va ziyofatli ifor. Kakao va yog'och notalar.", image: "/images/products/placeholder.png" },
  { name: "YSL Libre", price: 200000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "HIT", stock: 15, rating: 4.7, description: "Yves Saint Laurent Libre — ozodlik va kuchni aks ettiruvchi zamonaviy ayol ifori. Lavanda va vanil uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "Jaguar Classic", price: 100000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "YANGI", stock: 22, rating: 4.3, description: "Jaguar Classic — sport avtomobil ruhidagi toza va kuchli erkakona ifor. Kundalik foydalanish uchun qulay.", image: "/images/products/placeholder.png" },
  { name: "Victoria's Secret Set", price: 704000, oldPrice: null, volume: "100+100+75 ml", category: "Gift Set", badge: "HIT", stock: 8, rating: 4.7, description: "Victoria's Secret sovg'a to'plami — uchta premium mahsulot bir qutida. Sevganingizga eng yaxshi sovg'a.", image: "/images/products/placeholder.png" },
  { name: "VS Hair & Body Mist", price: 320000, oldPrice: null, volume: "236 ml", category: "Floral", badge: "YANGI", stock: 12, rating: 4.5, description: "Victoria's Secret Hair & Body Mist — soch va tana uchun engil va xushbo'y spray. Butun kun davomida yangi his.", image: "/images/products/placeholder.png" },
  { name: "VS Peach Lotion", price: 320000, oldPrice: null, volume: "236 ml", category: "Floral", badge: "YANGI", stock: 10, rating: 4.5, description: "Victoria's Secret Peach Lotion — shaftoli notali yumshatuvchi tana losyoni. Nafis ifor va yumshoq teri.", image: "/images/products/placeholder.png" },
  { name: "VS Spray", price: 250000, oldPrice: null, volume: "250 ml", category: "Floral", badge: "YANGI", stock: 14, rating: 4.4, description: "Victoria's Secret Body Spray — engil va xushbo'y tana spreyi. Har kuni yangilanib turing.", image: "/images/products/placeholder.png" },
  { name: "VS Body Lotion", price: 250000, oldPrice: null, volume: "236 ml", category: "Floral", badge: "YANGI", stock: 11, rating: 4.4, description: "Victoria's Secret Body Lotion — namlovchi va xushbo'y tana losyoni. Yumshoq va ipakdek teri uchun.", image: "/images/products/placeholder.png" },
  { name: "212 MTV", price: 200000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 16, rating: 4.6, description: "Carolina Herrera 212 MTV — Nyu-York shahrining energiyasidan ilhomlanib yaratilgan ifor. Yosh va zamonaviy ruh.", image: "/images/products/placeholder.png" },
  { name: "Dior Sauvage", price: 200000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 20, rating: 4.9, description: "Dior Sauvage — yovvoyi tabiatning kuchini aks ettiruvchi mashhur erkakona ifor. Biber va ambroxan notalar.", image: "/images/products/placeholder.png" },
  { name: "Versace Eros", price: 135000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "HIT", stock: 18, rating: 4.7, description: "Versace Eros — yunoncha sevgi xudosidan ilhomlanib yaratilgan kuchli va jo'shqin ifor. Yashil olma va vanil.", image: "/images/products/placeholder.png" },
  { name: "VS Bombshell Bouquet", price: 250000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "PREMIUM", stock: 9, rating: 4.6, description: "Victoria's Secret Bombshell Bouquet — gul bouquetidan ilhomlanib yaratilgan nozik va romantik ifor.", image: "/images/products/placeholder.png" },
  { name: "Acqua Di Parma Colonia Club", price: 250000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "PREMIUM", stock: 7, rating: 4.7, description: "Acqua Di Parma Colonia Club — italyan dolce vita ruhidagi yangi va yorqin ifor. Sitrus va dengiz notalar.", image: "/images/products/placeholder.png" },
  { name: "Clive Christian Iconic Feminine", price: 1250000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "LUX", stock: 3, rating: 5.0, description: "Clive Christian Iconic Feminine — dunyodagi eng qimmat iforlardan biri. Mutlaq feminlik va hashamatning timsoli.", image: "/images/products/placeholder.png" },
  { name: "Amouage Guidance", price: 450000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "LUX", stock: 5, rating: 4.9, description: "Amouage Guidance — Ummondan ilhomlanib yaratilgan boy va chuqur ifor. Ud va atirgul notalarining shahona uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "Calvin Klein Woman", price: 100000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "YANGI", stock: 20, rating: 4.4, description: "Calvin Klein Woman — zamonaviy ayol uchun yaratilgan ozod va o'ziga xos ifor. Lavanda va yog'och notalar.", image: "/images/products/placeholder.png" },
  { name: "D&G Light Blue", price: 150000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 18, rating: 4.7, description: "Dolce & Gabbana Light Blue — O'rta dengiz ilhomidan yaratilgan yozgi ifor. Limon va bambuk notalarining yangiligi.", image: "/images/products/placeholder.png" },
  { name: "D&G K King", price: 150000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "HIT", stock: 15, rating: 4.6, description: "Dolce & Gabbana K King — shohlik va kuchni aks ettiruvchi erkakona ifor. Vetiver va yog'och notalarining uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "Terre Hermes Eau Givree", price: 160000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "PREMIUM", stock: 10, rating: 4.7, description: "Hermès Terre d'Hermès Eau Givrée — yer va muzning sovuq va issiq notalarining betakror uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "Lacoste Blanc", price: 160000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "YANGI", stock: 14, rating: 4.5, description: "Lacoste Blanc — oqlik va soflikning ramzi bo'lgan yangi va engillikni his ettiruvchi ifor.", image: "/images/products/placeholder.png" },
  { name: "Versace Dylan Blue", price: 135000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 17, rating: 4.6, description: "Versace Dylan Blue — ko'k dengiz ruhidagi yangi va kuchli erkakona ifor. Greypfrut va incir bargi notalar.", image: "/images/products/placeholder.png" },
  { name: "Tom Ford Ombre Leather", price: 300000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "PREMIUM", stock: 8, rating: 4.8, description: "Tom Ford Ombre Leather — teri va yog'och notalarining quyosh botishi kabi issiq uyg'unligi. Zamonaviy klassika.", image: "/images/products/placeholder.png" },
  { name: "Mont Blanc Explorer", price: 150000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "HIT", stock: 16, rating: 4.6, description: "Mont Blanc Explorer — dunyo sayohatchisidan ilhomlanib yaratilgan ifor. Vetiver va ambroksanin notalar.", image: "/images/products/placeholder.png" },
  { name: "Creed Imperial Millesime", price: 500000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "LUX", stock: 4, rating: 4.9, description: "Creed Imperial Millesime — qirol saroylaridan ilhomlanib yaratilgan eksklyuziv ifor. Bergamot va shaftoli notalar.", image: "/images/products/placeholder.png" },
  { name: "Memo Marfa", price: 250000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "PREMIUM", stock: 6, rating: 4.7, description: "Memo Marfa — Amerika cho'li ilhomidan yaratilgan kuchli va o'ziga xos ifor. Kaktus va teri notalarining betakror uyg'unligi.", image: "/images/products/placeholder.png" },
  { name: "Hormone Paris GABA", price: 280000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "YANGI", stock: 7, rating: 4.6, description: "Hormone Paris GABA — neyromediator ilhomidan yaratilgan ilmiy parfyumeriya. Relaksatsiya va qulaylik ifori.", image: "/images/products/placeholder.png" },
  { name: "Versace Eau Fraiche Extreme", price: 165000, oldPrice: null, volume: "10 ml", category: "Fresh", badge: "HIT", stock: 13, rating: 4.5, description: "Versace Eau Fraiche Extreme — intensiv yangilanish va salqinlik ifori. Yoz kunlari uchun ideal tanlov.", image: "/images/products/placeholder.png" },
  { name: "Ormonde Jayne Osmanthus", price: 365000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "LUX", stock: 5, rating: 4.8, description: "Ormonde Jayne Osmanthus — osmantus guli notalarining nozik va noyob ifori. Britaniya parfyumeriyasining eng yaxshi namunasi.", image: "/images/products/placeholder.png" },
  { name: "Ormonde Jayne Montabaco Intensivo", price: 400000, oldPrice: null, volume: "10 ml", category: "Woody", badge: "LUX", stock: 4, rating: 4.8, description: "Ormonde Jayne Montabaco Intensivo — tamaki va yog'och notalarining intensiv va chuqur kombinatsiyasi. Kuchli va yodda qolarli ifor.", image: "/images/products/placeholder.png" },
  { name: "Guerlain Neroli Outrenoir", price: 650000, oldPrice: null, volume: "10 ml", category: "Floral", badge: "LUX", stock: 3, rating: 4.9, description: "Guerlain Neroli Outrenoir — neroli guli va qora notalarning hashamatli uyg'unligi. Fransuz parfyumeriyasining zirvasi.", image: "/images/products/placeholder.png" },
  { name: "Bvlgari Yasep Le Gemme", price: 600000, oldPrice: null, volume: "10 ml", category: "Oriental", badge: "LUX", stock: 4, rating: 4.9, description: "Bvlgari Le Gemme — qimmatbaho toshlardan ilhomlanib yaratilgan eksklyuziv ifor kolleksiyasi. Boylik va nafosatning timsoli.", image: "/images/products/placeholder.png" }
];

async function main() {
  console.log('Seeding fragrance store data (UZS-adapted relational mapping)...');

  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@bebfragrance.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin12345!';
  const adminPasswordHash = await hashPassword(adminPassword);

  // Clear existing transactions first
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productNote.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.setting.deleteMany();

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Store Admin',
      role: 'ADMIN',
      password: adminPasswordHash,
    },
    create: {
      email: adminEmail,
      name: 'Store Admin',
      role: 'ADMIN',
      password: adminPasswordHash,
    },
  });

  // Create customer 1
  const user1 = await prisma.user.upsert({
    where: { email: 'customer1@bebfragrance.com' },
    update: { name: 'Azizbek Karimov' },
    create: {
      email: 'customer1@bebfragrance.com',
      name: 'Azizbek Karimov',
      role: 'CUSTOMER',
    },
  });

  // Create customer 2
  const user2 = await prisma.user.upsert({
    where: { email: 'customer2@bebfragrance.com' },
    update: { name: 'Madina Aliyeva' },
    create: {
      email: 'customer2@bebfragrance.com',
      name: 'Madina Aliyeva',
      role: 'CUSTOMER',
    },
  });

  // Seed categories
  const categoryMap = new Map<string, { id: string }>();
  for (let index = 0; index < categoriesData.length; index += 1) {
    const category = categoriesData[index];
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        sortOrder: index,
        isActive: true,
      },
      select: { id: true },
    });
    categoryMap.set(category.slug, created);
  }

  // Create standard brand
  const brand = await prisma.brand.create({
    data: {
      name: 'Beb Fragrance',
      slug: 'beb-fragrance',
      description: 'Premium luxury fragrance house curated for modern perfume lovers.',
      isActive: true,
    },
  });

  const CONVERSION_RATE = 12800;

  // Seed products
  for (let index = 0; index < productsData.length; index += 1) {
    const prod = productsData[index];
    
    // Find category id
    const catSlug = slugify(prod.category);
    const category = categoryMap.get(catSlug);
    if (!category) {
      throw new Error(`Category id not found for slug: ${catSlug}`);
    }

    const skuBase = `BEB-${String(index + 1).padStart(4, '0')}`;
    const productSlug = slugify(prod.name);

    // Badges mapping
    const isNew = prod.badge === 'YANGI';
    const isBest = prod.badge === 'HIT';
    const isFeat = prod.badge === 'LUX' || prod.badge === 'PREMIUM' || prod.badge === 'SALE';

    // Parse volumes and convert UZS prices to USD values stored in DB
    const parsedVolume = parseVolumeToMl(prod.volume);
    const priceUsd = prod.price / CONVERSION_RATE;
    const comparePriceUsd = prod.oldPrice ? (prod.oldPrice / CONVERSION_RATE) : null;

    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        slug: productSlug,
        description: prod.description,
        shortDescription: prod.description.slice(0, 150),
        sku: skuBase,
        gender: guessGender(prod.name),
        isActive: true,
        isFeatured: isFeat,
        isBestseller: isBest,
        isNewArrival: isNew,
        metaTitle: `${prod.name} | Beb Fragrance`,
        metaDescription: prod.description.slice(0, 155),
        brandId: brand.id,
        categoryId: category.id,
        images: {
          create: {
            url: prod.image || '/images/products/placeholder.png',
            alt: prod.name,
            isPrimary: true,
            sortOrder: 0,
          },
        },
        variants: {
          create: {
            name: prod.volume,
            sku: `${skuBase}-${parsedVolume}`,
            size: prod.volume,
            sizeMl: parsedVolume,
            price: priceUsd,
            comparePrice: comparePriceUsd,
            stock: prod.stock,
            isActive: true,
          },
        },
        notes: {
          create: getNotesForCategory(prod.category).map((noteName, noteIndex) => ({
            name: noteName,
            type:
              noteIndex < 2
                ? NoteType.TOP
                : noteIndex < 4
                ? NoteType.MIDDLE
                : NoteType.BASE,
          })),
        },
      },
    });

    // Seed mock reviews from unique users to populate averageRating (rating is out of 5)
    const ratingTarget = prod.rating;
    let reviewRatings: number[] = [];
    if (ratingTarget >= 4.9) {
      reviewRatings = [5, 5, 5];
    } else if (ratingTarget >= 4.7) {
      reviewRatings = [5, 5, 4]; // average 4.67
    } else if (ratingTarget >= 4.5) {
      reviewRatings = [5, 4, 4]; // average 4.33
    } else if (ratingTarget >= 4.3) {
      reviewRatings = [4, 4, 5]; // average 4.33
    } else {
      reviewRatings = [4, 4, 4]; // average 4.0
    }

    const reviewUsers = [adminUser.id, user1.id, user2.id];
    const comments = [
      "Menga juda yoqdi, hidi uzoq saqlanadi va juda premium!",
      "Original mahsulot, qadoqlanishi ham ajoyib. Rahmat!",
      "Yaxshi atir, kundalik foydalanish uchun juda mos keladi."
    ];
    const titles = ["Ajoyib ifor", "Yuqori sifat", "Tavsiya etaman"];

    for (let rIndex = 0; rIndex < reviewRatings.length; rIndex++) {
      await prisma.review.create({
        data: {
          rating: reviewRatings[rIndex],
          title: titles[rIndex],
          comment: comments[rIndex],
          isVerified: true,
          isApproved: true,
          userId: reviewUsers[rIndex],
          productId: createdProduct.id,
        },
      });
    }
  }

  console.log(`✅ ${productsData.length} ta mahsulot muvaffaqiyatli qo'shildi!`);

  console.log('Seeding default settings...');
  const defaultSettings = [
    { key: 'site_name', value: 'Beb Fragrance', group: 'general' },
    { key: 'site_tagline', value: 'premium perfume store', group: 'general' },
    { key: 'contact_phone', value: '+998 (71) 123 45 67', group: 'general' },
    { key: 'contact_email', value: 'info@bebfragrance.uz', group: 'general' },
    { key: 'contact_address', value: 'Toshkent sh., Chilonzor tumani, 9-mavze', group: 'general' },
    { key: 'social_facebook', value: 'https://facebook.com/bebfragrance', group: 'general' },
    { key: 'social_instagram', value: 'https://instagram.com/bebfragrance', group: 'general' },
    { key: 'social_twitter', value: 'https://twitter.com/bebfragrance', group: 'general' },
    { key: 'hero_title_line1', value: 'Har bir', group: 'hero' },
    { key: 'hero_title_line2', value: 'lahza uchun ifor', group: 'hero' },
    { key: 'hero_description', value: 'Kundalik marosimlar va unutilmas uchrashuvlar uchun tanlangan romantik floral, nafis musk va kechki aksent iforlarni kashf eting.', group: 'hero' },
    { key: 'hero_bg_image', value: '', group: 'hero' },
    { key: 'hero_bottle_image_1', value: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=700&fit=crop', group: 'hero' },
    { key: 'hero_bottle_image_2', value: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=760&fit=crop', group: 'hero' },
    { key: 'hero_bottle_image_3', value: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=500&h=760&fit=crop', group: 'hero' },
    { key: 'hero_stat_1_value', value: '120+', group: 'hero' },
    { key: 'hero_stat_1_label', value: 'Lux brendlar', group: 'hero' },
    { key: 'hero_stat_2_value', value: '24h', group: 'hero' },
    { key: 'hero_stat_2_label', value: 'Sovg\'aga tayyor', group: 'hero' },
    { key: 'hero_stat_3_value', value: 'Top 50', group: 'hero' },
    { key: 'hero_stat_3_label', value: 'Saralangan hitlar', group: 'hero' },
    { key: 'promo_banner_image', value: '', group: 'banners' },
    { key: 'promo_banner_title', value: 'Sizning o\'ziga xos iforingiz', group: 'banners' },
    { key: 'promo_banner_desc', value: 'Issiq amber kechalari, yumshoq atirgul tonglari va har kun uchun nafis yangi notalarni kayfiyat bo\'yicha o\'rganing.', group: 'banners' },
    { key: 'promo_banner_link', value: '/products', group: 'banners' },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.create({
      data: setting,
    });
  }
  console.log('✅ Default settings seeded!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
