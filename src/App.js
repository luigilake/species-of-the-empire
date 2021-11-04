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

const transformData = data => {
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
    language
  }
}

const specie = function(data) {
  const {
    name,
    classification,
    designation,
    height,
    image,
    numFilms,
    language,
  } = transformData(data)
  this.name = name;
  this.classification = classification;
  this.designation = designation;
  this.height = height;
  this.image = image;
  this.numFilms = numFilms;
  this.language = language;
};

specie.prototype.getFormattedData = function () {
  return {
    name: this.name,
    classification: this.classification,
    designation: this.designation,
    height: this.height,
    image: this.image,
    numFilms: this.numFilms,
    language: this.language,
  };
};

function App() {
  const [speciesData, setSpeciesData] = useState([])

  const fetchIndvSpeciesData = (urls) => {
    const accumulated = [];
    const urlsLenght = urls.length;
    urls.forEach(async url => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log({url, data})
        accumulated.push(new specie(data))
        if (accumulated.length === urlsLenght) {
          setSpeciesData(accumulated);
        }
      } catch (e) {
        console.log(e)
      }
    });
  }

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      fetchIndvSpeciesData(data.species)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {speciesData.map(indvSpecie => {
          const {
            name,
            classification,
            designation,
            height,
            image,
            numFilms,
            language,
          } = indvSpecie.getFormattedData();
          return <Species 
            key={name}
            name={name || '...'}
            classification={classification || '...'}
            designation={designation || '...'}
            height={height || '...'}
            image={image}
            numFilms={numFilms}
            language={language || '...'}
          />
        })}
      </div>
    </div>
  );
}

export default App;
