import React, { useState } from 'react';
import './App.css';
import logo from './dictionary.png';

function App() {
  const [word, setWord] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const searchWord = async (e) => {
    e.preventDefault();
    if (!word) return;

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      const json = await res.json();

      if (json.title === "No Definitions Found") {
        setError('Word not found!');
        setData(null);
      } else {
        setData(json[0]);
        setError('');
      }
    } catch (err) {
      setError('Something went wrong!');
      setData(null);
    }
  };

  return (
    <div className='App'>
      <h1><img src={logo} alt="Logo" style={{ height: '40px', verticalAlign: 'middle' }} /> Dictionary</h1>

      <form onSubmit={searchWord}>
        <input
          type='text'
          placeholder='Type a word...'
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className='error'>{error}</p>}

      {data && (
        <div className='result'>
          <h2>{data.word}</h2>

          {data.phonetics.find(p => p.audio) && (
            <audio controls>
              <source src={data.phonetics.find(p => p.audio).audio} type='audio/mpeg' />
            </audio>
          )}

          {data.meanings.map((meaning, idx) => (
            <div key={idx} className="meaning-block">
              <h3>{meaning.partOfSpeech}</h3>
              <ul>
                {meaning.definitions.map((def, i) => (
                  <li key={i}>
                    <strong>Definition:</strong> {def.definition} <br />
                    {def.example && (
                      <em><strong>Example:</strong> "{def.example}"</em>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;