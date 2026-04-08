import { OfficialPrices, Station } from './types'

export const OFFICIAL_PRICES: OfficialPrices = {
  coast: { '95 ULP': 22.53, '93 ULP': 22.10, 'Diesel 50ppm': 25.35, 'Diesel 500ppm': 24.98 },
  inland: { '95 ULP': 23.36, '93 ULP': 23.25, 'Diesel 50ppm': 26.11, 'Diesel 500ppm': 25.74 },
}

export const FUEL_TYPES = ['95 ULP', '93 ULP', 'Diesel 50ppm', 'Diesel 500ppm'] as const
export const PROVINCES = ['All provinces', 'Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Highway'] as const
export type Province = typeof PROVINCES[number]

export const BRAND_COLORS: Record<string, { bg: string; text: string; short: string; color: string }> = {
  BP:            { bg: 'bg-green-100',  text: 'text-green-800',  short: 'BP', color: '#009900' },
  Shell:         { bg: 'bg-yellow-100', text: 'text-yellow-800', short: 'SH', color: '#FFD700' },
  Engen:         { bg: 'bg-red-100',    text: 'text-red-800',    short: 'EN', color: '#E30613' },
  Caltex:        { bg: 'bg-blue-100',   text: 'text-blue-800',   short: 'CA', color: '#003087' },
  Sasol:         { bg: 'bg-purple-100', text: 'text-purple-800', short: 'SA', color: '#00A0E2' },
  TotalEnergies: { bg: 'bg-pink-100',   text: 'text-pink-800',   short: 'TE', color: '#C8102E' },
  Astron:        { bg: 'bg-orange-100', text: 'text-orange-800', short: 'AS', color: '#FF6B00' },
}

function mk(
  id: string, name: string, brand: string, area: string, province: string, highway: string | null,
  lat: number, lng: number,
  p95: number, p93: number, pD50: number, pD500: number,
  trust: 'owner'|'confirmed'|'single'|'disputed', reports: number, age: string,
  amenities: string[], open24: boolean, isTruck: boolean, loyalty?: string
): Station {
  return {
    id, name, brand, area, address: area, province, highway,
    lat, lng, dist: 0, open24, isTruck,
    hasLoyalty: !!loyalty, loyaltyName: loyalty, amenities,
    prices: { '95 ULP': p95, '93 ULP': p93, 'Diesel 50ppm': pD50, 'Diesel 500ppm': pD500 },
    trust: { level: trust, reports, age, low: { 'Diesel 50ppm': pD50 }, high: { 'Diesel 50ppm': pD50 } },
  }
}

