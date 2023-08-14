export type StrapiLanguage = {
  data?: { attributes: { code: string } };
};

export type StrapiImage = {
  data?: {
    attributes: {
      url: string;
      mime: string;
      name: string;
      size: number;
    };
  };
};
