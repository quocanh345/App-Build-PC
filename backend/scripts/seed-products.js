// Script chèn dữ liệu mẫu (25 sản phẩm/loại, từ phổ thông đến cao cấp) vào DB.
// Chạy: node scripts/seed-products.js
require('dotenv/config');
const { Client } = require('pg');

const STOCK = 50;

function img(name) {
  return `https://placehold.co/600x400?text=${encodeURIComponent(name)}`;
}

// ─── CPU ───────────────────────────────────────────────
const cpuList = [
  ['Intel Pentium Gold G7400', 'Intel', 2, 4, 3.7, 6, 'LGA1700', 46, 'UHD 710', 1290000],
  ['Intel Core i3-12100F', 'Intel', 4, 8, 3.3, 12, 'LGA1700', 58, '', 2290000],
  ['Intel Core i3-13100', 'Intel', 4, 8, 3.4, 12, 'LGA1700', 60, 'UHD 730', 2890000],
  ['AMD Ryzen 3 4100', 'AMD', 4, 8, 3.8, 6, 'AM4', 65, '', 1690000],
  ['AMD Ryzen 5 4500', 'AMD', 6, 12, 3.6, 8, 'AM4', 65, '', 2190000],
  ['Intel Core i5-12400F', 'Intel', 6, 12, 2.5, 18, 'LGA1700', 65, '', 3390000],
  ['Intel Core i5-13400F', 'Intel', 10, 16, 2.5, 20, 'LGA1700', 65, '', 4290000],
  ['AMD Ryzen 5 5600', 'AMD', 6, 12, 3.5, 32, 'AM4', 65, '', 2990000],
  ['AMD Ryzen 5 5600X', 'AMD', 6, 12, 3.7, 32, 'AM4', 65, '', 3690000],
  ['AMD Ryzen 5 7600', 'AMD', 6, 12, 3.8, 32, 'AM5', 65, 'Radeon Graphics', 4990000],
  ['Intel Core i5-13600K', 'Intel', 14, 20, 3.5, 24, 'LGA1700', 125, 'UHD 770', 8490000],
  ['Intel Core i5-14600K', 'Intel', 14, 20, 3.5, 24, 'LGA1700', 125, 'UHD 770', 8990000],
  ['AMD Ryzen 7 5700X', 'AMD', 8, 16, 3.4, 32, 'AM4', 65, '', 4690000],
  ['AMD Ryzen 7 7700X', 'AMD', 8, 16, 4.5, 40, 'AM5', 105, 'Radeon Graphics', 8290000],
  ['Intel Core i7-12700K', 'Intel', 12, 20, 3.6, 25, 'LGA1700', 125, 'UHD 770', 9490000],
  ['Intel Core i7-13700K', 'Intel', 16, 24, 3.4, 30, 'LGA1700', 125, 'UHD 770', 10990000],
  ['Intel Core i7-14700K', 'Intel', 20, 28, 3.4, 33, 'LGA1700', 125, 'UHD 770', 11990000],
  ['AMD Ryzen 7 7800X3D', 'AMD', 8, 16, 4.2, 96, 'AM5', 120, 'Radeon Graphics', 11490000],
  ['AMD Ryzen 9 5900X', 'AMD', 12, 24, 3.7, 64, 'AM4', 105, '', 8990000],
  ['AMD Ryzen 9 7900X', 'AMD', 12, 24, 4.7, 76, 'AM5', 170, 'Radeon Graphics', 13990000],
  ['Intel Core i9-13900K', 'Intel', 24, 32, 3.0, 36, 'LGA1700', 125, 'UHD 770', 15990000],
  ['Intel Core i9-14900K', 'Intel', 24, 32, 3.2, 36, 'LGA1700', 125, 'UHD 770', 16990000],
  ['AMD Ryzen 9 7950X', 'AMD', 16, 32, 4.5, 80, 'AM5', 170, 'Radeon Graphics', 18990000],
  ['AMD Ryzen 9 7950X3D', 'AMD', 16, 32, 4.2, 128, 'AM5', 120, 'Radeon Graphics', 21990000],
  ['Intel Core i9-14900KS', 'Intel', 24, 32, 3.2, 36, 'LGA1700', 150, 'UHD 770', 24990000],
];

