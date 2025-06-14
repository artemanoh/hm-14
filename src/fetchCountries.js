export default function fetchCountries(name) {
  return fetch(`https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response => response.ok ? response.json() : [])
    .catch(() => []);
}
