import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const Themer = ({ children }) => {
  const [primary, setPrimary] = useState('#588c7e');
  const [Appurl,setAppurl] = useState('https://play.google.com/store/apps/details?id=com.percepco.milaap')
  const [secondary, setSecondary] = useState('gray');
  const [background, setBackground] = useState('black');
  const [Tcolor,setTcolor] = useState('white')
  const [AppName, setAppName] = useState('Assistant Living');
  const [theme, setTheme] = useState('light');
  const [logo, setLogo] = useState(require('./src/Assets/Images/logo.png'));
  const [gradientbg, setGradientbg] = useState('#ACE1AF');
  const [percepcoemail,setpercepcoemail] = useState('percepco07@gmail.com')
  const darkLogo = './src/Assets/Images/logo.png';
   const [VoiceAssistant, setVoiceAssistant] = useState(false)


  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('Theme');
        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          setTheme('light'); // Default theme
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
  },[]);

  useEffect(() => {
    if (theme === 'light') {
      // setPrimary('#26f7fd');
      setPrimary('#588c7e');

      setSecondary('gray');
      setBackground('#fff');
      setTcolor('black')
      setLogo(require('./src/Assets/Images/logo.png')); 
    } else if (theme === 'dark') {
      // setPrimary('#26f7fd');
      setPrimary('#588c7e');

      setSecondary('gray');
      setBackground('black');
      setTcolor('#fff')
      setLogo(require('./src/Assets/Images/logo.png'));
    }
  }, [theme]);

    useEffect(()=>{
  
          const checkvoice = async () => {
            const voice = await AsyncStorage.getItem('VoiceAssistant')
            if (voice === 'true') {
              setVoiceAssistant(true)
            }
            else {
              setVoiceAssistant(false)
            }
          }
          checkvoice()
        },[])

  const toggleTheme = async () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ Tcolor,primary, secondary, background, gradientbg,theme, logo, toggleTheme,percepcoemail,darkLogo,AppName ,Appurl,setVoiceAssistant,VoiceAssistant}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);