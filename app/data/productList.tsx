import parfum1 from "../assets/images/parfum1.jpg";
import parfum2 from "../assets/images/parfum2.jpg";
import parfum3 from "../assets/images/parfum3.jpg";

const productDetails = [
  ["YSL Y Eau de Parfum", parfum1, "YSL Y EDP", "120.000"],
  ["Dior Sauvage", parfum2, "Sauvage EDT", "135.000"],
  ["Bleu de Chanel", parfum3, "Bleu EDP", "145.000"],
  ["Azzaro Wanted", parfum1, "Wanted EDT", "110.000"],
  ["Hugo Boss Bottled", parfum2, "Boss Bottled", "115.000"],
  ["Giorgio Armani Acqua di Gio", parfum3, "Acqua di Gio", "140.000"],
  ["Versace Eros", parfum1, "Eros EDT", "125.000"],
  ["Calvin Klein Eternity", parfum2, "Eternity Men", "105.000"],
  ["Paco Rabanne 1 Million", parfum3, "1 Million EDT", "130.000"],
  ["Montblanc Explorer", parfum1, "Explorer EDP", "118.000"],
  ["JIMMY CHOO Man", parfum2, "JIMMY CHOO Man", "108.000"],
  ["Bvlgari Man Glacial Essence", parfum3, "Glacial Essence", "150.000"],
] as const;

const Data = productDetails.map(([name, image, varian, price], index) => ({
  id: index + 1,
  name,
  image,
  price,
  varian: [varian, `${varian} Intense`],
  rating: 4.7 + ((index + 2) % 3) / 10,
  sold: 87 + (12 - index) * 10,
  location: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"][index % 4],
  description: `Aroma ${name} yang elegan dan tahan lama, cocok untuk menemani aktivitas sehari-hari maupun acara spesial.`,
}));

export default Data;