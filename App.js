import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  Modal,
  StatusBar,
  BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Game Levels - ALL 50 LEVELS
const gameLevels = [
  // Beginner 1-10
  { level: 1, name: "Beginner 1", target: 10, numbers: 2, numbersPool: [1,2,3,4,5], coins: 5 },
  { level: 2, name: "Beginner 2", target: 15, numbers: 2, numbersPool: [1,2,3,4,5,6], coins: 5 },
  { level: 3, name: "Beginner 3", target: 20, numbers: 2, numbersPool: [2,3,4,5,6,7], coins: 5 },
  { level: 4, name: "Beginner 4", target: 25, numbers: 2, numbersPool: [3,4,5,6,7,8], coins: 5 },
  { level: 5, name: "Beginner 5", target: 30, numbers: 2, numbersPool: [4,5,6,7,8,9], coins: 5 },
  { level: 6, name: "Beginner 6", target: 35, numbers: 3, numbersPool: [1,2,3,4,5,6], coins: 8 },
  { level: 7, name: "Beginner 7", target: 40, numbers: 3, numbersPool: [2,3,4,5,6,7], coins: 8 },
  { level: 8, name: "Beginner 8", target: 45, numbers: 3, numbersPool: [3,4,5,6,7,8], coins: 8 },
  { level: 9, name: "Beginner 9", target: 50, numbers: 3, numbersPool: [4,5,6,7,8,9], coins: 8 },
  { level: 10, name: "Beginner 10", target: 60, numbers: 3, numbersPool: [5,6,7,8,9,10], coins: 8 },
  
  // Explorer 11-20
  { level: 11, name: "Explorer 1", target: 75, numbers: 3, numbersPool: [6,7,8,9,10,12], coins: 12 },
  { level: 12, name: "Explorer 2", target: 90, numbers: 3, numbersPool: [7,8,9,10,12,15], coins: 12 },
  { level: 13, name: "Explorer 3", target: 100, numbers: 4, numbersPool: [4,5,6,7,8,9], coins: 12 },
  { level: 14, name: "Explorer 4", target: 120, numbers: 4, numbersPool: [5,6,7,8,9,10], coins: 12 },
  { level: 15, name: "Explorer 5", target: 150, numbers: 4, numbersPool: [6,7,8,9,10,12], coins: 12 },
  { level: 16, name: "Explorer 6", target: 180, numbers: 4, numbersPool: [7,8,9,10,12,15], coins: 12 },
  { level: 17, name: "Explorer 7", target: 200, numbers: 4, numbersPool: [8,9,10,12,15,20], coins: 12 },
  { level: 18, name: "Explorer 8", target: 240, numbers: 4, numbersPool: [9,10,12,15,20,25], coins: 12 },
  { level: 19, name: "Explorer 9", target: 300, numbers: 4, numbersPool: [10,12,15,20,25,30], coins: 12 },
  { level: 20, name: "Explorer 10", target: 360, numbers: 4, numbersPool: [12,15,20,25,30,36], coins: 12 },
  
  // Strategist 21-30
  { level: 21, name: "Strategist 1", target: 420, numbers: 4, numbersPool: [15,20,25,30,35,42], coins: 18 },
  { level: 22, name: "Strategist 2", target: 500, numbers: 4, numbersPool: [20,25,30,35,40,50], coins: 18 },
  { level: 23, name: "Strategist 3", target: 600, numbers: 4, numbersPool: [25,30,35,40,50,60], coins: 18 },
  { level: 24, name: "Strategist 4", target: 720, numbers: 4, numbersPool: [30,35,40,45,60,72], coins: 18 },
  { level: 25, name: "Strategist 5", target: 840, numbers: 4, numbersPool: [35,40,45,50,70,84], coins: 18 },
  { level: 26, name: "Strategist 6", target: 1000, numbers: 5, numbersPool: [40,50,60,70,80,100], coins: 18 },
  { level: 27, name: "Strategist 7", target: 1200, numbers: 5, numbersPool: [50,60,70,80,90,120], coins: 18 },
  { level: 28, name: "Strategist 8", target: 1500, numbers: 5, numbersPool: [60,70,80,90,100,150], coins: 18 },
  { level: 29, name: "Strategist 9", target: 1800, numbers: 5, numbersPool: [70,80,90,100,120,180], coins: 18 },
  { level: 30, name: "Strategist 10", target: 2000, numbers: 5, numbersPool: [80,90,100,120,150,200], coins: 18 },
  
  // Master 31-40
  { level: 31, name: "Master 1", target: 2500, numbers: 5, numbersPool: [100,120,150,200,250], coins: 25 },
  { level: 32, name: "Master 2", target: 3000, numbers: 5, numbersPool: [120,150,200,250,300], coins: 25 },
  { level: 33, name: "Master 3", target: 3600, numbers: 5, numbersPool: [150,200,250,300,360], coins: 25 },
  { level: 34, name: "Master 4", target: 4200, numbers: 5, numbersPool: [200,250,300,350,420], coins: 25 },
  { level: 35, name: "Master 5", target: 5000, numbers: 5, numbersPool: [250,300,400,500], coins: 25 },
  { level: 36, name: "Master 6", target: 6000, numbers: 5, numbersPool: [300,400,500,600], coins: 25 },
  { level: 37, name: "Master 7", target: 7200, numbers: 5, numbersPool: [400,500,600,720], coins: 25 },
  { level: 38, name: "Master 8", target: 8400, numbers: 5, numbersPool: [500,600,700,840], coins: 25 },
  { level: 39, name: "Master 9", target: 10000, numbers: 5, numbersPool: [600,700,800,1000], coins: 25 },
  { level: 40, name: "Master 10", target: 12000, numbers: 5, numbersPool: [700,800,900,1200], coins: 25 },
  
  // Impossible 41-50
  { level: 41, name: "Impossible 1", target: 15000, numbers: 5, numbersPool: [800,1000,1200,1500], coins: 50 },
  { level: 42, name: "Impossible 2", target: 18000, numbers: 5, numbersPool: [900,1200,1500,1800], coins: 50 },
  { level: 43, name: "Impossible 3", target: 20000, numbers: 5, numbersPool: [1000,1500,2000], coins: 50 },
  { level: 44, name: "Impossible 4", target: 25000, numbers: 5, numbersPool: [1200,1800,2500], coins: 50 },
  { level: 45, name: "Impossible 5", target: 30000, numbers: 5, numbersPool: [1500,2000,3000], coins: 50 },
  { level: 46, name: "Impossible 6", target: 36000, numbers: 5, numbersPool: [1800,2400,3600], coins: 50 },
  { level: 47, name: "Impossible 7", target: 42000, numbers: 5, numbersPool: [2000,3000,4200], coins: 50 },
  { level: 48, name: "Impossible 8", target: 50000, numbers: 5, numbersPool: [2500,3500,5000], coins: 50 },
  { level: 49, name: "Impossible 9", target: 60000, numbers: 5, numbersPool: [3000,4000,6000], coins: 50 },
  { level: 50, name: "Impossible 10", target: 75000, numbers: 5, numbersPool: [3500,5000,7500], coins: 50 }
];