// ─── RAM ───────────────────────────────────────────────
const ramList = [
  ['Kingston Fury Beast 8GB 3200MHz', 'Kingston', 8, 3200, 'DDR4', 'CL16', 590000],
  ['Kingston Fury Beast 16GB (2x8GB) 3200MHz', 'Kingston', 16, 3200, 'DDR4', 'CL16', 890000],
  ['Kingston Fury Beast 16GB 3600MHz', 'Kingston', 16, 3600, 'DDR4', 'CL17', 990000],
  ['G.Skill Ripjaws V 16GB 3200MHz', 'G.Skill', 16, 3200, 'DDR4', 'CL16', 950000],
  ['G.Skill Ripjaws V 32GB 3200MHz', 'G.Skill', 32, 3200, 'DDR4', 'CL16', 1790000],
  ['Corsair Vengeance LPX 16GB 3200MHz', 'Corsair', 16, 3200, 'DDR4', 'CL16', 980000],
  ['Corsair Vengeance LPX 32GB 3600MHz', 'Corsair', 32, 3600, 'DDR4', 'CL18', 1890000],
  ['Team T-Force Vulcan Z 16GB 3200MHz', 'Team Group', 16, 3200, 'DDR4', 'CL16', 870000],
  ['Team T-Force Vulcan Z 32GB 3600MHz', 'Team Group', 32, 3600, 'DDR4', 'CL18', 1690000],
  ['Corsair Vengeance RGB Pro 16GB 3200MHz', 'Corsair', 16, 3200, 'DDR4', 'CL16', 1090000],
  ['ADATA XPG Gammix D30 16GB 3200MHz', 'ADATA', 16, 3200, 'DDR4', 'CL16', 830000],
  ['Kingston Fury Renegade 16GB 6000MHz', 'Kingston', 16, 6000, 'DDR5', 'CL32', 1890000],
  ['Kingston Fury Beast 16GB 5600MHz DDR5', 'Kingston', 16, 5600, 'DDR5', 'CL36', 1590000],
  ['G.Skill Trident Z5 32GB 6000MHz', 'G.Skill', 32, 6000, 'DDR5', 'CL30', 3290000],
  ['G.Skill Trident Z5 RGB 32GB 6400MHz', 'G.Skill', 32, 6400, 'DDR5', 'CL32', 3590000],
  ['Corsair Vengeance DDR5 32GB 5600MHz', 'Corsair', 32, 5600, 'DDR5', 'CL36', 2990000],
  ['Corsair Dominator Platinum RGB 32GB 6000MHz', 'Corsair', 32, 6000, 'DDR5', 'CL30', 4990000],
  ['G.Skill Flare X5 32GB 6000MHz', 'G.Skill', 32, 6000, 'DDR5', 'CL36', 2890000],
  ['Team T-Force Delta RGB 32GB 6000MHz', 'Team Group', 32, 6000, 'DDR5', 'CL38', 2790000],
  ['Kingston Fury Beast 32GB (2x16GB) 5200MHz', 'Kingston', 32, 5200, 'DDR5', 'CL40', 2490000],
  ['ADATA XPG Lancer 32GB 6000MHz', 'ADATA', 32, 6000, 'DDR5', 'CL30', 3090000],
  ['G.Skill Trident Z5 Neo 64GB 6000MHz', 'G.Skill', 64, 6000, 'DDR5', 'CL30', 6490000],
  ['Corsair Dominator Titanium 64GB 6600MHz', 'Corsair', 64, 6600, 'DDR5', 'CL32', 8990000],
  ['Kingston Fury Renegade 64GB 6400MHz', 'Kingston', 64, 6400, 'DDR5', 'CL32', 7490000],
  ['G.Skill Trident Z5 RGB 96GB (2x48GB) 6000MHz', 'G.Skill', 96, 6000, 'DDR5', 'CL30', 9990000],
];

