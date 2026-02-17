import React, { useState } from 'react';

const CharacterSelection = () => {
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const maxSelection = 1;  // Changed from 2 to 1 - only select one character

  const characters = [
    {
      id: 1,
      name: 'The Warrior',
      description: 'Strong and brave, master of combat',
      image: './m1.png'  // PNG with transparent background
    },
    {
      id: 2,
      name: 'The Mage',
      description: 'Wielder of ancient magic and wisdom',
      image: './m2.png'  // PNG with transparent background
    }
  ];

  const handleCardClick = (characterId) => {
    if (selectedCharacters.includes(characterId)) {
      // Deselect
      setSelectedCharacters(selectedCharacters.filter(id => id !== characterId));
    } else if (selectedCharacters.length < maxSelection) {
      // Select
      setSelectedCharacters([...selectedCharacters, characterId]);
    }
  };

  const handleContinue = () => {
    alert(`You selected characters: ${selectedCharacters.join(', ')}\n\nReady to begin!`);
    // Here you can navigate to the next page or perform any action
  };

  const isCardDisabled = (characterId) => {
    return selectedCharacters.length === maxSelection && !selectedCharacters.includes(characterId);
  };

  return (
    <div style={styles.body}>
      {/* Background with blur */}
      <div style={styles.background}>
        <div style={styles.backgroundOverlay}></div>
      </div>

      {/* Selection counter */}
      <div style={styles.selectionCounter}>
        Selected: <span>{selectedCharacters.length}</span> / 1
      </div>

      {/* Main container */}
      <div style={styles.container}>
        <h1 style={styles.h1}>Choose Your Character</h1>
        <p style={styles.subtitle}>Select 1 character to begin your adventure</p>

        <div style={styles.characterGrid}>
          {characters.map((character) => (
            <div
              key={character.id}
              style={{
                ...styles.characterCard,
                ...(selectedCharacters.includes(character.id) && styles.characterCardSelected),
                ...(isCardDisabled(character.id) && styles.characterCardDisabled)
              }}
              onClick={() => handleCardClick(character.id)}
            >
              <span 
                style={{
                  ...styles.selectionBadge,
                  ...(selectedCharacters.includes(character.id) && styles.selectionBadgeVisible)
                }}
              >
                Selected ✓
              </span>
              
              {/* Image wrapper with semi-transparent background */}
              <div style={styles.imageWrapper}>
                <img 
                  src={character.image} 
                  alt={character.name} 
                  style={styles.characterImage}
                />
              </div>
              
              <div style={styles.characterName}>{character.name}</div>
              <div style={styles.characterDescription}>{character.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <button
        style={{
          ...styles.continueBtn,
          ...(selectedCharacters.length === maxSelection && styles.continueBtnShow)
        }}
        onClick={handleContinue}
      >
        Continue →
      </button>

      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflowX: 'hidden',
    scrollBehavior: 'smooth',
    height: '100vh',
    position: 'relative'
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    backgroundImage: "url('./bcg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.1)'
  },
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    position: 'relative'
  },
  h1: {
    color: 'white',
    fontSize: '3rem',
    marginBottom: '1rem',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
    animation: 'fadeInDown 0.8s ease-out'
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: '1.2rem',
    marginBottom: '3rem',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
    animation: 'fadeInDown 0.8s ease-out 0.2s both'
  },
  characterGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4rem',  // Increased from 2rem to 4rem - more space between cards
    maxWidth: '800px',  // Increased to accommodate bigger cards
    width: '100%',
    animation: 'fadeInUp 0.8s ease-out 0.4s both'
  },
  characterCard: {
    background: 'rgba(255, 255, 255, 0.05)',  // More transparent
    backdropFilter: 'blur(5px)',
    borderRadius: '20px',
    padding: '20px',  // Increased padding
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    width: '220px',  // Increased from 180px to 220px - bigger cards
    flexShrink: 0
  },
  characterCardSelected: {
    borderColor: '#4CAF50',
    background: 'rgba(76, 175, 80, 0.2)',
    transform: 'scale(1.05)'
  },
  characterCardDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  // Wrapper with NO background - fully transparent
  imageWrapper: {
    width: '100%',
    height: '280px',  // Increased from 240px to 280px - taller images
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '15px',
    marginBottom: '0.8rem',
    overflow: 'hidden',
    position: 'relative'
  },
  characterImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'transform 0.4s ease'
  },
  characterName: {
    color: 'white',
    fontSize: '1.4rem',  // Increased from 1.2rem
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    marginBottom: '0.4rem'
  },
  characterDescription: {
    color: '#e0e0e0',
    textAlign: 'center',
    fontSize: '0.85rem',  // Increased from 0.75rem
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    lineHeight: '1.3'
  },
  selectionBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#4CAF50',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    opacity: 0,
    transform: 'scale(0)',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    zIndex: 10
  },
  selectionBadgeVisible: {
    opacity: 1,
    transform: 'scale(1)'
  },
  selectionCounter: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '15px 25px',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    zIndex: 100,
    animation: 'fadeInDown 0.8s ease-out 0.6s both'
  },
  continueBtn: {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%) scale(0)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '18px 50px',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    zIndex: 100
  },
  continueBtnShow: {
    transform: 'translateX(-50%) scale(1)'
  }
};

export default CharacterSelection;