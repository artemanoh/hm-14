import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const inputField = document.querySelector('#search-box');
const listContainer = document.querySelector('.country-list');
const infoContainer = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(handleInput, 500));

function handleInput(event) {
  const inputValue = event.target.value.trim();
  clearResults();

  if (!inputValue) return;

  fetchCountries(inputValue)
    .then(countryArray => {
      if (countryArray.length > 10) {
        info({ text: 'Забагато збігів. Введи назву країни точніше' });
        return;
      }

      if (countryArray.length > 1) {
        listContainer.innerHTML = countryArray
          .map(
            countryItem => `
              <li>
                <img src="${countryItem.flags.svg}" alt="Прапор ${countryItem.name}" width="30" style="vertical-align: middle; margin-right: 10px; border: 1px solid #ddd; border-radius: 3px;" />
                <span>${countryItem.name}</span>
              </li>
            `
          )
          .join('');
        return;
      }

      const countryDetails = countryArray[0];
      infoContainer.innerHTML = `
        <h2>${countryDetails.name}</h2>
        <p><b>Столиця:</b> ${countryDetails.capital}</p>
        <p><b>Населення:</b> ${countryDetails.population.toLocaleString()}</p>
        <p><b>Мови:</b> ${countryDetails.languages.map(language => language.name).join(', ')}</p>
        <img src="${countryDetails.flags.svg}" alt="Прапор ${countryDetails.name}" width="100" />
      `;
    })
    .catch(() => {
      clearResults();
      error({ text: 'Країну не знайдено' });
    });
}

function clearResults() {
  listContainer.innerHTML = '';
  infoContainer.innerHTML = '';
}