// ─── VGA ───────────────────────────────────────────────
const vgaList = [
  ['NVIDIA GeForce GT 1030 2GB', 'NVIDIA', 'Pascal', 2, 1265, 384, 30, 'HDMI, DVI', 1890000],
  ['NVIDIA GeForce GTX 1650 4GB', 'NVIDIA', 'Turing', 4, 1485, 896, 75, 'HDMI, DP, DVI', 3290000],
  ['NVIDIA GeForce GTX 1660 Super 6GB', 'NVIDIA', 'Turing', 6, 1530, 1408, 125, 'HDMI, DP x3', 4290000],
  ['NVIDIA GeForce RTX 3050 8GB', 'NVIDIA', 'Ampere', 8, 1470, 2560, 130, 'HDMI, DP x3', 5490000],
  ['AMD Radeon RX 6500 XT 4GB', 'AMD', 'RDNA2', 4, 2610, 1024, 107, 'HDMI, DP', 3990000],
  ['AMD Radeon RX 6600 8GB', 'AMD', 'RDNA2', 8, 2044, 1792, 132, 'HDMI, DP x3', 5990000],
  ['NVIDIA GeForce RTX 3060 12GB', 'NVIDIA', 'Ampere', 12, 1777, 3584, 170, 'HDMI, DP x3', 7490000],
  ['NVIDIA GeForce RTX 3060 Ti 8GB', 'NVIDIA', 'Ampere', 8, 1665, 4864, 200, 'HDMI, DP x3', 8990000],
  ['AMD Radeon RX 6650 XT 8GB', 'AMD', 'RDNA2', 8, 2635, 2048, 180, 'HDMI, DP x3', 7290000],
  ['NVIDIA GeForce RTX 4060 8GB', 'NVIDIA', 'Ada Lovelace', 8, 2460, 3072, 115, 'HDMI, DP x3', 7990000],
  ['AMD Radeon RX 7600 8GB', 'AMD', 'RDNA3', 8, 2655, 2048, 165, 'HDMI, DP x3', 7690000],
  ['NVIDIA GeForce RTX 4060 Ti 8GB', 'NVIDIA', 'Ada Lovelace', 8, 2535, 4352, 160, 'HDMI, DP x3', 10490000],
  ['NVIDIA GeForce RTX 3070 8GB', 'NVIDIA', 'Ampere', 8, 1725, 5888, 220, 'HDMI, DP x3', 11990000],
  ['AMD Radeon RX 6800 16GB', 'AMD', 'RDNA2', 16, 2105, 3840, 250, 'HDMI, DP x3', 12490000],
  ['NVIDIA GeForce RTX 4070 12GB', 'NVIDIA', 'Ada Lovelace', 12, 2475, 5888, 200, 'HDMI, DP x3', 15990000],
  ['AMD Radeon RX 7800 XT 16GB', 'AMD', 'RDNA3', 16, 2430, 3840, 263, 'HDMI, DP x3', 14990000],
  ['NVIDIA GeForce RTX 3080 10GB', 'NVIDIA', 'Ampere', 10, 1710, 8704, 320, 'HDMI, DP x3', 16990000],
  ['NVIDIA GeForce RTX 4070 Ti 12GB', 'NVIDIA', 'Ada Lovelace', 12, 2610, 7680, 285, 'HDMI, DP x3', 20990000],
  ['AMD Radeon RX 7900 XT 20GB', 'AMD', 'RDNA3', 20, 2400, 5376, 315, 'HDMI, DP x3', 21990000],
  ['NVIDIA GeForce RTX 4070 Ti Super 16GB', 'NVIDIA', 'Ada Lovelace', 16, 2610, 8448, 285, 'HDMI, DP x3', 23990000],
  ['NVIDIA GeForce RTX 3090 24GB', 'NVIDIA', 'Ampere', 24, 1695, 10496, 350, 'HDMI, DP x3', 28990000],
  ['AMD Radeon RX 7900 XTX 24GB', 'AMD', 'RDNA3', 24, 2500, 6144, 355, 'HDMI, DP x3', 26990000],
  ['NVIDIA GeForce RTX 4080 Super 16GB', 'NVIDIA', 'Ada Lovelace', 16, 2550, 10240, 320, 'HDMI, DP x3', 29990000],
  ['NVIDIA GeForce RTX 4090 24GB', 'NVIDIA', 'Ada Lovelace', 24, 2520, 16384, 450, 'HDMI, DP x3', 46990000],
  ['NVIDIA Titan RTX 24GB', 'NVIDIA', 'Turing', 24, 1770, 4608, 280, 'HDMI, DP x3, USB-C', 35990000],
];

