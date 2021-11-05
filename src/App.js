import fetch from 'node-fetch';
import React, {useState, useEffect} from 'react';
import './App.scss';
import Species from './Species';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

// ------------------------------------------
// HELPERS
// ------------------------------------------

const fetchData = (url) => new Promise(resolve => {
  fetch(url)
    .then(response => response.json())
    .then(response => {
      resolve(response)
    })
});

const dataFormatter = data => {
  const {
    name,
    classification,
    designation,
    average_height,
    language,
    films
  } = data;
  const numFilms = films ? films.length : 0;
  const heightInInches = Math.round(average_height / CM_TO_IN_CONVERSION_RATIO);
  const inchesString = `${heightInInches}\"`
  const actualHeight = average_height === "n/a" ? 'N/A' : inchesString
  const imgString = Object.keys(SPECIES_IMAGES).filter(x => {
    return name ? name.toLowerCase().includes(x) : true;
  })[0];
  return {
    name,
    classification,
    designation,
    height: actualHeight,
    image: SPECIES_IMAGES[imgString],
    numFilms,
    language,
  }
}

// ------------------------------------------
// COMPONENTS
// ------------------------------------------

function App() {
  const [speciesData, setSpeciesData] = useState([])

  useEffect(() => {
    fetchData(API_URL)
      .then(response => {
        Promise.all(response.species.map(specie => fetchData(specie)))
          .then(responseArray => {
            setSpeciesData(responseArray)
          })
      });
  }, []);
    
  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {speciesData.map((specieData, i) => {
          const {
            name,
            classification,
            designation,
            height,
            image,
            numFilms,
            language,
          } = dataFormatter(specieData);

          return (
            <Species
              key={name}
              name={name || '...'}
              classification={classification || '...'}
              designation={designation || '...'}
              height={height || '...'}
              image={image}
              numFilms={numFilms}
              language={language || '...'}
            />
          )
        })}
      </div>
    </div>
  );
}

export default App;