const MathGApp = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [equation, setEquation] = useState([]);
  const [usedNumbers, setUsedNumbers] = useState([]);
  const [playerCoins, setPlayerCoins] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [theme, setTheme] = useState('default');
  const [splashVisible, setSplashVisible] = useState(true);
  const [achievementData, setAchievementData] = useState({ title: '', desc: '', coins: 0 });
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGameProgress();
    
    // Splash screen animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start(() => {
      setSplashVisible(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    if (showSettings) {
      setShowSettings(false);
      return true;
    }
    if (showLevels) {
      setShowLevels(false);
      return true;
    }
    return false;
  };

  const loadGameProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('mathGameProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        setCurrentLevel(progress.level || 0);
        setPlayerCoins(progress.coins || 100);
        setTheme(progress.settings?.theme || 'default');
      }
    } catch (error) {
      console.error('Error loading game progress:', error);
    }
  };

  const saveGameProgress = async () => {
    try {
      const progress = {
        level: currentLevel,
        coins: playerCoins,
        settings: { theme },
        timestamp: Date.now()
      };
      await AsyncStorage.setItem('mathGameProgress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving game progress:', error);
    }
  };

  const addCoins = (amount) => {
    setPlayerCoins(prev => {
      const newCoins = prev + amount;
      setTimeout(saveGameProgress, 0);
      return newCoins;
    });
  };

  const addToEquation = (value) => {
    const currentLevelData = gameLevels[currentLevel];
    
    if (typeof value === 'number') {
      if (usedNumbers.length >= currentLevelData.numbers) {
        Alert.alert('Maximum numbers reached!');
        return;
      }
      setUsedNumbers(prev => [...prev, value]);
    }
    
    setEquation(prev => [...prev, value]);
    
    if (usedNumbers.length + (typeof value === 'number' ? 1 : 0) === currentLevelData.numbers) {
      setTimeout(checkSolution, 500);
    }
  };

  const clearSingle = () => {
    if (equation.length > 0) {
      const lastItem = equation[equation.length - 1];
      if (typeof lastItem === 'number') {
        setUsedNumbers(prev => prev.filter(num => num !== lastItem));
      }
      setEquation(prev => prev.slice(0, -1));
    }
  };

  const clearEquation = () => {
    setEquation([]);
    setUsedNumbers([]);
  };

  const checkSolution = () => {
    const currentLevelData = gameLevels[currentLevel];
    
    try {
      const expression = equation.map(item => 
        typeof item === 'string' ? item.replace(/×/g, '*').replace(/÷/g, '/') : item
      ).join('');
      
      const result = eval(expression);
      
      if (Math.abs(result - currentLevelData.target) < 0.001) {
        const coinsEarned = currentLevelData.coins;
        addCoins(coinsEarned);
        
        showAchievementPopup(true, coinsEarned);
        setTimeout(() => {
          if (currentLevel < gameLevels.length - 1) {
            setCurrentLevel(prev => prev + 1);
            clearEquation();
          } else {
            setCurrentLevel(0);
            clearEquation();
          }
          saveGameProgress();
        }, 2000);
      } else {
        const coinsLost = currentLevel < 30 ? 2 : 5;
        addCoins(-coinsLost);
        Alert.alert('Wrong!', `Result: ${result} | Lost ${coinsLost} coins`);
        clearEquation();
      }
    } catch {
      Alert.alert('Invalid equation!');
      clearEquation();
    }
  };

  const showAchievementPopup = (success, coins) => {
    setAchievementData({
      title: 'Perfect!',
      desc: 'Moving to next level...',
      coins: coins
    });
    setShowAchievement(true);
    
    setTimeout(() => {
      setShowAchievement(false);
    }, 1800);
  };

  const claimDailyCoins = () => {
    Alert.alert('Daily Reward', '50 coins claimed!');
    addCoins(50);
    setShowSettings(false);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    saveGameProgress();
  };

  const resetSettings = () => {
    setTheme('default');
    Alert.alert('Settings Reset', 'All settings have been reset to default.');
  };

  const selectLevel = (levelIndex) => {
    setCurrentLevel(levelIndex);
    clearEquation();
    setShowLevels(false);
    saveGameProgress();
  };

  // Render curved numbers in arc
  const renderCurvedNumbers = () => {
    const currentLevelData = gameLevels[currentLevel];
    const numbers = currentLevelData.numbersPool;
    const radius = 120;
    const centerX = width * 0.5;
    const totalAngle = Math.PI * 0.7;
    
    return numbers.map((num, index) => {
      const angle = (index / (numbers.length - 1)) * totalAngle + (Math.PI - totalAngle) / 2;
      const x = centerX + radius * Math.cos(angle) - 22;
      const y = 30 + radius * Math.sin(angle);
      
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.numberOnArc,
            { left: x, top: y }
          ]}
          onPress={() => addToEquation(num)}
        >
          <Text style={styles.numberText}>{num}</Text>
        </TouchableOpacity>
      );
    });
  };

  const renderEquationChip = (item, index) => {
    const isNumber = typeof item === 'number';
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.equationChip,
          isNumber ? styles.numberChip : styles.operatorChip
        ]}
        onPress={() => {
          const newEquation = [...equation];
          const removed = newEquation.splice(index, 1)[0];
          setEquation(newEquation);
          
          if (typeof removed === 'number') {
            setUsedNumbers(prev => prev.filter(num => num !== removed));
          }
        }}
      >
        <Text style={styles.chipText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  if (splashVisible) {
    return (
      <View style={styles.splashScreen}>
        <Animated.View 
          style={[
            styles.mathgCube,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={styles.mathgText}>MathG</Text>
        </Animated.View>
      </View>
    );
  }

  const currentLevelData = gameLevels[currentLevel];
  const isDarkTheme = theme === 'dark';

  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <StatusBar backgroundColor={isDarkTheme ? '#2c3e50' : '#667eea'} />
      
      <Animated.View style={[
        styles.gameContainer, 
        isDarkTheme && styles.darkGameContainer,
        { opacity: fadeAnim }
      ]}>
        {/* Coin Display */}
        <View style={styles.coinDisplay}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinText}>{playerCoins}</Text>
        </View>

        {/* Level Display */}
        <TouchableOpacity style={styles.levelDisplay} onPress={() => setShowLevels(true)}>
          <Text style={styles.levelText}>{currentLevelData.name}</Text>
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(true)}>
          <Text style={styles.settingsBtnText}>⚙️</Text>
        </TouchableOpacity>

        {/* Game Header */}
        <View style={[styles.gameHeader, isDarkTheme && styles.darkGameHeader]}>
          <Text style={[styles.gameTitle, isDarkTheme && styles.darkGameTitle]}>MathG</Text>
        </View>

        {/* Target Section */}
        <View style={[styles.targetSection, isDarkTheme && styles.darkTargetSection]}>
          <Text style={[styles.targetLabel, isDarkTheme && styles.darkText]}>TARGET NUMBER</Text>
          <Text style={[styles.targetNumber, isDarkTheme && styles.darkTargetNumber]}>{currentLevelData.target}</Text>
          <Text style={[styles.numbersInfo, isDarkTheme && styles.darkText]}>
            Use exactly <Text style={styles.boldText}>{currentLevelData.numbers}</Text> numbers
          </Text>
        </View>

        {/* Equation Hint */}
        <View style={[styles.equationHint, isDarkTheme && styles.darkEquationHint]}>
          <Text style={[styles.hintText, isDarkTheme && styles.darkText]}>
            {usedNumbers.length < currentLevelData.numbers 
              ? `Add ${currentLevelData.numbers - usedNumbers.length} more number${currentLevelData.numbers - usedNumbers.length > 1 ? 's' : ''} to complete equation`
              : 'Equation complete! Checking solution...'
            }
          </Text>
        </View>

        {/* Controls Area */}
        <View style={[styles.controlsArea, isDarkTheme && styles.darkControlsArea]}>
          {/* Curved Numbers with Operators */}
          <View style={styles.curvedControls}>
            <View style={styles.numbersArc}>
              {renderCurvedNumbers()}
            </View>
            <View style={styles.operatorsRow}>
              <TouchableOpacity style={styles.operatorBtn} onPress={() => addToEquation('+')}>
                <Text style={styles.operatorText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.operatorBtn} onPress={() => addToEquation('-')}>
                <Text style={styles.operatorText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.operatorBtn} onPress={() => addToEquation('×')}>
                <Text style={styles.operatorText}>×</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.operatorBtn} onPress={() => addToEquation('÷')}>
                <Text style={styles.operatorText}>÷</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Equation Display */}
          <View style={[styles.equationSection, isDarkTheme && styles.darkEquationSection]}>
            {equation.length === 0 ? (
              <Text style={[styles.emptyEquation, isDarkTheme && styles.darkText]}>
                Your equation will appear here
              </Text>
            ) : (
              <View style={styles.equationDisplay}>
                {equation.map(renderEquationChip)}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn} onPress={clearSingle}>
              <Text style={styles.actionBtnText}>Clear Last</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.settingsPanel, isDarkTheme && styles.darkSettingsPanel]}>
            <View style={[styles.settingsHeader, isDarkTheme && styles.darkSettingsHeader]}>
              <Text style={[styles.settingsTitle, isDarkTheme && styles.darkText]}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text style={[styles.closeBtn, isDarkTheme && styles.darkText]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.settingsSection}>
                <Text style={[styles.sectionTitle, isDarkTheme && styles.darkText]}>Theme</Text>
                <View style={styles.themeOptions}>
                  <TouchableOpacity 
                    style={[
                      styles.themeOption, 
                      styles.themeDefault,
                      theme === 'default' && styles.activeTheme
                    ]}
                    onPress={() => changeTheme('default')}
                  >
                    <Text style={styles.themeText}>Default</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.themeOption, 
                      styles.themeDark,
                      theme === 'dark' && styles.activeTheme
                    ]}
                    onPress={() => changeTheme('dark')}
                  >
                    <Text style={styles.themeText}>Dark</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.sectionTitle, isDarkTheme && styles.darkText]}>Daily Reward</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={claimDailyCoins}>
                  <Text style={styles.primaryBtnText}>Claim Daily Coins</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={resetSettings}>
                <Text style={styles.primaryBtnText}>Reset to Default</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Level Selection Modal */}
      <Modal visible={showLevels} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.levelModal, isDarkTheme && styles.darkLevelModal]}>
            <View style={[styles.levelModalHeader, isDarkTheme && styles.darkLevelModalHeader]}>
              <Text style={[styles.levelModalTitle, isDarkTheme && styles.darkText]}>Select Level</Text>
              <TouchableOpacity onPress={() => setShowLevels(false)}>
                <Text style={[styles.closeBtn, isDarkTheme && styles.darkText]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.levelsGrid}>
              {gameLevels.map((level, index) => (
                <TouchableOpacity
                  key={level.level}
                  style={[
                    styles.levelCard,
                    isDarkTheme && styles.darkLevelCard,
                    index === currentLevel && styles.activeLevelCard,
                    index > currentLevel && styles.lockedLevelCard
                  ]}
                  onPress={() => index <= currentLevel && selectLevel(index)}
                  disabled={index > currentLevel}
                >
                  <Text style={[
                    styles.levelNumber,
                    (index === currentLevel || isDarkTheme) && styles.lightText,
                    index > currentLevel && styles.lockedText
                  ]}>
                    {level.level}
                  </Text>
                  <Text style={[
                    styles.levelName,
                    (index === currentLevel || isDarkTheme) && styles.lightText,
                    index > currentLevel && styles.lockedText
                  ]}>
                    {level.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Achievement Popup */}
      <Modal visible={showAchievement} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.achievementPopup, isDarkTheme && styles.darkAchievementPopup]}>
            <Text style={styles.achievementIcon}>🎯</Text>
            <Text style={[styles.achievementTitle, isDarkTheme && styles.darkText]}>
              {achievementData.title}
            </Text>
            <Text style={[styles.achievementDesc, isDarkTheme && styles.darkText]}>
              {achievementData.desc}
            </Text>
            <Text style={styles.coinReward}>+{achievementData.coins} coins</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  splashScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  mathgCube: {
    width: 180,
    height: 180,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 35,
    elevation: 15,
  },
  mathgText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#2c3e50',
  },
  gameContainer: {
    width: '100%',
    maxWidth: 400,
    height: '90%',
    maxHeight: 800,
    backgroundColor: 'white',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  darkGameContainer: {
    backgroundColor: '#2c3e50',
    borderColor: '#34495e',
  },
  coinDisplay: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  coinIcon: {
    fontSize: 16,
  },
  coinText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
  },
  levelDisplay: {
    position: 'absolute',
    top: 15,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    zIndex: 100,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
  },
  settingsBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#667eea',
    borderRadius: 15,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  settingsBtnText: {
    fontSize: 20,
    color: 'white',
  },
  gameHeader: {
    backgroundColor: 'white',
    paddingTop: 70,
    paddingBottom: 25,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  darkGameHeader: {
    backgroundColor: '#2c3e50',
    borderBottomColor: '#34495e',
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#667eea',
  },
  darkGameTitle: {
    color: '#ffffff',
  },
  targetSection: {
    padding: 25,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  darkTargetSection: {
    borderBottomColor: '#34495e',
  },
  targetLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    color: '#666',
  },
  targetNumber: {
    fontSize: 64,
    fontWeight: '900',
    marginBottom: 10,
    color: '#667eea',
  },
  darkTargetNumber: {
    color: '#ffffff',
  },
  numbersInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  boldText: {
    fontWeight: '700',
  },
  equationHint: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  darkEquationHint: {
    backgroundColor: '#2c3e50',
    borderBottomColor: '#34495e',
  },
  hintText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  controlsArea: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  darkControlsArea: {
    backgroundColor: '#2c3e50',
  },
  curvedControls: {
    height: 180,
    marginBottom: 20,
  },
  numbersArc: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -140 }],
    width: 280,
    height: 120,
  },
  numberOnArc: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  numberText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  operatorsRow: {
    position: 'absolute',
    top: 30,
    left: '50%',
    transform: [{ translateX: -90 }],
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  operatorBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  operatorText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  equationSection: {
    padding: 20,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e0e0e0',
    borderRadius: 15,
    marginBottom: 20,
  },
  darkEquationSection: {
    backgroundColor: '#34495e',
    borderColor: '#34495e',
  },
  emptyEquation: {
    color: '#95a5a6',
    fontSize: 14,
    fontStyle: 'italic',
  },
  equationDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  equationChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  numberChip: {
    backgroundColor: '#e74c3c',
  },
  operatorChip: {
    backgroundColor: '#667eea',
  },
  chipText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  actionButtons: {
    gap: 12,
    marginTop: 'auto',
  },
  actionBtn: {
    height: 55,
    borderRadius: 15,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  actionBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsPanel: {
    width: '85%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginLeft: '15%',
  },
  darkSettingsPanel: {
    backgroundColor: '#2c3e50',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  darkSettingsHeader: {
    borderBottomColor: '#34495e',
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2c3e50',
  },
  closeBtn: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  settingsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  themeOption: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  themeDefault: {
    backgroundColor: '#667eea',
  },
  themeDark: {
    backgroundColor: '#2c3e50',
  },
  activeTheme: {
    borderColor: '#667eea',
    transform: [{ scale: 1.05 }],
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  themeText: {
    fontWeight: '700',
    color: 'white',
  },
  primaryBtn: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  levelModal: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  darkLevelModal: {
    backgroundColor: '#2c3e50',
  },
  levelModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  darkLevelModalHeader: {
    borderBottomColor: '#34495e',
  },
  levelModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  levelCard: {
    width: '30%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  darkLevelCard: {
    backgroundColor: '#34495e',
    borderColor: '#2c3e50',
  },
  activeLevelCard: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  lockedLevelCard: {
    opacity: 0.6,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
    color: '#2c3e50',
  },
  levelName: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.8,
    color: '#2c3e50',
  },
  lightText: {
    color: 'white',
  },
  lockedText: {
    color: '#666',
  },
  achievementPopup: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  darkAchievementPopup: {
    backgroundColor: '#34495e',
    borderColor: '#2c3e50',
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    color: '#2c3e50',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  coinReward: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27ae60',
  },
  darkText: {
    color: '#ecf0f1',
  },
});

export default MathGApp;
