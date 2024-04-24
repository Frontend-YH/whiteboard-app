const ThemeSelector = {
    applyTheme: (theme) => {
      switch (theme) {
        case 'sport':
            console.log(theme);
          return {
            backgroundImage: require('./assets/images/sport-background.jpg'),
            
          };
        case 'beer':
          return {
            backgroundImage: require('./assets/images/beer-background.jpg'),
           
          };
        case 'fashion':
          return {
            backgroundImage: require('./assets/images/fashion-background.jpg'),
           
          };
        case 'future':
          return {
            backgroundImage: require('./assets/images/future-background.jpg'),
          
          };
        default:
          return {}; 
      }
    },
  };
  
  export default ThemeSelector;
  