// ─── Mainboard ─────────────────────────────────────────
const mainboardList = [
  ['ASUS PRIME H610M-E', 'ASUS', 'LGA1700', 'H610', 'mATX', 2, 'DDR4', 64, 1590000],
  ['Gigabyte H610M H', 'Gigabyte', 'LGA1700', 'H610', 'mATX', 2, 'DDR4', 64, 1490000],
  ['MSI PRO B660M-A', 'MSI', 'LGA1700', 'B660', 'mATX', 4, 'DDR4', 128, 2690000],
  ['ASUS TUF Gaming B660M-PLUS', 'ASUS', 'LGA1700', 'B660', 'mATX', 4, 'DDR4', 128, 3290000],
  ['Gigabyte B760M DS3H', 'Gigabyte', 'LGA1700', 'B760', 'mATX', 4, 'DDR4', 128, 2890000],
  ['ASUS PRIME B760M-A', 'ASUS', 'LGA1700', 'B760', 'mATX', 4, 'DDR5', 128, 3690000],
  ['MSI MAG B760 TOMAHAWK', 'MSI', 'LGA1700', 'B760', 'ATX', 4, 'DDR5', 128, 4990000],
  ['ASUS ROG STRIX Z790-E', 'ASUS', 'LGA1700', 'Z790', 'ATX', 4, 'DDR5', 128, 11990000],
  ['Gigabyte Z790 AORUS ELITE', 'Gigabyte', 'LGA1700', 'Z790', 'ATX', 4, 'DDR5', 128, 7990000],
  ['MSI MPG Z790 CARBON WIFI', 'MSI', 'LGA1700', 'Z790', 'ATX', 4, 'DDR5', 128, 9490000],
  ['ASRock B450M Pro4', 'ASRock', 'AM4', 'B450', 'mATX', 4, 'DDR4', 128, 1690000],
  ['Gigabyte B450M DS3H', 'Gigabyte', 'AM4', 'B450', 'mATX', 4, 'DDR4', 128, 1590000],
  ['ASUS TUF Gaming B550-PLUS', 'ASUS', 'AM4', 'B550', 'ATX', 4, 'DDR4', 128, 3190000],
  ['MSI B550 GAMING PLUS', 'MSI', 'AM4', 'B550', 'ATX', 4, 'DDR4', 128, 2990000],
  ['Gigabyte B550 AORUS ELITE', 'Gigabyte', 'AM4', 'B550', 'ATX', 4, 'DDR4', 128, 3490000],
  ['ASUS ROG STRIX X570-E', 'ASUS', 'AM4', 'X570', 'ATX', 4, 'DDR4', 128, 7990000],
  ['ASRock B650M PG Riptide', 'ASRock', 'AM5', 'B650', 'mATX', 4, 'DDR5', 128, 3290000],
  ['MSI PRO B650-P WIFI', 'MSI', 'AM5', 'B650', 'ATX', 4, 'DDR5', 128, 4190000],
  ['Gigabyte B650 AORUS ELITE AX', 'Gigabyte', 'AM5', 'B650', 'ATX', 4, 'DDR5', 128, 5290000],
  ['ASUS TUF Gaming X670E-Plus', 'ASUS', 'AM5', 'X670E', 'ATX', 4, 'DDR5', 128, 8990000],
  ['Gigabyte X670E AORUS MASTER', 'Gigabyte', 'AM5', 'X670E', 'ATX', 4, 'DDR5', 128, 13990000],
  ['MSI MEG X670E ACE', 'MSI', 'AM5', 'X670E', 'ATX', 4, 'DDR5', 128, 17990000],
  ['ASUS ROG CROSSHAIR X670E HERO', 'ASUS', 'AM5', 'X670E', 'ATX', 4, 'DDR5', 128, 16990000],
  ['ASUS ROG MAXIMUS Z790 HERO', 'ASUS', 'LGA1700', 'Z790', 'ATX', 4, 'DDR5', 128, 15990000],
  ['Gigabyte Z790 AORUS XTREME', 'Gigabyte', 'LGA1700', 'Z790', 'E-ATX', 4, 'DDR5', 128, 24990000],
];

