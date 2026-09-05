import { PARTNER_LOGOS, PARTNER_LOGO_SEQUENCE } from '../../data/partner-logos'

function LogoGroup({ groupIndex }: { groupIndex: number }) {
  return (
    <div className="partner-marquee__group" aria-hidden={groupIndex === 1}>
      {PARTNER_LOGO_SEQUENCE.map((logo, index) => (
        <div key={`${groupIndex}-${logo.src}-${index}`} className="partner-marquee__item">
          <img
            src={logo.src}
            alt={groupIndex === 0 && index < PARTNER_LOGOS.length ? logo.alt : ''}
            className="partner-marquee__logo"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}

export function PartnerLogoMarquee() {
  return (
    <div className="partner-marquee">
      <p className="sr-only">พันธมิตรและผู้สนับสนุน</p>
      <div className="partner-marquee__viewport">
        <div className="partner-marquee__track">
          <LogoGroup groupIndex={0} />
          <LogoGroup groupIndex={1} />
        </div>
      </div>
    </div>
  )
}
