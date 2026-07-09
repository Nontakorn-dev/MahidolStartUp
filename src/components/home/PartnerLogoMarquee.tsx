import { cn } from '../../lib/utils'
import { PARTNER_LOGO_SEQUENCE } from '../../data/partner-logos'

function LogoGroup({ groupIndex }: { groupIndex: number }) {
  return (
    <div className="partner-marquee__group" aria-hidden={groupIndex === 1}>
      {PARTNER_LOGO_SEQUENCE.map((logo, index) => (
        <div
          key={`${groupIndex}-${logo.src}-${index}`}
          className={cn(
            'partner-marquee__item',
            logo.variant === 'club' && 'partner-marquee__item--club',
          )}
        >
          {logo.variant === 'club' ? (
            <div className="partner-marquee__logo-crop">
              <img
                src={logo.src}
                alt={groupIndex === 0 && index < 4 ? logo.alt : ''}
                className="partner-marquee__logo partner-marquee__logo--club"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ) : (
            <img
              src={logo.src}
              alt={groupIndex === 0 && index < 4 ? logo.alt : ''}
              className="partner-marquee__logo"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function PartnerLogoMarquee() {
  return (
    <div className="partner-marquee border-t border-line bg-surface">
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