// ─── PSU ───────────────────────────────────────────────
const psuList = [
  ['Corsair CV450', 'Corsair', 450, '80+ Bronze', 'Non-modular', 890000],
  ['Cooler Master MWE 450', 'Cooler Master', 450, '80+ Bronze', 'Non-modular', 790000],
  ['Gigabyte P450B', 'Gigabyte', 450, '80+ Bronze', 'Non-modular', 750000],
  ['Corsair CV550', 'Corsair', 550, '80+ Bronze', 'Non-modular', 990000],
  ['Thermaltake Smart 500W', 'Thermaltake', 500, '80+ White', 'Non-modular', 690000],
  ['Cooler Master MWE 550 Bronze V2', 'Cooler Master', 550, '80+ Bronze', 'Non-modular', 950000],
  ['Corsair TX550M', 'Corsair', 550, '80+ Gold', 'Semi-modular', 1890000],
  ['Corsair RM650', 'Corsair', 650, '80+ Gold', 'Full-modular', 2490000],
  ['Cooler Master MWE 650 Gold', 'Cooler Master', 650, '80+ Gold', 'Semi-modular', 1990000],
  ['Seasonic Focus GX-650', 'Seasonic', 650, '80+ Gold', 'Full-modular', 2690000],
  ['FSP Hydro G Pro 650', 'FSP', 650, '80+ Gold', 'Full-modular', 2290000],
  ['Corsair RM750', 'Corsair', 750, '80+ Gold', 'Full-modular', 2890000],
  ['Seasonic Focus GX-750', 'Seasonic', 750, '80+ Gold', 'Full-modular', 2990000],
  ['ASUS ROG STRIX 750G', 'ASUS', 750, '80+ Gold', 'Full-modular', 3290000],
  ['Cooler Master V750 SFX Gold', 'Cooler Master', 750, '80+ Gold', 'Full-modular', 3490000],
  ['Corsair RM850', 'Corsair', 850, '80+ Gold', 'Full-modular', 3490000],
  ['Seasonic Focus GX-850', 'Seasonic', 850, '80+ Gold', 'Full-modular', 3690000],
  ['ASUS ROG STRIX 850G', 'ASUS', 850, '80+ Gold', 'Full-modular', 3990000],
  ['Corsair RM1000x', 'Corsair', 1000, '80+ Gold', 'Full-modular', 4990000],
  ['Seasonic Prime TX-1000', 'Seasonic', 1000, '80+ Titanium', 'Full-modular', 7990000],
  ['Corsair HX1000i', 'Corsair', 1000, '80+ Platinum', 'Full-modular', 6990000],
  ['EVGA SuperNOVA 1000 P6', 'EVGA', 1000, '80+ Platinum', 'Full-modular', 5990000],
  ['Corsair AX1600i', 'Corsair', 1600, '80+ Titanium', 'Full-modular', 13990000],
  ['Seasonic Prime TX-1300', 'Seasonic', 1300, '80+ Titanium', 'Full-modular', 9990000],
  ['ASUS ROG THOR 1200W Platinum', 'ASUS', 1200, '80+ Platinum', 'Full-modular', 8990000],
];

