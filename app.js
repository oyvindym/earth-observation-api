'use strict';

import AstroDigital from './endpoints/AstroDigital';
import DigitalGlobe from './endpoints/DigitalGlobe';
import ECHO from './endpoints/ECHO';
import PlanetLabs from './endpoints/PlanetLabs';
import SciHub from './endpoints/SciHub';
import UrtheCast from './endpoints/UrtheCast';

const endpoints = [
  AstroDigital,
  DigitalGlobe,
  ECHO,
  PlanetLabs,
  SciHub,
  UrtheCast,
];

const location = process.argv[2] !== undefined ? process.argv[2]: 'sanFrancisco';
const daysAgo = 180;
const maxCloudCoverage = 10;

console.log('Scanning endpoints with configuration:');
console.log('Location:', location);
console.log('Days ago:', daysAgo);
console.log(`Max cloud coverage: ${maxCloudCoverage}%`);
console.log('');

endpoints.forEach(endpoint => {
  endpoint.init({location, daysAgo, maxCloudCoverage}).run();
});
