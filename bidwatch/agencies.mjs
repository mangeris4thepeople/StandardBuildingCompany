// Agencies pulled by name from BidNet Direct (Rocky Mountain E-Purchasing System).
// Each entry is [display name, BidNet URL slug, region]. A slug that returns no rows is
// reported in the digest's coverage section, so a wrong or retired slug is visible.
export const AGENCIES = [
  ['Larimer County', 'larimer-county', 'Northern Colorado'],
  ['City of Fort Collins', 'city-of-fort-collins', 'Northern Colorado'],
  ['City of Loveland', 'city-of-loveland', 'Northern Colorado'],
  ['City of Greeley', 'city-of-greeley', 'Northern Colorado'],
  ['Weld County', 'weld-county', 'Northern Colorado'],
  ['Poudre School District', 'poudre-school-district', 'Northern Colorado'],
  ['Colorado State University', 'colorado-state-university', 'Northern Colorado'],
  ['Loveland Housing Authority', 'lovelandhousingauthority', 'Northern Colorado'],
  ['City of Longmont', 'city-of-longmont', 'Northern Colorado'],
  ['City of Boulder', 'city-of-boulder', 'Northern Colorado'],
  ['Boulder County', 'boulder-county', 'Northern Colorado'],
  ['Town of Lyons', 'town-of-lyons', 'Northern Colorado'],
  ['Boulder Valley School District', 'boulder-valley-school-district', 'Northern Colorado'],
  ['City of Louisville', 'city-of-louisville', 'Northern Colorado'],
  ['Town of Windsor', 'town-of-windsor', 'Northern Colorado'],
  ['Town of Estes Park', 'town-of-estes-park', 'Northern Colorado'],
  ['Eagle County', 'eagle-county', 'Mountain Towns'],
  ['Town of Vail', 'town-of-vail', 'Mountain Towns'],
  ['Town of Avon', 'town-of-avon', 'Mountain Towns'],
  ['Pitkin County', 'pitkin-county', 'Mountain Towns'],
  ['City of Aspen', 'city-of-aspen', 'Mountain Towns'],
  ['Summit County', 'summit-county', 'Mountain Towns'],
  ['Grand County', 'grand-county', 'Mountain Towns'],
  ['Town of Winter Park', 'town-of-winter-park', 'Mountain Towns'],
  ['Routt County', 'routt-county', 'Mountain Towns'],
  ['City of Steamboat Springs', 'city-of-steamboat-springs', 'Mountain Towns'],
];

export const INCLUDE = ['construction', 'reconstruct', 'renovation', 'remodel', 'rehabilit', 'restoration', 'roof', 'masonry', 'concrete', 'paving', 'pavement', 'asphalt', 'crack seal', 'sidewalk', 'curb', 'gutter', 'trail', 'bridge', 'road', 'street light', 'lighting', 'electrical', 'low voltage', 'cabling', 'generator', 'hvac', 'mechanical', 'air unit', 'makeup air', 'plumbing', 'fire alarm', 'fire suppression', 'sprinkler', 'elevator', 'flooring', 'painting', 'glazing', 'window', 'door', 'envelope', 'waterproof', 'casework', 'millwork', 'carpentry', 'sign', 'monument', 'demolition', 'debris', 'grading', 'sitework', 'earthwork', 'utility', 'water main', 'sewer', 'drainage', 'expansion', 'addition', 'upgrade', 'replacement', 'improvement', 'build', 'facility', 'tenant finish', 'landfill', 'telemetry', 'refresh', 'development', 'restroom', 'playground', 'park', 'athletic field', 'court', 'pool', 'hangar', 'shelter', 'pavilion'];

export const EXCLUDE = ['food service', 'inmate food', 'produce', 'commissary', 'underwriting', 'insurance', 'google licensing', 'fundraising', 'pest control', 'grazing', 'auction', 'child welfare', 'counselor', 'records management', 'electronic monitoring', 'armored car', 'rfqs are posted', 'lubricants', 'notice of final settlement', 'risk assessment', 'traffic study', 'forest service', 'janitorial', 'uniform', 'towing', 'banking', 'legal counsel', 'staffing', 'translation'];
