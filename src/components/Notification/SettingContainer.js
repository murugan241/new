import './SettingContainer.css';
import { Component } from 'react';
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const toggleContents = [
  {
    id: 1,
    name: {
      en: 'Two-factor Authentication',
      ta: 'இரு காரணி அங்கீகாரம்',
      hi: 'दो-कारक प्रमाणीकरण',
      te: 'రెండు-కారకం ప్రమాణీకరణ',
    },
    description: {
      en: 'Keep your account secure by enabling 2FA via mail',
      ta: 'மின்னஞ்சல் மூலம் 2FA ஐ செயல்படுத்தி உங்கள் கணக்கை பாதுகாக்கவும்',
      hi: 'मेल के माध्यम से 2FA सक्षम करके अपने खाते को सुरक्षित रखें',
      te: 'మెయిల్ ద్వారా 2FA ను ప్రారంభించి మీ ఖాతాను సురక్షితంగా ఉంచండి',
    },
  },
  {
    id: 2,
    name: {
      en: 'Mobile Push Notifications',
      ta: 'மொபைல் புஷ் அறிவிப்புகள்',
      hi: 'मोबाइल पुश सूचनाएं',
      te: 'మొబైల్ పుష్ నోటిఫికేషన్లు',
    },
    description: {
      en: 'Receive push notifications',
      ta: 'புஷ் அறிவிப்புகளைப் பெறவும்',
      hi: 'पुश सूचनाएं प्राप्त करें',
      te: 'పుష్ నోటిఫికేషన్లను స్వీకరించండి',
    },
  },
  {
    id: 3,
    name: {
      en: 'Desktop Notifications',
      ta: 'டெஸ்க்டாப் அறிவிப்புகள்',
      hi: 'डेस्कटॉप सूचनाएं',
      te: 'డెస్క్‌టాప్ నోటిఫికేషన్లు',
    },
    description: {
      en: 'Receive push notifications on desktop',
      ta: 'டெஸ்க்டாப்-ல் புஷ் அறிவிப்புகளைப் பெறவும்',
      hi: 'डेस्कटॉप पर पुश सूचनाएं प्राप्त करें',
      te: 'డెస్క్‌టాప్‌లో పుష్ నోటిఫికేషన్లను స్వీకరించండి',
    },
  },
  {
    id: 4,
    name: {
      en: 'Email Notifications',
      ta: 'மின்னஞ்சல் அறிவிப்புகள்',
      hi: 'ईमेल सूचनाएं',
      te: 'ఈమెయిల్ నోటిఫికేషన్లు',
    },
    description: {
      en: 'Receive email notifications',
      ta: 'மின்னஞ்சல் அறிவிப்புகளைப் பெறவும்',
      hi: 'ईमेल सूचनाएं प्राप्त करें',
      te: 'ఈమెయిల్ నోటిఫికేషన్లను స్వీకరించండి',
    },
  },];

class SettingContainer extends Component {
  state = {
    toggledStates: toggleContents.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {}),
    language: 'en',
    theme: 'light',
  };

  handleToggle = (id) => {
    this.setState((prevState) => ({
      toggledStates: {
        ...prevState.toggledStates,
        [id]: !prevState.toggledStates[id],
      },
    }));
  };

  handleLanguageChange = (event) => {
    this.setState({ language: event.target.value });
  };

  handleThemeChange = (event) => {
    this.setState({ theme: event.target.value });
  };

  render() {
    const { toggledStates, language, theme } = this.state;

    return (
      <div className="setting-container-wrapper">
        {/* Navbar */}
        <div className="navbar-wrapper">
          <Navbar />
        </div>

        {/* TopBar */}
        <div className="topbar-wrapper">
          <TopBar />
        </div>

        {/* Sidebar and Main Content */}
        <div className="main-layout">
          {/* Sidebar */}
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className={`setting-container ${theme}`}>
            <h1 className="setting-title">
              {language === 'en'
                ? 'Settings'
                : language === 'ta'
                ? 'அமைப்புகள்'
                : language === 'hi'
                ? 'सेटिंग्स'
                : 'సెట్టింగులు'}
            </h1>
            <p className="setting-description">
              {language === 'en'
                ? 'Dashboard / Settings'
                : language === 'ta'
                ? 'டாஷ்போர்டு / அமைப்புகள்'
                : language === 'hi'
                ? 'डैशबोर्ड / सेटिंग्स'
                : 'డాష్‌బోర్డు / సెట్టింగులు'}
            </p>
            <ul className="setting-list">
              <li className="setting-li">
                <div className="setting-flex">
                  <div>
                    <h1 className="setting-title">
                      {language === 'en'
                        ? 'Appearance'
                        : language === 'ta'
                        ? 'வெளிப்புறம்'
                        : language === 'hi'
                        ? 'दिखावट'
                        : 'రూపం'}
                    </h1>
                    <p className="setting-message">
                      {language === 'en'
                        ? 'Customize how your theme looks on your device'
                        : language === 'ta'
                        ? 'உங்கள் கருவியில் உங்கள் தீமின் தோற்றத்தை தனிப்பயனாக்கவும்'
                        : language === 'hi'
                        ? 'अपने डिवाइस पर थीम को कस्टमाइज़ करें'
                        : 'మీ డివైస్‌పై మీ థీమ్ ఎలా కనిపిస్తుందో అనుకూలీకరించండి'}
                    </p>
                  </div>
                  <select
                    className="setting-select"
                    value={theme}
                    onChange={this.handleThemeChange}
                  >
                    <option value="light">
                      {language === 'en'
                        ? 'Light'
                        : language === 'ta'
                        ? 'ஒளி'
                        : language === 'hi'
                        ? 'हल्का'
                        : 'కాంతి'}
                    </option>
                    <option value="dark">
                      {language === 'en'
                        ? 'Dark'
                        : language === 'ta'
                        ? 'இருள்'
                        : language === 'hi'
                        ? 'गहरा'
                        : 'చీకటి'}
                    </option>
                  </select>
                </div>
                <hr className="setting-border-line" />
              </li>

              <li className="setting-li">
                <div className="setting-flex">
                  <div>
                    <h1 className="setting-title">
                      {language === 'en'
                        ? 'Language'
                        : language === 'ta'
                        ? 'மொழி'
                        : language === 'hi'
                        ? 'भाषा'
                        : 'భాష'}
                    </h1>
                    <p className="setting-message">
                      {language === 'en'
                        ? 'Select your language'
                        : language === 'ta'
                        ? 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்'
                        : language === 'hi'
                        ? 'अपनी भाषा चुनें'
                        : 'మీ భాషను ఎంచుకోండి'}
                    </p>
                  </div>
                  <select
                    className="setting-select"
                    value={language}
                    onChange={this.handleLanguageChange}
                  >
                    <option value="en">English</option>
                    <option value="ta">தமிழ்</option>
                    <option value="hi">हिन्दी</option>
                    <option value="te">తెలుగు</option>
                  </select>
                </div>
                <hr className="setting-border-line" />
              </li>

              {toggleContents.map((eachItem) => (
                <li className="setting-li" key={eachItem.id}>
                  <div className="setting-flex">
                    <div>
                      <h1 className="setting-title">{eachItem.name[language]}</h1>
                      <p className="setting-message">
                        {eachItem.description[language]}
                      </p>
                    </div>
                    <div
                      className={`toggle ${toggledStates[eachItem.id] ? 'active' : ''}`}
                      onClick={() => this.handleToggle(eachItem.id)}
                    >
                      <div className="toggle-circle"></div>
                    </div>
                  </div>
                  <hr className="setting-border-line" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingContainer;
