import { OfficialPrices, Station, Review } from './types'

export const OFFICIAL_PRICES: OfficialPrices = {
  coast:  { '95 ULP': 22.53, '93 ULP': 22.10, 'Diesel 50ppm': 25.35, 'Diesel 500ppm': 24.98 },
  inland: { '95 ULP': 23.36, '93 ULP': 23.25, 'Diesel 50ppm': 26.11, 'Diesel 500ppm': 25.74 },
}

export const FUEL_TYPES = ['95 ULP', '93 ULP', 'Diesel 50ppm', 'Diesel 500ppm'] as const

export const PROVINCES = [
  'All', 'Western Cape', 'Gauteng', 'KwaZulu-Natal',
  'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga',
  'North West', 'Northern Cape', 'Highway',
] as const
export type Province = typeof PROVINCES[number]

export const HIGHWAYS = ['All', 'N1', 'N2', 'N3', 'N4', 'N7', 'N12', 'N14'] as const

const SAMPLE_REVIEWS: Review[] = [{
  id: 'r1', userHandle: 'TruckDriver_ZA', userTier: 'diamond',
  overallRating: 4, priceAccuracy: 5, service: 4, cleanliness: 3,
  waitTime: 'short', comment: 'Price matched FuelFinder exactly. Quick service.', date: '2026-04-07', helpful: 8,
}, {
  id: 'r2', userHandle: 'CapeTownMom', userTier: 'verified',
  overallRating: 5, priceAccuracy: 5, service: 5, cleanliness: 5,
  waitTime: 'short', comment: 'Best priced diesel on the N2. Always reliable.', date: '2026-04-06', helpful: 12,
}]

function mk(
  id: string, name: string, brand: string, area: string,
  province: string, highway: string | null,
  lat: number, lng: number,
  p95: number, p93: number, pD50: number, pD500: number,
  trust: 'owner'|'confirmed'|'single'|'disputed',
  reports: number, age: string, conf: number,
  amenities: string[], open24: boolean, isTruck: boolean,
  loyalty?: string
): Station {
  return {
    id, name, brand, area, address: area, province, highway,
    lat, lng, dist: 0, open24, isTruck,
    hasLoyalty: !!loyalty, loyaltyName: loyalty, amenities,
    prices: { '95 ULP': p95, '93 ULP': p93, 'Diesel 50ppm': pD50, 'Diesel 500ppm': pD500 },
    trust: { level: trust, reports, age, confidence: conf, low: { 'Diesel 50ppm': pD50 }, high: { 'Diesel 50ppm': pD50 } },
    rating: {
      overall: +(3.2 + Math.random() * 1.7).toFixed(1),
      priceAccuracy: +(3.5 + Math.random() * 1.4).toFixed(1),
      service: +(3.0 + Math.random() * 1.8).toFixed(1),
      cleanliness: +(3.0 + Math.random() * 1.8).toFixed(1),
      reviewCount: Math.floor(4 + Math.random() * 60),
    },
    reviews: Math.random() > 0.5 ? SAMPLE_REVIEWS : [SAMPLE_REVIEWS[0]],
  }
}

