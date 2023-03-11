import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

function clearMarkup() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}

function countrySearch(e) {
  const queryName = e.target.value.trim();
  if (!queryName) {
    clearMarkup();
    return;
  }
  fetchCountries(queryName)
    .then(data => {
      if (data.length === 1) {
        clearMarkup();
        infoEl.innerHTML = createInfo(data);
      }
      if (data.length >= 2 && data.length <= 10) {
        clearMarkup();
        listEl.innerHTML = createList(data);
      }
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearMarkup();
      return error;
    });
}
function createInfo(data) {
  const markup = data
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class='country-item'><img class='country-flag' src="${
        flags.svg
      }" alt="${flags.alt}" width="35" height="25"><h2>${name.common}</h2></div>
            <h3><b>Capital: </b>${capital}</h3>
            <h3><b>Population: </b>${population}</h3>
            <h3><b>Languages: </b>${Object.values(languages)}</h3>`;
    })
    .join('');
  return markup;
}

function createList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li class='country-item'><img class='country-flag' src="${flags.svg}" alt="${flags.alt}" width="25" height="15"><span>${name.common}</span></li>`;
    })
    .join('');
  return markup;
}
