// Where each government in the Standard Building Company service area posts bids.
// Regions: 'Northern Colorado', 'Mountain Towns', 'State of Colorado'.

// BidNet Direct (Rocky Mountain E-Purchasing System) agency pages: [name, slug, region].
export const BIDNET = [
  ['Larimer County', 'larimer-county', 'Northern Colorado'],
  ['Weld County', 'weld-county', 'Northern Colorado'],
  ['Boulder County', 'boulder-county', 'Northern Colorado'],
  ['City of Loveland', 'city-of-loveland', 'Northern Colorado'],
  ['City of Fort Collins', 'city-of-fort-collins', 'Northern Colorado'],
  ['City of Greeley', 'city-of-greeley', 'Northern Colorado'],
  ['City of Longmont', 'city-of-longmont', 'Northern Colorado'],
  ['City of Evans', 'city-of-evans', 'Northern Colorado'],
  ['Town of Windsor', 'townofwindsor', 'Northern Colorado'],
  ['Town of Berthoud', 'town-of-berthoud', 'Northern Colorado'],
  ['Town of Timnath', 'town-of-timnath', 'Northern Colorado'],
  ['Town of Milliken', 'town-of-milliken', 'Northern Colorado'],
  ['Town of Severance', 'town-of-severance', 'Northern Colorado'],
  ['Town of Mead', 'town-of-mead', 'Northern Colorado'],
  ['Town of Estes Park', 'town-of-estes-park', 'Northern Colorado'],
  ['Loveland Housing Authority', 'lovelandhousingauthority', 'Northern Colorado'],
  ['Poudre School District', 'poudre-school-district', 'Northern Colorado'],
  ['Greeley-Evans School District 6', 'weld-county-school-district-6', 'Northern Colorado'],
  ['Aims Community College', 'aimscommunitycollege', 'Northern Colorado'],
  ['Berthoud Fire Protection District', 'berthoud-fire-protection-district', 'Northern Colorado'],
  ['Berthoud Community Library District', 'berthoudcommunitylibrarydistrict', 'Northern Colorado'],
  ['Pitkin County', 'pitkin-county', 'Mountain Towns'],
  ['City of Aspen', 'city-of-aspen', 'Mountain Towns'],
  ['Aspen School District', 'aspenschooldistrict', 'Mountain Towns'],
  ['Town of Avon', 'townofavon', 'Mountain Towns'],
  ['Summit County', 'summitcounty', 'Mountain Towns'],
  ['Summit School District', 'summit-school-district', 'Mountain Towns'],
  ['Grand County', 'grand-county', 'Mountain Towns'],
  ['Town of Winter Park', 'town-of-winter-park', 'Mountain Towns'],
  ['Routt County', 'routtco', 'Mountain Towns'],
  ['City of Steamboat Springs', 'cityofsteamboatsprings', 'Mountain Towns'],
  ['Colorado State University', 'colorado-state-university', 'State of Colorado'],
  ['CDOT Property Management', 'colorado-department-of-transportation', 'State of Colorado'],
  ['CDOT Construction & Engineering Services', 'cdotconstructionengineeringservices', 'State of Colorado'],
];

// Names in BidNet's participating-agency directory that place an agency in the service area.
// Any directory agency whose name matches is added automatically (fire, water, library, school districts and so on).
export const AREA_WORDS = {
  'Northern Colorado': ['larimer', 'weld', 'loveland', 'fort collins', 'greeley', 'longmont', 'windsor', 'berthoud', 'johnstown', 'timnath', 'wellington', 'estes', 'milliken', 'evans', 'severance', 'laporte', 'masonville', 'mead', 'poudre', 'thompson', 'st. vrain', 'st vrain', 'aims community'],
  'Mountain Towns': ['eagle', 'vail', 'avon', 'beaver creek', 'edwards', 'pitkin', 'aspen', 'snowmass', 'roaring fork', 'summit county', 'summit school', 'frisco', 'copper', 'dillon', 'silverthorne', 'grand county', 'winter park', 'fraser', 'granby', 'routt', 'steamboat', 'yampa', 'hayden'],
};

