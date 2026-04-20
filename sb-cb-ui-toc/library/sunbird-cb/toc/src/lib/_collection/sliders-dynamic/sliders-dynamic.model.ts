export interface ICarousel {
  title?: string,
  redirectUrl?: string,
  openInNewTab?: string,
  banners: IBannerUnit,
  mailTo?: string,
  queryParams?: any,
  sliderData?: any,
  type?: string,
  cardClass?: string,
  height?: string,
  iconsDisplay?: boolean,
}

interface IBannerUnit {
  xs: string,
  s: string,
  m: string,
  l: string,
  xl: string
}