// ─── Cooler ────────────────────────────────────────────
const coolerList = [
  ['Deepcool GAMMAXX 400', 'Deepcool', 'Air', 120, 1500, 25.4, 'Intel & AMD', 350000],
  ['Cooler Master Hyper 212', 'Cooler Master', 'Air', 120, 1800, 26, 'Intel & AMD', 590000],
  ['Deepcool AS500', 'Deepcool', 'Air', 140, 1200, 25.4, 'Intel & AMD', 890000],
  ['Noctua NH-U12S', 'Noctua', 'Air', 120, 1500, 22.4, 'Intel & AMD', 1890000],
  ['be quiet! Pure Rock 2', 'be quiet!', 'Air', 120, 1500, 24.5, 'Intel & AMD', 790000],
  ['Cooler Master Hyper 212 RGB Black Edition', 'Cooler Master', 'Air', 120, 1800, 26, 'Intel & AMD', 690000],
  ['Thermalright Peerless Assassin 120 SE', 'Thermalright', 'Air', 120, 1500, 25.6, 'Intel & AMD', 590000],
  ['Noctua NH-D15', 'Noctua', 'Air', 140, 1500, 24.6, 'Intel & AMD', 2990000],
  ['DeepCool AK620', 'Deepcool', 'Air', 120, 1850, 28, 'Intel & AMD', 1290000],
  ['Scythe Mugen 5', 'Scythe', 'Air', 120, 1200, 24.9, 'Intel & AMD', 990000],
  ['Corsair iCUE H60', 'Corsair', 'Liquid', 120, 2400, 32, 'Intel & AMD', 1690000],
  ['Cooler Master MasterLiquid ML120L', 'Cooler Master', 'Liquid', 120, 2000, 30, 'Intel & AMD', 1490000],
  ['Deepcool LS520', 'Deepcool', 'Liquid', 240, 1800, 29, 'Intel & AMD', 1990000],
  ['NZXT Kraken 240', 'NZXT', 'Liquid', 240, 1800, 32, 'Intel & AMD', 3290000],
  ['Corsair iCUE H100i Elite', 'Corsair', 'Liquid', 240, 2400, 34, 'Intel & AMD', 3990000],
  ['Cooler Master MasterLiquid ML240L', 'Cooler Master', 'Liquid', 240, 2000, 30, 'Intel & AMD', 2290000],
  ['Lian Li Galahad 240', 'Lian Li', 'Liquid', 240, 2100, 28, 'Intel & AMD', 2690000],
  ['Corsair iCUE H150i Elite', 'Corsair', 'Liquid', 360, 2400, 34, 'Intel & AMD', 5290000],
  ['NZXT Kraken 360', 'NZXT', 'Liquid', 360, 1800, 32, 'Intel & AMD', 4990000],
  ['Deepcool LS720', 'Deepcool', 'Liquid', 360, 1800, 29, 'Intel & AMD', 3290000],
  ['Corsair iCUE H170i Elite', 'Corsair', 'Liquid', 420, 2000, 35, 'Intel & AMD', 6990000],
  ['Lian Li Galahad II LCD 360', 'Lian Li', 'Liquid', 360, 2100, 30, 'Intel & AMD', 5990000],
  ['NZXT Kraken Elite 360 RGB', 'NZXT', 'Liquid', 360, 1800, 32, 'Intel & AMD', 6490000],
  ['Corsair iCUE Link H150i', 'Corsair', 'Liquid', 360, 2100, 32, 'Intel & AMD', 6990000],
  ['EK-Quantum Magnitude', 'EKWB', 'Custom Loop', 480, 2500, 36, 'Intel & AMD', 29990000],
];

// ─── Case ──────────────────────────────────────────────
const caseList = [
  ['Xigmatek Gale', 'Xigmatek', 'MicroATX', 300, 160, 1, 590000],
  ['Aerocool CS-105', 'Aerocool', 'MicroATX', 320, 160, 1, 490000],
  ['MSI MAG FORGE 100M', 'MSI', 'MicroATX', 320, 166, 2, 890000],
  ['Cooler Master MasterBox Q300L', 'Cooler Master', 'MicroATX', 360, 159, 2, 990000],
  ['NZXT H210', 'NZXT', 'Mini-ITX', 325, 165, 2, 1890000],
  ['Corsair 4000D Airflow', 'Corsair', 'ATX', 360, 170, 2, 2190000],
  ['Cooler Master MasterBox TD500 Mesh', 'Cooler Master', 'ATX', 410, 165, 3, 1990000],
  ['NZXT H510 Flow', 'NZXT', 'ATX', 381, 165, 2, 2290000],
  ['Lian Li Lancool 205', 'Lian Li', 'ATX', 375, 168, 3, 1690000],
  ['Deepcool CC560', 'Deepcool', 'ATX', 350, 165, 4, 1590000],
  ['Corsair 5000D Airflow', 'Corsair', 'ATX', 420, 170, 2, 3290000],
  ['NZXT H710', 'NZXT', 'ATX', 413, 185, 3, 3690000],
  ['Lian Li Lancool II Mesh', 'Lian Li', 'ATX', 384, 176, 3, 2490000],
  ['Fractal Design Meshify 2', 'Fractal Design', 'ATX', 460, 185, 2, 3290000],
  ['Cooler Master H500', 'Cooler Master', 'ATX', 410, 190, 2, 2890000],
  ['Phanteks Eclipse P400A', 'Phanteks', 'ATX', 420, 160, 3, 1890000],
  ['Corsair iCUE 4000X RGB', 'Corsair', 'ATX', 360, 170, 3, 2990000],
  ['NZXT H9 Flow', 'NZXT', 'E-ATX', 435, 165, 2, 4290000],
  ['Lian Li O11 Dynamic', 'Lian Li', 'E-ATX', 420, 155, 0, 3990000],
  ['Lian Li O11 Dynamic EVO', 'Lian Li', 'E-ATX', 422, 167, 0, 4990000],
  ['Corsair 7000D Airflow', 'Corsair', 'E-ATX', 470, 190, 3, 5990000],
  ['Fractal Design Torrent', 'Fractal Design', 'E-ATX', 461, 185, 3, 5490000],
  ['Cooler Master Cosmos C700M', 'Cooler Master', 'E-ATX', 412, 200, 3, 9990000],
  ['Thermaltake Core P8', 'Thermaltake', 'E-ATX', 502, 200, 0, 6990000],
  ['Corsair Obsidian 1000D', 'Corsair', 'E-ATX', 470, 190, 7, 15990000],
];