// Towns and counties that post on their own CivicPlus "Bids.aspx" page: [name, url, region].
export const CIVICPLUS = [
  ['Town of Berthoud', 'https://www.berthoud.org/Bids.aspx', 'Northern Colorado'],
  ['Town of Johnstown', 'https://www.johnstownco.gov/Bids.aspx', 'Northern Colorado'],
  ['Town of Wellington', 'https://www.wellingtoncolorado.gov/Bids.aspx', 'Northern Colorado'],
  ['Town of Milliken', 'https://www.millikenco.gov/Bids.aspx', 'Northern Colorado'],
  ['Town of Severance', 'https://www.townofseverance.org/Bids.aspx', 'Northern Colorado'],
  ['Pitkin County', 'https://pitkincounty.com/Bids.aspx', 'Mountain Towns'],
  ['City of Aspen', 'https://www.aspen.gov/Bids.aspx', 'Mountain Towns'],
  ['Town of Avon', 'https://www.avon.org/Bids.aspx', 'Mountain Towns'],
  ['Grand County', 'https://www.co.grand.co.us/Bids.aspx', 'Mountain Towns'],
  ['Routt County', 'https://www.co.routt.co.us/Bids.aspx', 'Mountain Towns'],
  ['City of Steamboat Springs', 'https://steamboatsprings.net/Bids.aspx', 'Mountain Towns'],
];

// Other pages that list bids as links: [name, url, region, link pattern].
export const LINK_PAGES = [
  ['Summit County', 'https://www.summitcountyco.gov/how_do_i/apply_for/bid_postings.php', 'Mountain Towns', 'bid_detail_'],
  ['Summit County Road & Bridge', 'https://www.summitcountyco.gov/services/public_works/road_bridge/r_b_bids.php', 'Mountain Towns', 'bid_detail_'],
];

// Governments whose bid sites block automated visitors. Listed in every digest so the gap is visible.
export const NOT_COVERED = [
  'Town of Vail (vail.gov blocks automated access)',
  'Eagle County (eaglecounty.us blocks automated access)',
  'Town of Frisco, near Copper Mountain (friscogov.com blocks automated access)',
  'Thompson School District (no public bid list found)',
  'CDOT highway lettings on Bid Express (subscription site)',
];

export const INCLUDE = ['construction', 'construct', 'reconstruct', 'renovation', 'remodel', 'rehabilit', 'restoration', 'repair', 'roof', 'masonry', 'concrete', 'paving', 'pavement', 'asphalt', 'overlay', 'crack seal', 'sidewalk', 'curb', 'gutter', 'trail', 'bridge', 'road', 'street', 'lighting', 'electrical', 'low voltage', 'cabling', 'generator', 'hvac', 'mechanical', 'boiler', 'air unit', 'makeup air', 'plumbing', 'fire alarm', 'fire suppression', 'sprinkler', 'elevator', 'flooring', 'carpet', 'painting', 'paint', 'stain', 'glazing', 'window', 'door', 'envelope', 'waterproof', 'casework', 'cabinetry', 'millwork', 'carpentry', 'monument', 'demolition', 'grading', 'sitework', 'site work', 'earthwork', 'excavat', 'utility', 'water main', 'water line', 'sewer', 'drainage', 'storm', 'culvert', 'expansion', 'addition', 'upgrade', 'replacement', 'improvement', 'build', 'facility', 'tenant finish', 'interior finish', 'landfill', 'restroom', 'playground', 'park', 'athletic field', 'court', 'pool', 'hangar', 'shelter', 'pavilion', 'fence', 'fencing', 'retaining wall', 'steel', 'structural', 'modular', 'garage', 'shop', 'barn', 'warehouse', 'library', 'station', 'housing', 'design-build', 'design build', 'cm/gc', 'cmgc', 'general contractor', 'construction manager', 'job order contract', 'rockfall', 'guardrail', 'snow storage', 'refresh'];

export const EXCLUDE = ['food service', 'inmate food', 'produce', 'commissary', 'underwriting', 'insurance', 'licensing', 'fundraising', 'pest control', 'grazing', 'auction', 'child welfare', 'counselor', 'records management', 'electronic monitoring', 'armored car', 'rfqs are posted', 'lubricants', 'notice of final settlement', 'final settlement', 'risk assessment', 'traffic study', 'janitorial', 'uniform', 'towing', 'banking', 'legal counsel', 'staffing', 'translation', 'software', 'erp', 'advertising', 'audit', 'financing', 'compensation study', 'wellness', 'fiscal agent', 'moving services', 'web developer', 'vehicle purchase', 'fuel', 'cleaning services', 'security services', 'consulting services for', 'survey of', 'printing', 'notice of settlement', 'meals', '(food)', 'egg order', 'vehicle', 'optic', 'strategy', 'education', 'behavioral', '(personal svcs)', 'chemical', 'tire', 'motel', 'furniture', 'housing action plan', 'housing needs', 'comprehensive plan'];
