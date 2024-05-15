import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle, defineStyleConfig, extendTheme } from '@chakra-ui/react';

const cardStyle = () => {
  const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys);

  const baseStyle = definePartsStyle({
    container: {
      borderWidth: '1px',
      borderColor: '#B3B3B3',
      shadow: 'lg',
    },
  });

  return defineMultiStyleConfig({ baseStyle });
};

const tableStyle = () => {
  const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(['th', 'td']);

  const baseStyle = definePartsStyle({
    th: {
      textTransform: 'none',
      textAlign: 'center',
      fontWeight: 'normal',
      color: 'white',
    },
    td: {
      textAlign: 'center',
    },
  });

  const variants = { simple: definePartsStyle({ th: { color: 'white' } }) };

  const sizes = {
    md: definePartsStyle({
      th: { fontSize: '20px' },
      td: { fontSize: '20px' },
    }),
  };

  return defineMultiStyleConfig({ baseStyle, variants, sizes });
};

export const theme = extendTheme({
  colors: { headerbg: '#031C30' },
  components: {
    Button: defineStyleConfig({
      variants: {
        primary: defineStyle({ bg: '#004AAD', color: '#FFD166', _hover: { background: '#033579', color: '#FFD166' } }),
        secondary: defineStyle({ bg: '#9E9E9E', color: 'white', _hover: { background: '不明', color: 'white' } }),
      },
      defaultProps: { variant: 'primary' },
    }),
    Card: cardStyle(),
    FormLabel: defineStyleConfig({
      baseStyle: {
        fontSize: '14px',
      },
      defaultProps: { variant: 'primary' },
    }),
    Table: tableStyle(),
  },
  fonts: {
    body: "'Poppins', sans-serif",
    heading: "'Poppins', sans-serif",
    mono: "'Open Sans', monospace",
  },
});