// ─── SSD ───────────────────────────────────────────────
const ssdList = [
  ['Kingston A400 120GB', 'Kingston', 120, 'SATA', 500, 320, 350000],
  ['Kingston A400 240GB', 'Kingston', 240, 'SATA', 500, 350, 490000],
  ['WD Green 240GB', 'Western Digital', 240, 'SATA', 545, 430, 520000],
  ['Samsung 870 EVO 250GB', 'Samsung', 250, 'SATA', 560, 530, 790000],
  ['Kingston NV2 250GB', 'Kingston', 250, 'NVMe', 3000, 1300, 690000],
  ['WD Blue SN570 250GB', 'Western Digital', 250, 'NVMe', 3300, 1200, 750000],
  ['Samsung 970 EVO Plus 250GB', 'Samsung', 250, 'NVMe', 3500, 2300, 990000],
  ['Kingston A400 480GB', 'Kingston', 480, 'SATA', 500, 450, 790000],
  ['Samsung 870 EVO 500GB', 'Samsung', 500, 'SATA', 560, 530, 1290000],
  ['WD Blue SN570 500GB', 'Western Digital', 500, 'NVMe', 3500, 2300, 1190000],
  ['Kingston NV2 500GB', 'Kingston', 500, 'NVMe', 3500, 2100, 1090000],
  ['Crucial P3 500GB', 'Crucial', 500, 'NVMe', 3500, 1900, 1150000],
  ['Samsung 980 500GB', 'Samsung', 500, 'NVMe', 3100, 2600, 1390000],
  ['Samsung 980 Pro 500GB', 'Samsung', 500, 'NVMe', 7000, 5000, 1990000],
  ['WD Black SN770 500GB', 'Western Digital', 500, 'NVMe', 5150, 4900, 1690000],
  ['Kingston KC3000 1TB', 'Kingston', 1000, 'NVMe', 7000, 7000, 2490000],
  ['Samsung 980 Pro 1TB', 'Samsung', 1000, 'NVMe', 7000, 5000, 2990000],
  ['WD Black SN850X 1TB', 'Western Digital', 1000, 'NVMe', 7300, 6300, 2890000],
  ['Crucial T500 1TB', 'Crucial', 1000, 'NVMe', 7300, 6800, 2690000],
  ['Samsung 990 Pro 1TB', 'Samsung', 1000, 'NVMe', 7450, 6900, 3290000],
  ['Samsung 870 EVO 1TB', 'Samsung', 1000, 'SATA', 560, 530, 1990000],
  ['WD Black SN850X 2TB', 'Western Digital', 2000, 'NVMe', 7300, 6600, 5290000],
  ['Samsung 990 Pro 2TB', 'Samsung', 2000, 'NVMe', 7450, 6900, 5990000],
  ['Kingston KC3000 2TB', 'Kingston', 2000, 'NVMe', 7000, 7000, 4990000],
  ['Samsung 990 Pro 4TB', 'Samsung', 4000, 'NVMe', 7450, 6900, 11990000],
];

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'abel',
    password: process.env.DATABASE_PASSWORD,
    database: 'buildpc',
  });
  await client.connect();

  let total = 0;

  for (const [name, manufacturer, cores, threads, frequency, cache, socket, tdp, iGPU, price] of cpuList) {
    const description = `CPU ${name} của ${manufacturer} — ${cores} nhân ${threads} luồng, xung nhịp ${frequency}GHz, TDP ${tdp}W.`;
    await client.query(
      `INSERT INTO cpu (name, manufacturer, cores, threads, frequency, cache, socket, tdp, "iGPU", description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [name, manufacturer, cores, threads, frequency, cache, socket, tdp, iGPU, description, img(name), STOCK, price],
    );
    total++;
  }

  for (const [name, manufacturer, memory, bus, standard, latency, price] of ramList) {
    const description = `RAM ${name} của ${manufacturer} — ${memory}GB, bus ${bus}MHz, chuẩn ${standard}, độ trễ ${latency}.`;
    await client.query(
      `INSERT INTO ram (name, manufacturer, memory, bus, standard, latency, description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [name, manufacturer, memory, bus, standard, latency, description, img(name), STOCK, price],
    );
    total++;
  }

  for (const [name, manufacturer, architecture, vMemory, frequency, cores, tgp, port, price] of vgaList) {
    const description = `VGA ${name} của ${manufacturer} — kiến trúc ${architecture}, ${vMemory}GB VRAM, TGP ${tgp}W.`;
    await client.query(
      `INSERT INTO vga (name, manufacturer, architecture, "vMemory", frequency, cores, tgp, port, description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [name, manufacturer, architecture, vMemory, frequency, cores, tgp, port, description, img(name), STOCK, price],
    );
    total++;
  }

  for (const [name, manufacturer, socket, chipset, formFactor, memorySlots, memoryType, maxMemory, price] of mainboardList) {
    const description = `Mainboard ${name} của ${manufacturer} — socket ${socket}, chipset ${chipset}, ${formFactor}, hỗ trợ ${memoryType}.`;
    await client.query(
      `INSERT INTO mainboard (name, manufacturer, socket, chipset, "formFactor", "memorySlots", "memoryType", "maxMemory", description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [name, manufacturer, socket, chipset, formFactor, memorySlots, memoryType, maxMemory, description, img(name), STOCK, price],
    );
    total++;
  }

  for (const [name, manufacturer, wattage, efficiency, modular, price] of psuList) {
    const description = `Nguồn ${name} của ${manufacturer} — công suất ${wattage}W, chuẩn ${efficiency}, ${modular}.`;
    await client.query(
      `INSERT INTO psu (name, manufacturer, wattage, efficiency, modular, description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [name, manufacturer, wattage, efficiency, modular, description, img(name), STOCK, price],
    );
    total++;
  }

  for (const [name, manufacturer, type, size, fanSpeed, noise, socketSupport, price] of coolerList) {
    const description = `Tản nhiệt ${name} của ${manufacturer} — loại ${type}, kích thước ${size}mm, độ ồn ${noise}dBA.`;
    await client.query(
      `INSERT INTO cooler (name, manufacturer, type, size, "fanSpeed", noise, "socketSupport", description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [name, manufacturer, type, size, fanSpeed, noise, socketSupport, description, img(name), STOCK, price],
    );
    total++;
  }

  for (const [name, manufacturer, formFactor, maxGpuLength, maxCoolerHeight, includedFans, price] of caseList) {
    const description = `Case ${name} của ${manufacturer} — ${formFactor}, hỗ trợ VGA dài tới ${maxGpuLength}mm, kèm ${includedFans} quạt.`;
    await client.query(
      `INSERT INTO "case" (name, manufacturer, "formFactor", "maxGpuLength", "maxCoolerHeight", "includedFans", description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [name, manufacturer, formFactor, maxGpuLength, maxCoolerHeight, includedFans, description, img(name), STOCK, price],
    );
    total++;
  }

  for (const [name, manufacturer, capacity, type, readSpeed, writeSpeed, price] of ssdList) {
    const description = `SSD ${name} của ${manufacturer} — dung lượng ${capacity}GB, chuẩn ${type}, tốc độ đọc ${readSpeed}MB/s.`;
    await client.query(
      `INSERT INTO ssd (name, manufacturer, capacity, type, "readSpeed", "writeSpeed", description, "imageUrl", stock, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [name, manufacturer, capacity, type, readSpeed, writeSpeed, description, img(name), STOCK, price],
    );
    total++;
  }

  console.log(`Đã chèn ${total} sản phẩm.`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
