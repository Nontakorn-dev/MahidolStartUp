export type PartnerLogo = {
  src: string
  alt: string
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  {
    src: '/content/logo/marquee/int.png',
    alt: 'Institute for Technology and Innovation Management (iNT)',
  },
  {
    src: '/content/logo/marquee/mahidol.png',
    alt: 'Mahidol University',
  },
  {
    src: '/content/logo/marquee/mahidol-ted.png',
    alt: 'Mahidol TED Youth Startup',
  },
  {
    src: '/content/logo/marquee/club.png',
    alt: 'Mahidol Startup Club',
  },
]

/** Two copies keep the loop filled without looking cramped */
export const PARTNER_LOGO_SEQUENCE = [...PARTNER_LOGOS, ...PARTNER_LOGOS]
