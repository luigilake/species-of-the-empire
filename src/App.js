import fetch from 'node-fetch';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
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

const SpecieCardList = styled.div`
  display: flex;
  align-items: stretch;
`;

const SpeciesCard = ({ url }) => {
  const [specieData, setSpecieData] = useState({});
  const {
    name,
    classification,
    designation,
    average_height,
    language,
    films
  } = specieData;
  const numFilms = films ? films.length : 0;
  const heightInInches = Math.round(average_height / CM_TO_IN_CONVERSION_RATIO);
  const inchesString = `${heightInInches}\"`
  const actualHeight = average_height === "n/a" ? 'N/A' : inchesString
  const imgString = Object.keys(SPECIES_IMAGES).filter(x => {
    return name ? name.toLowerCase().includes(x) : true;
  })[0];

  const fetchSpecieData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSpecieData(data);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchSpecieData()
  }, [url]);

  return (
    <Species 
      name={name || '...'}
      classification={classification || '...'}
      designation={designation || '...'}
      height={actualHeight || '...'}
      image={SPECIES_IMAGES[imgString]}
      numFilms={numFilms}
      language={language || '...'}
    />
  )
}

function App() {
  const [speciesData, setSpeciesData] = useState([])

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSpeciesData(data.species);
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
        <SpecieCardList className="App-species">
          {speciesData.map((url, i) => {
            return <SpeciesCard url={url} key={i}/>
          })}
        </SpecieCardList>
      </div>
    );
}

export default App;
