export type PartnerLogo = {
  src: string
  alt: string
  variant?: 'club'
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  {
    src: '/content/logo/int.png',
    alt: 'Institute for Technology and Innovation Management (iNT)',
  },
  {
    src: '/content/logo/mahidol.png',
    alt: 'Mahidol University',
  },
  {
    src: '/content/logo/mahidol-ted.png',
    alt: 'Mahidol TED Youth Startup',
  },
  {
    src: '/content/logo/logo.png',
    alt: 'Mahidol Startup Club',
    variant: 'club',
  },
]

/** Repeat within each marquee group so wide screens stay filled */
export const PARTNER_LOGO_SEQUENCE = [
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
]
