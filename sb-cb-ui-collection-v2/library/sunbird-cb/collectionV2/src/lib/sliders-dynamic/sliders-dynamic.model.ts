export interface ICarousel {
  title?: string,
  redirectUrl?: string,
  openInNewTab?: string,
  banners: IBannerUnit,
  mailTo?: string,
  queryParams?: any,
  sliderData?: any,
  cardClass?: string,
  height?: string,
  type?: string,
  iconsDisplay?: boolean
}

interface IBannerUnit {
  xs: string,
  s: string,
  m: string,
  l: string,
  xl: string
}
