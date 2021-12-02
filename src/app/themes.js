const themes = {
  light: {
    '--green': '#368f7c',
    '--yellow': 'rgb(108,46,252)',
    '--my-message': 'rgb(183, 162, 230)',
    '--wide-screen-profile-gradient':
      'linear-gradient(90deg, rgb(167, 201, 223), rgb(148, 194, 224), rgb(217, 217, 230), rgb(217, 217, 230), rgb(217, 217, 230), rgb(217, 217, 230), rgb(217, 217, 230))',
    '--narrow-screen-profile-gradient':
      'linear-gradient(90deg, rgb(217, 217, 230), rgb(167, 201, 223), rgb(148, 194, 224), rgb(167, 201, 223), rgb(217, 217, 230))',

    //background color for header
    '--header-back': 'rgb(245, 245, 245)',
    '--page-back': 'rgb(227, 227, 233)',
    // light gray for active icons and text
    '--icon-light': 'rgb(29, 26, 26)',
    // darker than icon-light for unactive icons and text
    '--icon-secondary': 'rgb(67, 67, 73)',
    '--text-secondary': 'rgb(143, 143, 150)',
    '--button-light': 'rgb(71, 69, 69)',
    //background of the page
    '--back-color': 'rgb(255, 255, 255)',
    '--back-box-color': 'rgb(227, 227, 233)',
    '--back-box-light-color': 'rgb(227, 227, 233)',
    '--background-dark': 'rgb(255, 255, 255)',
    '--background-light': 'rgb(245, 245, 245)',
    '--social-dark': 'rgba(0, 0, 0, 0.67)',
    '--social-light': 'rgba(255, 255, 255, 0.79)',

    '--message-summary-header': 'rgb(239, 239, 239)',
    '--text-color': 'rgb(0, 0, 0)',
    '--title-dark': 'rgba(73, 68, 68, 0.4)',
    '--loader-light': '#efefef',
  },
  dark: {
    '--green': '#4dd4b6',
    '--yellow': 'rgb(204,238,63)',
    '--my-message': 'rgb(108, 42, 252)',
    '--wide-screen-profile-gradient':
    'linear-gradient(90deg, rgb(33, 45, 52), rgb(43, 83, 81), rgb(31, 31, 41), rgb(31, 31, 41), rgb(31, 31, 41), rgb(31, 31, 41), rgb(31, 31, 41))',
    '--narrow-screen-profile-gradient':
      'linear-gradient(90deg, #212d34, #212d34, #2b5351, #212d34, #1f1f29)',

    //background color for header
    '--header-back': 'rgb(48, 48, 60)',
    '--page-back': 'rgb(44, 44, 55)',
    // light gray for active icons and text
    '--icon-light': 'rgb(245, 245, 245)',
    // darker than icon-light for unactive icons and text
    '--icon-secondary': 'rgb(147, 147, 153)',
    '--text-secondary': 'rgb(116, 116, 124)',
    '--button-light': 'rgb(226, 226, 226)',
    //background of the page
    '--back-color': 'rgb(26, 26, 36)',
    '--back-box-color': 'rgb(28, 28, 35)',
    '--back-box-light-color': 'rgb(30, 30, 38)',
    '--background-dark': ' #000',
    '--background-light': 'rgb(51, 51, 63)',
    '--social-dark': 'rgba(255, 255, 255, 0.79)',
    '--social-light': 'rgba(0, 0, 0, 0.67)',

    '--message-summary-header': 'rgb(32, 32, 41)',
    '--text-color': 'white',
    '--title-dark': 'rgba(255, 255, 255, 0.4)',
    '--loader-light': '#30303c',
  }
};
export const changeTheme = (themeName) => {
  console.log('change theme', themeName);
  window.localStorage.setItem('trybe_theme', themeName);
  const theme = themes[themeName];
  const html = document.querySelector('html');
  Object.keys(theme).forEach(prop => html.style.setProperty(prop, theme[prop]));
};

export const initWithTheme = () => {
  const theme = window.localStorage.getItem('trybe_theme');
  theme && changeTheme(theme);
  theme ? changeTheme(theme) : changeTheme('light');
};

export const getCurrentTheme = () => {
  return window.localStorage.getItem('trybe_theme');
};