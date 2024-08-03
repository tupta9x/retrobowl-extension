import React, { useState, useEffect } from 'react';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { FaBars, FaTimes, FaSearch, FaExpand, FaStar } from 'react-icons/fa';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const [games, setGames] = useState<Game[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/antrachhuynh/retrogames/main/src/data.json');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fixedGame = {
    id: 0,
    name: 'Retrobowl',
    description: 'Play Retrobowl online!',
    thumb: 'https://example.com/thumb.png',
    link: 'https://retrobowl-unblocked.github.io/new/index.html',
  };

  const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const suggestions = games.slice(0, 3);

  const openFullscreenURL = () => {
    window.open('https://retrobowl.me', '_blank', 'fullscreen=yes');
  };

  const openExtensionRateLink = () => {
    const extensionId = chrome.runtime.id;
    const extensionRateLink = `https://chrome.google.com/webstore/detail/${extensionId}/reviews`;
    window.open(extensionRateLink, '_blank');
  };

  return (
    <div className="App" style={{ backgroundColor: theme === 'light' ? '#fff' : '#000' }}>
      <button className={`menu-toggle ${showMenu ? 'open' : ''}`} onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`game-menu ${showMenu ? 'visible' : ''}`}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search games..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>

        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <div key={game.id} className="game-card">
              <img src={game.thumb} alt={game.name} />
              <h2>
                <a href={game.link} target="_blank" rel="noopener noreferrer">
                  {game.name}
                </a>
              </h2>
            </div>
          ))
        ) : (
          <div className="no-results">
            No games found.
            <div className="suggestions">
              <p>Suggested Games:</p>
              {suggestions.map(game => (
                <div key={game.id} className="suggestion-item">
                  <img src={game.thumb} alt={game.name} />
                  <a href={game.link} target="_blank" rel="noopener noreferrer">
                    {game.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="iframe-container">
        <iframe src={fixedGame.link} title={fixedGame.name} frameBorder="0" />
      </div>

      <div className="action-buttons">
        <button onClick={openFullscreenURL}>
          <FaExpand />
        </button>
        <button onClick={openExtensionRateLink}>
          <FaStar />
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading...</div>), <div>Error Occurred</div>);
