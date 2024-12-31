export interface CountryApiResponse {
  name: {
    common: string;
    official: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  cca2: string;
}

// Interfaz simplificada
export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}