export const STATIONS: Station[] = [
  // ══ WESTERN CAPE — Cape Metro ════════════════════════════════════════════
  mk('wc01','BP Helderberg','BP','Somerset West','Western Cape',null,-34.082,18.851,22.53,22.10,25.09,24.74,'owner',1,'1h ago',95,['Car wash','ATM','Shop','Pick n Pay Express'],false,false,'BP FuelSave'),
  mk('wc02','Sasol Main Road','Sasol','Somerset West','Western Cape',null,-34.083,18.849,22.39,21.98,25.07,24.72,'confirmed',5,'2h ago',88,['Car wash','Shop'],false,false),
  mk('wc03','Shell Somerset Mall','Shell','Somerset West','Western Cape',null,-34.076,18.843,23.90,23.40,26.80,26.40,'confirmed',3,'3h ago',72,['Shop','Restaurant','ATM'],true,false,'Shell Go+'),
  mk('wc04','Engen Sir Lowrys Pass','Engen',"Sir Lowry's Pass",'Western Cape','N2',-34.105,18.910,22.53,22.10,25.20,24.88,'single',1,'6h ago',35,['Shop','ATM','Restaurant','Truck bay'],true,true,'Engen 1-Card'),
  mk('wc05','TotalEnergies Gordons Bay','TotalEnergies',"Gordon's Bay",'Western Cape',null,-34.156,18.866,26.50,26.10,31.50,31.00,'single',1,'8h ago',30,['Shop','Restaurant'],false,false,'Total Rewards'),
  mk('wc06','BP Bellville','BP','Bellville','Western Cape',null,-33.899,18.630,22.53,22.10,25.15,24.80,'confirmed',4,'1h ago',82,['Car wash','ATM','Shop','Pick n Pay Express'],false,false,'BP FuelSave'),
  mk('wc07','Shell Century City','Shell','Century City','Western Cape',null,-33.893,18.513,22.53,22.10,25.35,24.98,'owner',1,'30m ago',95,['Shop','ATM','Coffee'],false,false,'Shell Go+'),
  mk('wc08','Engen Claremont','Engen','Claremont','Western Cape',null,-33.989,18.468,22.53,22.10,25.30,24.95,'confirmed',6,'45m ago',85,['Shop','Car wash','Woolworths'],false,false,'Engen 1-Card'),
  mk('wc09','Sasol Paarl N1','Sasol','Paarl','Western Cape','N1',-33.726,18.958,22.60,22.18,25.45,25.08,'confirmed',3,'2h ago',75,['Shop','ATM','Truck bay'],false,true),
  mk('wc10','BP Stellenbosch','BP','Stellenbosch','Western Cape',null,-33.936,18.860,22.53,22.10,25.12,24.77,'owner',1,'2h ago',95,['Car wash','Shop','Coffee'],false,false,'BP FuelSave'),
  mk('wc11','Shell Brackenfell N1','Shell','Brackenfell','Western Cape','N1',-33.864,18.687,22.53,22.10,25.35,24.98,'confirmed',4,'1h ago',82,['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('wc12','Engen Hout Bay','Engen','Hout Bay','Western Cape',null,-34.050,18.357,22.80,22.37,25.90,25.53,'single',1,'12h ago',30,['Shop'],false,false),
  mk('wc13','Astron Goodwood','Astron','Goodwood','Western Cape',null,-33.906,18.551,22.39,21.97,25.05,24.70,'single',2,'4h ago',38,['Car wash','Shop','FreshStop'],false,false),
  mk('wc14','BP Malmesbury N7','BP','Malmesbury','Western Cape','N7',-33.462,18.727,22.60,22.18,25.40,25.03,'confirmed',2,'5h ago',68,['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('wc15','Shell Milnerton','Shell','Milnerton','Western Cape',null,-33.869,18.494,22.53,22.10,25.35,24.98,'confirmed',3,'3h ago',75,['Shop','ATM','Car wash'],false,false,'Shell Go+'),
  mk('wc16','Engen Khayelitsha','Engen','Khayelitsha','Western Cape',null,-34.046,18.667,22.53,22.10,25.30,24.95,'single',2,'5h ago',40,['Shop'],false,false,'Engen 1-Card'),
  mk('wc17','BP Tygervalley','BP','Tygervalley','Western Cape',null,-33.877,18.629,22.53,22.10,25.10,24.75,'owner',1,'1h ago',95,['ATM','Shop','Pick n Pay Express','Car wash'],false,false,'BP FuelSave'),
  mk('wc18','Puma Kuilsrivier','Puma','Kuilsrivier','Western Cape',null,-33.932,18.683,22.39,21.97,25.05,24.70,'single',1,'6h ago',30,['Shop'],false,false),
  mk('wc19','Sasol Obs Cape Town','Sasol','Observatory','Western Cape',null,-33.937,18.472,22.40,21.99,25.08,24.73,'confirmed',4,'2h ago',80,['Shop'],false,false),
  // Garden Route N2
  mk('wc20','BP George','BP','George','Western Cape','N2',-33.963,22.461,22.53,22.10,25.20,24.85,'confirmed',3,'3h ago',75,['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('wc21','Shell Mossel Bay','Shell','Mossel Bay','Western Cape','N2',-34.185,22.141,22.53,22.10,25.35,24.98,'owner',1,'1h ago',95,['Shop','Restaurant','ATM'],false,false,'Shell Go+'),
  mk('wc22','Engen Knysna','Engen','Knysna','Western Cape','N2',-34.036,23.050,22.70,22.27,25.50,25.13,'single',1,'8h ago',30,['Shop'],false,false),
  mk('wc23','Sasol Swellendam','Sasol','Swellendam','Western Cape','N2',-34.023,20.444,22.53,22.10,25.35,24.98,'confirmed',2,'4h ago',68,['Shop','Truck bay'],false,true),
  mk('wc24','TotalEnergies Plettenberg Bay','TotalEnergies','Plettenberg Bay','Western Cape','N2',-34.058,23.373,22.80,22.37,25.65,25.28,'single',1,'6h ago',30,['Shop','Car wash'],false,false,'Total Rewards'),
  mk('wc25','BP Oudtshoorn','BP','Oudtshoorn','Western Cape','N12',-33.593,22.196,22.70,22.27,25.55,25.18,'confirmed',2,'5h ago',65,['Shop','ATM'],false,false,'BP FuelSave'),
  // N1 Corridor WC
  mk('wc26','Engen Worcester N1','Engen','Worcester','Western Cape','N1',-33.646,19.448,22.53,22.10,25.30,24.95,'confirmed',4,'2h ago',82,['Shop','ATM','Truck bay'],true,true,'Engen 1-Card'),
  mk('wc27','Shell Hex River Pass N1','Shell','Hex River Pass','Western Cape','N1',-33.476,19.602,22.53,22.10,25.35,24.98,'single',1,'6h ago',30,['Shop'],false,false,'Shell Go+'),
  mk('wc28','Astron Durbanville','Astron','Durbanville','Western Cape',null,-33.833,18.654,22.39,21.97,25.05,24.70,'single',2,'4h ago',38,['Shop','Car wash'],false,false),

  // ══ GAUTENG — Johannesburg ════════════════════════════════════════════════
  mk('gp01','BP Sandton City','BP','Sandton','Gauteng',null,-26.107,28.057,23.36,23.25,26.20,25.83,'owner',1,'30m ago',95,['Shop','ATM','Car wash','Wimpy'],false,false,'BP FuelSave'),
  mk('gp02','Shell Rosebank','Shell','Rosebank','Gauteng',null,-26.148,28.042,23.36,23.25,26.11,25.74,'confirmed',5,'1h ago',85,['Shop','Restaurant','ATM'],false,false,'Shell Go+'),
  mk('gp03','Engen Soweto','Engen','Soweto','Gauteng',null,-26.268,27.854,23.36,23.25,26.30,25.93,'confirmed',3,'2h ago',75,['Shop','ATM'],false,false,'Engen 1-Card'),
  mk('gp04','Sasol Fourways','Sasol','Fourways','Gauteng',null,-26.018,28.010,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',80,['Car wash','Shop'],false,false),
  mk('gp05','TotalEnergies Braamfontein','TotalEnergies','Braamfontein','Gauteng',null,-26.195,28.034,23.50,23.39,26.50,26.13,'single',1,'5h ago',30,['Shop'],false,false,'Total Rewards'),
  mk('gp06','BP Randburg','BP','Randburg','Gauteng',null,-26.092,27.996,23.36,23.25,26.15,25.78,'confirmed',3,'2h ago',75,['Car wash','ATM','Shop'],false,false,'BP FuelSave'),
  mk('gp07','Astron Boksburg','Astron','Boksburg','Gauteng',null,-26.214,28.261,23.60,23.49,27.20,26.83,'disputed',2,'4h ago',25,['Shop','Truck bay'],false,true),
  mk('gp08','Shell Edenvale','Shell','Edenvale','Gauteng',null,-26.136,28.156,23.36,23.25,26.11,25.74,'owner',1,'1h ago',95,['Shop','ATM'],false,false,'Shell Go+'),
  mk('gp09','Engen Roodepoort','Engen','Roodepoort','Gauteng',null,-26.163,27.873,23.36,23.25,26.20,25.83,'confirmed',4,'3h ago',80,['Shop','Car wash'],false,false,'Engen 1-Card'),
  mk('gp10','BP Kempton Park','BP','Kempton Park','Gauteng',null,-26.111,28.229,23.36,23.25,26.30,25.93,'confirmed',3,'2h ago',75,['Car wash','ATM','Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('gp11','Sasol Alberton','Sasol','Alberton','Gauteng',null,-26.267,28.122,23.36,23.25,26.11,25.74,'single',2,'6h ago',40,['Shop'],false,false),
  mk('gp12','TotalEnergies Krugersdorp','TotalEnergies','Krugersdorp','Gauteng',null,-26.082,27.770,23.50,23.39,26.45,26.08,'single',1,'7h ago',30,['Shop','Car wash'],false,false,'Total Rewards'),
  mk('gp13','BP Alexandra','BP','Alexandra','Gauteng',null,-26.101,28.086,23.36,23.25,26.11,25.74,'single',2,'4h ago',40,['Shop'],false,false,'BP FuelSave'),
  mk('gp14','Shell Soweto Highway','Shell','Soweto','Gauteng',null,-26.237,27.921,23.36,23.25,26.20,25.83,'confirmed',3,'3h ago',72,['Shop','ATM'],false,false,'Shell Go+'),
  mk('gp15','Engen Midrand','Engen','Midrand','Gauteng',null,-25.996,28.122,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',82,['Shop','ATM','Truck bay'],false,true,'Engen 1-Card'),
  mk('gp16','Sasol Benoni','Sasol','Benoni','Gauteng',null,-26.188,28.318,23.50,23.39,26.40,26.03,'single',1,'6h ago',30,['Shop'],false,false),
  mk('gp17','Puma Germiston','Puma','Germiston','Gauteng',null,-26.219,28.172,23.45,23.34,26.35,25.98,'single',1,'5h ago',30,['Shop'],false,false),
  // Pretoria
  mk('gp18','Shell Hatfield','Shell','Hatfield','Gauteng',null,-25.748,28.230,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',82,['Shop','ATM'],false,false,'Shell Go+'),
  mk('gp19','BP Menlyn','BP','Menlyn','Gauteng',null,-25.782,28.277,23.36,23.25,26.20,25.83,'owner',1,'2h ago',95,['Car wash','ATM','Shop','Wimpy'],false,false,'BP FuelSave'),
  mk('gp20','Engen Centurion N1','Engen','Centurion','Gauteng','N1',-25.849,28.189,23.36,23.25,26.11,25.74,'confirmed',5,'45m ago',87,['Shop','Truck bay','ATM'],true,true,'Engen 1-Card'),
  mk('gp21','Sasol Silverton','Sasol','Silverton','Gauteng',null,-25.736,28.308,23.50,23.39,26.40,26.03,'single',1,'5h ago',30,['Shop'],false,false),
  mk('gp22','BP Lynnwood','BP','Lynnwood','Gauteng',null,-25.763,28.264,23.36,23.25,26.15,25.78,'confirmed',3,'2h ago',75,['Car wash','Shop'],false,false,'BP FuelSave'),
  mk('gp23','TotalEnergies Soshanguve','TotalEnergies','Soshanguve','Gauteng',null,-25.526,28.102,23.80,23.69,27.20,26.83,'single',1,'8h ago',30,['Shop','ATM'],false,false,'Total Rewards'),

  // ══ KZN — Durban Metro ════════════════════════════════════════════════════
  mk('kzn01','BP Umhlanga','BP','Umhlanga','KwaZulu-Natal',null,-29.725,31.078,22.53,22.10,25.15,24.80,'owner',1,'1h ago',95,['Shop','ATM','Car wash','Pick n Pay Express'],false,false,'BP FuelSave'),
  mk('kzn02','Shell Berea','Shell','Berea','KwaZulu-Natal',null,-29.856,31.000,22.53,22.10,25.35,24.98,'confirmed',4,'2h ago',80,['Shop','Restaurant','ATM'],false,false,'Shell Go+'),
  mk('kzn03','Engen Pinetown','Engen','Pinetown','KwaZulu-Natal',null,-29.818,30.864,22.53,22.10,25.20,24.85,'confirmed',3,'3h ago',75,['Shop','Truck bay'],false,true,'Engen 1-Card'),
  mk('kzn04','Sasol Phoenix','Sasol','Phoenix','KwaZulu-Natal',null,-29.679,31.005,22.53,22.10,25.35,24.98,'single',1,'6h ago',30,['Shop'],false,false),
  mk('kzn05','BP Chatsworth','BP','Chatsworth','KwaZulu-Natal',null,-29.900,30.932,22.53,22.10,25.30,24.95,'confirmed',3,'2h ago',75,['Car wash','ATM','Shop'],false,false,'BP FuelSave'),
  mk('kzn06','Engen Ballito N2','Engen','Ballito','KwaZulu-Natal','N2',-29.538,31.210,22.53,22.10,25.20,24.85,'owner',1,'1h ago',95,['Shop','Restaurant','ATM'],true,false,'Engen 1-Card'),
  mk('kzn07','Astron Tongaat N2','Astron','Tongaat','KwaZulu-Natal','N2',-29.570,31.119,22.53,22.10,25.50,25.13,'confirmed',2,'4h ago',68,['Shop','Truck bay'],false,true),
  mk('kzn08','TotalEnergies Westville','TotalEnergies','Westville','KwaZulu-Natal',null,-29.842,30.931,22.80,22.37,25.80,25.43,'single',1,'5h ago',30,['Shop','Car wash'],false,false,'Total Rewards'),
  mk('kzn09','Shell Richards Bay N2','Shell','Richards Bay','KwaZulu-Natal','N2',-28.763,32.059,22.60,22.17,25.45,25.08,'confirmed',3,'4h ago',72,['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('kzn10','BP Umlazi','BP','Umlazi','KwaZulu-Natal',null,-29.979,30.890,22.53,22.10,25.30,24.95,'single',2,'5h ago',40,['Shop'],false,false,'BP FuelSave'),
  // N3
  mk('kzn11','Shell Pietermaritzburg N3','Shell','Pietermaritzburg','KwaZulu-Natal','N3',-29.616,30.393,23.10,22.98,26.00,25.63,'confirmed',3,'2h ago',75,['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('kzn12','BP Ladysmith N3','BP','Ladysmith','KwaZulu-Natal','N3',-28.556,29.780,23.36,23.25,26.11,25.74,'confirmed',2,'4h ago',68,['Shop','ATM','Truck bay'],true,true,'BP FuelSave'),
  mk('kzn13','Engen Harrismith N3','Engen','Harrismith','KwaZulu-Natal','N3',-28.274,29.125,23.36,23.25,26.20,25.83,'owner',1,'2h ago',95,['Shop','Restaurant','Truck bay'],true,true,'Engen 1-Card'),
  mk('kzn14','Sasol Mooi River N3','Sasol','Mooi River','KwaZulu-Natal','N3',-29.215,30.001,23.10,22.98,26.00,25.63,'single',1,'8h ago',30,['Shop','Truck bay'],false,true),
  mk('kzn15','TotalEnergies Estcourt N3','TotalEnergies','Estcourt','KwaZulu-Natal','N3',-29.017,29.882,23.10,22.98,26.00,25.63,'single',1,'6h ago',30,['Shop','ATM'],false,false,'Total Rewards'),

  // ══ EASTERN CAPE ══════════════════════════════════════════════════════════
  mk('ec01','BP Gqeberha N2','BP','Gqeberha (PE)','Eastern Cape','N2',-33.961,25.596,22.53,22.10,25.35,24.98,'confirmed',4,'2h ago',80,['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('ec02','Shell East London N2','Shell','East London','Eastern Cape','N2',-32.996,27.909,22.70,22.27,25.50,25.13,'confirmed',3,'3h ago',75,['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('ec03','Engen Humansdorp N2','Engen','Humansdorp','Eastern Cape','N2',-34.029,24.772,22.70,22.27,25.50,25.13,'confirmed',2,'4h ago',68,['Shop','ATM','Truck bay'],false,true,'Engen 1-Card'),
  mk('ec04','BP Mthatha N2','BP','Mthatha','Eastern Cape','N2',-31.587,28.784,23.10,22.98,26.00,25.63,'single',1,'6h ago',30,['Shop','ATM'],false,false,'BP FuelSave'),
  mk('ec05','Sasol Grahamstown','Sasol','Makhanda','Eastern Cape',null,-33.307,26.530,22.70,22.27,25.55,25.18,'single',1,'8h ago',30,['Shop'],false,false),
  mk('ec06','TotalEnergies Storms River N2','TotalEnergies','Storms River','Eastern Cape','N2',-33.987,23.900,22.80,22.37,25.70,25.33,'single',1,'10h ago',30,['Shop','Restaurant'],false,false,'Total Rewards'),

  // ══ FREE STATE ════════════════════════════════════════════════════════════
  mk('fs01','TotalEnergies Bloemfontein N1','TotalEnergies','Bloemfontein','Free State','N1',-29.121,26.214,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',82,['Shop','Restaurant','ATM','Truck bay'],true,true,'Total Rewards'),
  mk('fs02','Engen Colesberg N1','Engen','Colesberg','Free State','N1',-30.723,25.088,23.36,23.25,26.20,25.83,'confirmed',3,'3h ago',75,['Shop','Restaurant','Truck bay'],true,true,'Engen 1-Card'),
  mk('fs03','BP Three Sisters N1','BP','Three Sisters','Free State','N1',-31.823,23.056,23.50,23.39,26.30,25.93,'confirmed',3,'3h ago',75,['Shop','Restaurant','Truck bay'],true,true,'BP FuelSave'),
  mk('fs04','Shell Welkom','Shell','Welkom','Free State',null,-27.978,26.734,23.36,23.25,26.11,25.74,'confirmed',2,'5h ago',68,['Shop','ATM'],false,false,'Shell Go+'),
  mk('fs05','Sasol Kroonstad','Sasol','Kroonstad','Free State',null,-27.653,27.232,23.36,23.25,26.20,25.83,'single',1,'6h ago',30,['Shop'],false,false),
  mk('fs06','BP Springfontein N1','BP','Springfontein','Free State','N1',-30.250,25.730,23.50,23.39,26.35,25.98,'single',1,'8h ago',30,['Shop','Truck bay'],false,true,'BP FuelSave'),

  // ══ LIMPOPO ═══════════════════════════════════════════════════════════════
  mk('lp01','Shell Polokwane N1','Shell','Polokwane','Limpopo','N1',-23.905,29.469,23.80,23.69,27.00,26.63,'confirmed',3,'4h ago',72,['Shop','ATM','Truck bay'],true,true,'Shell Go+'),
  mk('lp02','BP Louis Trichardt N1','BP','Louis Trichardt','Limpopo','N1',-23.044,29.904,23.80,23.69,27.10,26.73,'confirmed',2,'5h ago',65,['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('lp03','Engen Mokopane','Engen','Mokopane','Limpopo',null,-24.193,28.963,23.80,23.69,27.00,26.63,'single',1,'8h ago',30,['Shop'],false,false,'Engen 1-Card'),
  mk('lp04','TotalEnergies Tzaneen','TotalEnergies','Tzaneen','Limpopo',null,-23.833,30.158,23.80,23.69,27.10,26.73,'single',1,'10h ago',30,['Shop','ATM'],false,false,'Total Rewards'),

  // ══ MPUMALANGA ════════════════════════════════════════════════════════════
  mk('mp01','BP Mbombela N4','BP','Mbombela','Mpumalanga','N4',-25.465,30.985,23.50,23.39,26.50,26.13,'confirmed',3,'3h ago',75,['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('mp02','Shell eMalahleni N4','Shell','eMalahleni','Mpumalanga','N4',-25.871,29.233,23.36,23.25,26.20,25.83,'confirmed',3,'4h ago',72,['Shop','Truck bay'],false,true,'Shell Go+'),
  mk('mp03','Engen Hazyview','Engen','Hazyview','Mpumalanga',null,-25.044,31.124,23.60,23.49,26.60,26.23,'single',1,'8h ago',30,['Shop'],false,false,'Engen 1-Card'),
  mk('mp04','Sasol Middelburg MP','Sasol','Middelburg','Mpumalanga',null,-25.778,29.462,23.50,23.39,26.40,26.03,'single',2,'6h ago',40,['Shop','ATM'],false,false),

  // ══ NORTH WEST ════════════════════════════════════════════════════════════
  mk('nw01','BP Rustenburg N14','BP','Rustenburg','North West','N14',-25.669,27.245,23.50,23.39,26.40,26.03,'confirmed',2,'5h ago',65,['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('nw02','Shell Klerksdorp','Shell','Klerksdorp','North West',null,-26.872,26.656,23.36,23.25,26.20,25.83,'single',1,'8h ago',30,['Shop'],false,false,'Shell Go+'),
  mk('nw03','Engen Mahikeng','Engen','Mahikeng','North West',null,-25.870,25.642,23.50,23.39,26.40,26.03,'single',1,'10h ago',30,['Shop','ATM'],false,false,'Engen 1-Card'),

  // ══ NORTHERN CAPE ═════════════════════════════════════════════════════════
  mk('nc01','BP Kimberley N12','BP','Kimberley','Northern Cape','N12',-28.738,24.762,23.50,23.39,26.35,25.98,'confirmed',2,'5h ago',65,['Shop','ATM'],false,false,'BP FuelSave'),
  mk('nc02','Shell Upington N14','Shell','Upington','Northern Cape','N14',-28.461,21.257,23.60,23.49,26.50,26.13,'single',1,'10h ago',30,['Shop','Truck bay'],false,true,'Shell Go+'),
  mk('nc03','Engen Beaufort West N1','Engen','Beaufort West','Northern Cape','N1',-32.356,22.586,23.36,23.25,26.20,25.83,'owner',1,'2h ago',95,['Shop','ATM','Restaurant','Truck bay'],true,true,'Engen 1-Card'),

  // ══ HIGHWAYS — N1 CT → JHB ════════════════════════════════════════════════
  mk('hw01','BP Hex River Pass N1','BP','Hex River Pass','Highway','N1',-33.476,19.602,22.80,22.37,25.60,25.23,'single',1,'6h ago',30,['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw02','Shell Beaufort West N1','Shell','Beaufort West','Highway','N1',-32.356,22.586,23.36,23.25,26.20,25.83,'owner',1,'2h ago',95,['Shop','ATM','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('hw03','Engen Three Sisters N1','Engen','Three Sisters','Highway','N1',-31.823,23.056,23.50,23.39,26.30,25.93,'confirmed',3,'3h ago',75,['Shop','Restaurant','Truck bay'],true,true,'Engen 1-Card'),
  mk('hw04','TotalEnergies Trompsburg N1','TotalEnergies','Trompsburg','Highway','N1',-30.020,25.770,23.60,23.49,26.50,26.13,'single',1,'10h ago',30,['Shop','Truck bay'],false,true,'Total Rewards'),
  mk('hw05','Sasol Colesberg N1','Sasol','Colesberg','Highway','N1',-30.723,25.088,23.36,23.25,26.20,25.83,'confirmed',3,'3h ago',75,['Shop','Restaurant','Truck bay'],true,true),
  mk('hw06','BP Ventersburg N1','BP','Ventersburg','Highway','N1',-28.088,27.133,23.36,23.25,26.11,25.74,'single',1,'5h ago',30,['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw07','Engen JHB South N1','Engen','JHB South','Highway','N1',-26.337,27.919,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',82,['Shop','ATM','Truck bay','Restaurant'],true,true,'Engen 1-Card'),
  // N3 JHB → Durban
  mk('hw08','BP Heidelberg N3','BP','Heidelberg','Highway','N3',-26.499,28.356,23.36,23.25,26.11,25.74,'confirmed',2,'4h ago',68,['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw09','Shell Villiers N3','Shell','Villiers','Highway','N3',-27.038,28.602,23.36,23.25,26.20,25.83,'single',1,'8h ago',30,['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('hw10','Engen Van Reenen N3','Engen','Van Reenen Pass','Highway','N3',-28.367,29.368,23.36,23.25,26.11,25.74,'owner',1,'1h ago',95,['Shop','Truck bay'],true,true,'Engen 1-Card'),
  // N2 CT → Durban
  mk('hw11','BP Riviersonderend N2','BP','Riviersonderend','Highway','N2',-34.138,19.889,22.70,22.27,25.55,25.18,'single',1,'7h ago',30,['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw12','Shell Storms River N2','Shell','Storms River','Highway','N2',-33.987,23.900,22.80,22.37,25.70,25.33,'single',1,'10h ago',30,['Shop','Restaurant'],false,false,'Shell Go+'),
  mk('hw13','TotalEnergies Kokstad N2','TotalEnergies','Kokstad','Highway','N2',-30.548,29.428,23.10,22.98,26.00,25.63,'single',1,'8h ago',30,['Shop','Truck bay'],false,true,'Total Rewards'),
  // N4 Pretoria → Maputo
  mk('hw14','Shell eMalahleni N4','Shell','eMalahleni','Highway','N4',-25.778,29.462,23.50,23.39,26.40,26.03,'confirmed',2,'5h ago',65,['Shop','Truck bay'],false,true,'Shell Go+'),
  mk('hw15','BP Komatipoort N4','BP','Komatipoort','Highway','N4',-25.428,31.944,23.60,23.49,26.60,26.23,'single',1,'8h ago',30,['Shop','Truck bay'],false,true,'BP FuelSave'),
]
