export type RoomType = "Salon" | "Chambre" | "Terrasse" | "Bureau" | "Coin repas";
export type StyleType = "Moderne" | "Scandinave" | "Naturel" | "Élégant" | "Estival" | "Familial";

export type KiteaProduct = {
  id: string;
  ref: string;
  name: string;
  price: number;
  category: string;
  availability: "Disponible" | "Stock limité" | "Sur commande";
  aisle: string;
  zone: string;
  department: string;
  roomTypes: RoomType[];
  styles: StyleType[];
  image: string;
  productUrl: string;
  sourceUrl: string;
};

export const rooms: RoomType[] = ["Salon", "Chambre", "Terrasse", "Bureau", "Coin repas"];
export const styles: StyleType[] = ["Moderne", "Scandinave", "Naturel", "Élégant", "Estival", "Familial"];

export const kiteaCatalog: KiteaProduct[] = [
  {
    id: "pezzaro-2p-beige",
    ref: "10108503343",
    name: "Canapé 2 Places Pezzaro - Beige",
    price: 9995,
    category: "Canapé simple",
    availability: "Disponible",
    aisle: "Allée B",
    zone: "Zone Salon",
    department: "Salon",
    roomTypes: ["Salon", "Bureau"],
    styles: ["Moderne", "Scandinave", "Naturel", "Familial"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/1/0/10108503343-a.png",
    productUrl: "https://www.kitea.com/canape-2-places-pezzaro-beige.html",
    sourceUrl: "https://www.kitea.com/par-espaces/salon-et-sejour/canapes-et-sofas.html"
  },
  {
    id: "river-angle-droit",
    ref: "10108497343-p",
    name: "Canapé D'Angle Droit River",
    price: 18995,
    category: "Canapé d'angle",
    availability: "Disponible",
    aisle: "Allée B",
    zone: "Zone Salon",
    department: "Salon",
    roomTypes: ["Salon"],
    styles: ["Moderne", "Élégant", "Familial"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/1/0/10108497343_1.png",
    productUrl: "https://www.kitea.com/canape-d-angle-droit-river.html",
    sourceUrl: "https://www.kitea.com/par-espaces/salon-et-sejour/canapes-et-sofas.html"
  },
  {
    id: "new-cosmit",
    ref: "10115812332",
    name: "Table Basse Relevable NEW COSMIT",
    price: 1795,
    category: "Table basse",
    availability: "Disponible",
    aisle: "Allée B",
    zone: "Zone Salon",
    department: "Salon",
    roomTypes: ["Salon", "Bureau"],
    styles: ["Moderne", "Familial", "Élégant"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/1/0/10115812332b.webp",
    productUrl: "https://www.kitea.com/table-basse-relevable-new-cosmit.html",
    sourceUrl: "https://www.kitea.com/par-espaces/salon-et-sejour/tables-de-salon/table-basse.html"
  },
  {
    id: "vigo-chene-blanc",
    ref: "10115814922",
    name: "Table Basse Vigo Chêne/Blanc",
    price: 745,
    category: "Table basse",
    availability: "Stock limité",
    aisle: "Allée B",
    zone: "Tables de salon",
    department: "Salon",
    roomTypes: ["Salon", "Coin repas"],
    styles: ["Scandinave", "Naturel", "Estival"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/t/a/table_basse_a_plateau_coulissant_vigo.webp",
    productUrl: "https://www.kitea.com/table-basse-vigo-chene-blanc-avec-plateau-coulissant.html",
    sourceUrl: "https://www.kitea.com/par-espaces/salon-et-sejour/tables-de-salon/table-basse.html"
  },
  {
    id: "lampe-noir-30x52",
    ref: "10091108214",
    name: "Lampe De Table 30X52Cm - Noir",
    price: 499,
    category: "Lampe de table",
    availability: "Disponible",
    aisle: "Allée D",
    zone: "Luminaires",
    department: "Décoration",
    roomTypes: ["Salon", "Chambre", "Bureau"],
    styles: ["Moderne", "Élégant", "Familial"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/1/0/10094068234-1.png",
    productUrl: "https://www.kitea.com/lampe-de-table-30x52cm-noir-10091108214.html",
    sourceUrl: "https://www.kitea.com/deco-luminaires/luminaires-et-eclairages/lampe-de-table.html"
  },
  {
    id: "lampe-ceramic-dore",
    ref: "10104177317",
    name: "Lampe De Table En Ceramic Metal - Doré",
    price: 399,
    category: "Lampe de table",
    availability: "Disponible",
    aisle: "Allée D",
    zone: "Luminaires",
    department: "Décoration",
    roomTypes: ["Salon", "Chambre", "Coin repas"],
    styles: ["Élégant", "Estival", "Moderne"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/g/s/gs-2404083c_1.jpg",
    productUrl: "https://www.kitea.com/lampe-de-table-en-ceramic-metal-30x47h-cm-dore.html",
    sourceUrl: "https://www.kitea.com/deco-luminaires/luminaires-et-eclairages/lampe-de-table.html"
  },
  {
    id: "vase-equilibre-marron",
    ref: "10104983314",
    name: "Vase Equilibre 14.5X9.5X31Cm - Marron",
    price: 299,
    category: "Vase décoratif",
    availability: "Disponible",
    aisle: "Allée D",
    zone: "Objets déco",
    department: "Décoration",
    roomTypes: ["Salon", "Chambre", "Bureau", "Coin repas"],
    styles: ["Naturel", "Estival", "Élégant"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/1/0/10104983314_1_.webp",
    productUrl: "https://www.kitea.com/vase-equilibre-14-5x9-5x31cm-marron.html",
    sourceUrl: "https://www.kitea.com/deco-luminaires/objets-deco/vases.html"
  },
  {
    id: "vase-champignon-vert",
    ref: "10104982294",
    name: "Vase Champignon 16X16X23Cm - Vert",
    price: 299,
    category: "Vase décoratif",
    availability: "Stock limité",
    aisle: "Allée D",
    zone: "Objets déco",
    department: "Décoration",
    roomTypes: ["Salon", "Chambre", "Terrasse", "Bureau"],
    styles: ["Naturel", "Estival", "Familial"],
    image:
      "https://www.kitea.com/media/catalog/product/cache/c06d1bb5eedf825ac39d687cd7d5d37e/1/0/10104982294-13_1_.webp",
    productUrl: "https://www.kitea.com/vase-champignon-16x16x23cm-vert.html",
    sourceUrl: "https://www.kitea.com/deco-luminaires/objets-deco/vases.html"
  }
];

export function getRecommendations(room: RoomType, style: StyleType) {
  const direct = kiteaCatalog.filter(
    (product) => product.roomTypes.includes(room) && product.styles.includes(style)
  );
  const byRoom = kiteaCatalog.filter((product) => product.roomTypes.includes(room));
  const merged = [...direct, ...byRoom, ...kiteaCatalog].filter(
    (product, index, list) => list.findIndex((item) => item.id === product.id) === index
  );

  return merged.slice(0, 6);
}