export const STATIONS: Station[] = [
  // ── WESTERN CAPE — Cape Metro ─────────────────────────────────────────────
  mk('wc01','BP Helderberg','BP','Somerset West','Western Cape',null,-34.0820,18.8510,22.53,22.10,25.09,24.74,'owner',1,'1h ago',['Car wash','ATM','Shop'],false,false,'BP FuelSave'),
  mk('wc02','Sasol Main Road','Sasol','Somerset West','Western Cape',null,-34.0833,18.8490,22.39,21.98,25.07,24.72,'confirmed',5,'2h ago',['Car wash','Shop'],false,false),
  mk('wc03','Shell Somerset Mall','Shell','Somerset West','Western Cape',null,-34.0760,18.8430,23.90,23.40,26.80,26.40,'confirmed',3,'3h ago',['Shop','Restaurant','ATM'],true,false,'Shell Go+'),
  mk('wc04','Engen Sir Lowrys Pass','Engen',"Sir Lowry's Pass",'Western Cape','N2',-34.1050,18.9100,22.53,22.10,25.20,24.88,'single',1,'6h ago',['Shop','ATM','Restaurant','Truck bay'],true,true,'Engen 1-Card'),
  mk('wc05','TotalEnergies Gordons Bay','TotalEnergies',"Gordon's Bay",'Western Cape',null,-34.1560,18.8660,26.50,26.10,31.50,31.00,'single',1,'8h ago',['Shop','Restaurant'],false,false,'Total Rewards'),
  mk('wc06','BP Bellville','BP','Bellville','Western Cape',null,-33.8990,18.6300,22.53,22.10,25.15,24.80,'confirmed',4,'1h ago',['Car wash','ATM','Shop'],false,false,'BP FuelSave'),
  mk('wc07','Shell Century City','Shell','Century City','Western Cape',null,-33.8930,18.5130,22.53,22.10,25.35,24.98,'owner',1,'30m ago',['Shop','ATM'],false,false,'Shell Go+'),
  mk('wc08','Engen Claremont','Engen','Claremont','Western Cape',null,-33.9890,18.4680,22.53,22.10,25.30,24.95,'confirmed',6,'45m ago',['Shop','Car wash'],false,false,'Engen 1-Card'),
  mk('wc09','Sasol Paarl N1','Sasol','Paarl','Western Cape','N1',-33.7260,18.9580,22.60,22.18,25.45,25.08,'confirmed',3,'2h ago',['Shop','ATM','Truck bay'],false,true),
  mk('wc10','BP Stellenbosch','BP','Stellenbosch','Western Cape',null,-33.9360,18.8600,22.53,22.10,25.12,24.77,'owner',1,'2h ago',['Car wash','Shop'],false,false,'BP FuelSave'),
  mk('wc11','Shell Brackenfell N1','Shell','Brackenfell','Western Cape','N1',-33.8640,18.6870,22.53,22.10,25.35,24.98,'confirmed',4,'1h ago',['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('wc12','Engen Hout Bay','Engen','Hout Bay','Western Cape',null,-34.0500,18.3570,22.80,22.37,25.90,25.53,'single',1,'12h ago',['Shop'],false,false),
  mk('wc13','Astron Energy Goodwood','Astron','Goodwood','Western Cape',null,-33.9060,18.5510,22.39,21.97,25.05,24.70,'single',2,'4h ago',['Car wash','Shop'],false,false),
  mk('wc14','BP Malmesbury N7','BP','Malmesbury','Western Cape','N7',-33.4620,18.7270,22.60,22.18,25.40,25.03,'confirmed',2,'5h ago',['Shop','Truck bay'],false,true,'BP FuelSave'),

  // ── WESTERN CAPE — Garden Route N2 ───────────────────────────────────────
  mk('wc15','BP George','BP','George','Western Cape','N2',-33.9630,22.4610,22.53,22.10,25.20,24.85,'confirmed',3,'3h ago',['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('wc16','Shell Mossel Bay','Shell','Mossel Bay','Western Cape','N2',-34.1850,22.1410,22.53,22.10,25.35,24.98,'owner',1,'1h ago',['Shop','Restaurant','ATM'],false,false,'Shell Go+'),
  mk('wc17','Engen Knysna','Engen','Knysna','Western Cape','N2',-34.0360,23.0500,22.70,22.27,25.50,25.13,'single',1,'8h ago',['Shop'],false,false),
  mk('wc18','Sasol Swellendam','Sasol','Swellendam','Western Cape','N2',-34.0230,20.4440,22.53,22.10,25.35,24.98,'confirmed',2,'4h ago',['Shop','Truck bay'],false,true),
  mk('wc19','TotalEnergies Plettenberg Bay','TotalEnergies','Plettenberg Bay','Western Cape','N2',-34.0580,23.3730,22.80,22.37,25.65,25.28,'single',1,'6h ago',['Shop','Car wash'],false,false,'Total Rewards'),

  // ── WESTERN CAPE — N1 Corridor ────────────────────────────────────────────
  mk('wc20','Engen Worcester N1','Engen','Worcester','Western Cape','N1',-33.6460,19.4480,22.53,22.10,25.30,24.95,'confirmed',4,'2h ago',['Shop','ATM','Truck bay'],true,true,'Engen 1-Card'),
  mk('wc21','Shell Hex River N1','Shell','Hex River Pass','Western Cape','N1',-33.4760,19.6020,22.53,22.10,25.35,24.98,'single',1,'6h ago',['Shop'],false,false,'Shell Go+'),
  mk('wc22','BP Touws River','BP','Touws River','Western Cape','N1',-33.3340,20.0260,22.80,22.37,25.60,25.23,'single',1,'8h ago',['Shop','Truck bay'],false,true,'BP FuelSave'),

  // ── GAUTENG — Johannesburg ────────────────────────────────────────────────
  mk('gp01','BP Sandton','BP','Sandton','Gauteng',null,-26.1070,28.0570,23.36,23.25,26.20,25.83,'owner',1,'30m ago',['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('gp02','Shell Rosebank','Shell','Rosebank','Gauteng',null,-26.1480,28.0420,23.36,23.25,26.11,25.74,'confirmed',5,'1h ago',['Shop','Restaurant','ATM'],false,false,'Shell Go+'),
  mk('gp03','Engen Soweto','Engen','Soweto','Gauteng',null,-26.2680,27.8540,23.36,23.25,26.30,25.93,'confirmed',3,'2h ago',['Shop','ATM'],false,false,'Engen 1-Card'),
  mk('gp04','Sasol Fourways','Sasol','Fourways','Gauteng',null,-26.0180,28.0100,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',['Car wash','Shop'],false,false),
  mk('gp05','TotalEnergies Braamfontein','TotalEnergies','Braamfontein','Gauteng',null,-26.1950,28.0340,23.50,23.39,26.50,26.13,'single',1,'5h ago',['Shop'],false,false,'Total Rewards'),
  mk('gp06','BP Randburg','BP','Randburg','Gauteng',null,-26.0920,27.9960,23.36,23.25,26.15,25.78,'confirmed',3,'2h ago',['Car wash','ATM','Shop'],false,false,'BP FuelSave'),
  mk('gp07','Caltex Boksburg','Caltex','Boksburg','Gauteng',null,-26.2140,28.2610,23.60,23.49,27.20,26.83,'disputed',2,'4h ago',['Shop','Truck bay'],false,true),
  mk('gp08','Shell Edenvale','Shell','Edenvale','Gauteng',null,-26.1360,28.1560,23.36,23.25,26.11,25.74,'owner',1,'1h ago',['Shop','ATM'],false,false,'Shell Go+'),
  mk('gp09','Engen Roodepoort','Engen','Roodepoort','Gauteng',null,-26.1630,27.8730,23.36,23.25,26.20,25.83,'confirmed',4,'3h ago',['Shop','Car wash'],false,false,'Engen 1-Card'),
  mk('gp10','BP Kempton Park','BP','Kempton Park','Gauteng',null,-26.1110,28.2290,23.36,23.25,26.30,25.93,'confirmed',3,'2h ago',['Car wash','ATM','Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('gp11','Sasol Alberton','Sasol','Alberton','Gauteng',null,-26.2670,28.1220,23.36,23.25,26.11,25.74,'single',2,'6h ago',['Shop'],false,false),
  mk('gp12','TotalEnergies Krugersdorp','TotalEnergies','Krugersdorp','Gauteng',null,-26.0820,27.7700,23.50,23.39,26.45,26.08,'single',1,'7h ago',['Shop','Car wash'],false,false,'Total Rewards'),

  // ── GAUTENG — Pretoria / Tshwane ──────────────────────────────────────────
  mk('gp13','Shell Hatfield','Shell','Hatfield','Gauteng',null,-25.7480,28.2300,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',['Shop','ATM'],false,false,'Shell Go+'),
  mk('gp14','BP Menlyn','BP','Menlyn','Gauteng',null,-25.7820,28.2770,23.36,23.25,26.20,25.83,'owner',1,'2h ago',['Car wash','ATM','Shop'],false,false,'BP FuelSave'),
  mk('gp15','Engen Centurion N1','Engen','Centurion','Gauteng','N1',-25.8490,28.1890,23.36,23.25,26.11,25.74,'confirmed',5,'45m ago',['Shop','Truck bay','ATM'],true,true,'Engen 1-Card'),
  mk('gp16','Sasol Silverton','Sasol','Silverton','Gauteng',null,-25.7360,28.3080,23.50,23.39,26.40,26.03,'single',1,'5h ago',['Shop'],false,false),

  // ── KZN — Durban Metro ────────────────────────────────────────────────────
  mk('kzn01','BP Umhlanga','BP','Umhlanga','KwaZulu-Natal',null,-29.7250,31.0780,22.53,22.10,25.15,24.80,'owner',1,'1h ago',['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('kzn02','Shell Berea','Shell','Berea','KwaZulu-Natal',null,-29.8560,31.0000,22.53,22.10,25.35,24.98,'confirmed',4,'2h ago',['Shop','Restaurant','ATM'],false,false,'Shell Go+'),
  mk('kzn03','Engen Pinetown','Engen','Pinetown','KwaZulu-Natal',null,-29.8180,30.8640,22.53,22.10,25.20,24.85,'confirmed',3,'3h ago',['Shop','Truck bay'],false,true,'Engen 1-Card'),
  mk('kzn04','Sasol Phoenix','Sasol','Phoenix','KwaZulu-Natal',null,-29.6790,31.0050,22.53,22.10,25.35,24.98,'single',1,'6h ago',['Shop'],false,false),
  mk('kzn05','TotalEnergies Westville','TotalEnergies','Westville','KwaZulu-Natal',null,-29.8420,30.9310,22.80,22.37,25.80,25.43,'single',1,'5h ago',['Shop','Car wash'],false,false,'Total Rewards'),
  mk('kzn06','BP Chatsworth','BP','Chatsworth','KwaZulu-Natal',null,-29.9000,30.9320,22.53,22.10,25.30,24.95,'confirmed',3,'2h ago',['Car wash','ATM','Shop'],false,false,'BP FuelSave'),
  mk('kzn07','Engen Ballito N2','Engen','Ballito','KwaZulu-Natal','N2',-29.5380,31.2100,22.53,22.10,25.20,24.85,'owner',1,'1h ago',['Shop','Restaurant','ATM'],true,false,'Engen 1-Card'),
  mk('kzn08','Caltex Tongaat N2','Caltex','Tongaat','KwaZulu-Natal','N2',-29.5700,31.1190,22.53,22.10,25.50,25.13,'confirmed',2,'4h ago',['Shop','Truck bay'],false,true),

  // ── KZN — N3 Corridor ────────────────────────────────────────────────────
  mk('kzn09','Shell Pietermaritzburg N3','Shell','Pietermaritzburg','KwaZulu-Natal','N3',-29.6160,30.3930,23.10,22.98,26.00,25.63,'confirmed',3,'2h ago',['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('kzn10','BP Ladysmith N3','BP','Ladysmith','KwaZulu-Natal','N3',-28.5560,29.7800,23.36,23.25,26.11,25.74,'confirmed',2,'4h ago',['Shop','ATM','Truck bay'],true,true,'BP FuelSave'),
  mk('kzn11','Engen Harrismith N3','Engen','Harrismith','KwaZulu-Natal','N3',-28.2740,29.1250,23.36,23.25,26.20,25.83,'owner',1,'2h ago',['Shop','Restaurant','Truck bay'],true,true,'Engen 1-Card'),
  mk('kzn12','Sasol Mooi River N3','Sasol','Mooi River','KwaZulu-Natal','N3',-29.2150,30.0010,23.10,22.98,26.00,25.63,'single',1,'8h ago',['Shop','Truck bay'],false,true),

  // ── NATIONAL HIGHWAYS — N1 (CT to JHB) ───────────────────────────────────
  mk('hw01','Shell Beaufort West N1','Shell','Beaufort West','Highway','N1',-32.3560,22.5860,23.36,23.25,26.20,25.83,'owner',1,'2h ago',['Shop','ATM','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('hw02','Engen Three Sisters N1','Engen','Three Sisters','Highway','N1',-31.8230,23.0560,23.50,23.39,26.30,25.93,'confirmed',3,'3h ago',['Shop','Restaurant','Truck bay'],true,true,'Engen 1-Card'),
  mk('hw03','BP Touws River N1','BP','Touws River','Highway','N1',-33.3340,20.0260,23.50,23.39,26.40,26.03,'single',1,'6h ago',['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw04','TotalEnergies Bloemfontein N1','TotalEnergies','Bloemfontein','Highway','N1',-29.1210,26.2140,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',['Shop','Restaurant','ATM','Truck bay'],true,true,'Total Rewards'),
  mk('hw05','Sasol Colesberg N1','Sasol','Colesberg','Highway','N1',-30.7230,25.0880,23.36,23.25,26.20,25.83,'confirmed',3,'3h ago',['Shop','Restaurant','Truck bay'],true,true),
  mk('hw06','Engen Trompsburg N1','Engen','Trompsburg','Highway','N1',-30.0200,25.7700,23.60,23.49,26.50,26.13,'single',1,'10h ago',['Shop','Truck bay'],false,true,'Engen 1-Card'),
  mk('hw07','BP Ventersburg N1','BP','Ventersburg','Highway','N1',-28.0880,27.1330,23.36,23.25,26.11,25.74,'single',1,'5h ago',['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw08','Shell JHB South N1','Shell','Johannesburg South','Gauteng','N1',-26.3370,27.9190,23.36,23.25,26.11,25.74,'confirmed',4,'1h ago',['Shop','ATM','Truck bay'],true,true,'Shell Go+'),

  // ── NATIONAL HIGHWAYS — N3 (JHB to Durban) ───────────────────────────────
  mk('hw09','BP Heidelberg N3','BP','Heidelberg','Highway','N3',-26.4990,28.3560,23.36,23.25,26.11,25.74,'confirmed',2,'4h ago',['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw10','Shell Villiers N3','Shell','Villiers','Highway','N3',-27.0380,28.6020,23.36,23.25,26.20,25.83,'single',1,'8h ago',['Shop','Restaurant','Truck bay'],true,true,'Shell Go+'),
  mk('hw11','Engen Van Reenen N3','Engen','Van Reenen Pass','Highway','N3',-28.3670,29.3680,23.36,23.25,26.11,25.74,'owner',1,'1h ago',['Shop','Truck bay'],true,true,'Engen 1-Card'),
  mk('hw12','Sasol Estcourt N3','Sasol','Estcourt','Highway','N3',-29.0170,29.8820,23.10,22.98,26.00,25.63,'single',1,'6h ago',['Shop','ATM'],false,false),

  // ── NATIONAL HIGHWAYS — N2 (CT to Durban) ────────────────────────────────
  mk('hw13','BP Riviersonderend N2','BP','Riviersonderend','Highway','N2',-34.1380,19.8890,22.70,22.27,25.55,25.18,'single',1,'7h ago',['Shop','Truck bay'],false,true,'BP FuelSave'),
  mk('hw14','Shell Storms River N2','Shell','Storms River','Highway','N2',-33.9870,23.9000,22.80,22.37,25.70,25.33,'single',1,'10h ago',['Shop','Restaurant'],false,false,'Shell Go+'),
  mk('hw15','Engen Humansdorp N2','Engen','Humansdorp','Highway','N2',-34.0290,24.7720,22.70,22.27,25.50,25.13,'confirmed',2,'4h ago',['Shop','ATM','Truck bay'],false,true,'Engen 1-Card'),
  mk('hw16','BP Gqeberha N2','BP','Gqeberha (PE)','Highway','N2',-33.9610,25.5960,22.53,22.10,25.35,24.98,'confirmed',4,'2h ago',['Shop','ATM','Car wash'],false,false,'BP FuelSave'),
  mk('hw17','TotalEnergies East London N2','TotalEnergies','East London','Highway','N2',-32.9960,27.9090,22.70,22.27,25.50,25.13,'confirmed',3,'3h ago',['Shop','Restaurant','Truck bay'],true,true,'Total Rewards'),
  mk('hw18','Engen Kokstad N2','Engen','Kokstad','Highway','N2',-30.5480,29.4280,23.10,22.98,26.00,25.63,'single',1,'8h ago',['Shop','Truck bay'],false,true,'Engen 1-Card'),
]
