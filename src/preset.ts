import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}'
  },
    secondary: {
      color: '{zinc.50}',
      inverseColor: '#000000',
      hoverColor: '{zinc.100}',
      activeColor: '{zinc.200}',
    },
    success: {
      color: '{teal.400}',
      inverseColor: '#ffffff',
      hoverColor: '{teal.500}',
      activeColor: '{teal.600}',
    },
    warning: {
      color: '{amber.300}',
      inverseColor: '#000000',
      hoverColor: '{amber.400}',
      activeColor: '{amber.500}',
    },
    info: {
      color: '{sky.400}',
      inverseColor: '#000000',
      hoverColor: '{sky.500}',
      activeColor: '{sky.600}',
    },
    error: {
      color: '{red.500}',
      inverseColor: '#000000',
      hoverColor: '{red.600}',
      activeColor: '{red.700}',
    },
  },
});

export default MyPreset;
