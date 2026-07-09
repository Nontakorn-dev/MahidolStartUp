import { Link } from 'react-router-dom'
import { MessageCircle, ExternalLink } from 'lucide-react'
import { SOCIAL_LINKS } from '../../lib/constants'

export function TopBar({ light = false }: { light?: boolean }) {
  return (
    <div className={light ? 'top-bar top-bar--hero' : 'top-bar'}>
      <div className="wrap top-bar__inner">
        <div className="top-bar__left">
          <span className="top-bar__badge">iNT × Mahidol</span>
          <span className="top-bar__divider" aria-hidden />
          <span className="top-bar__label">Mahidol Startup Club · Est. 2018</span>
        </div>

        <div className="top-bar__right">
          <a
            href={SOCIAL_LINKS.line}
            target="_blank"
            rel="noopener noreferrer"
            className="top-bar__link"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Line OpenChat</span>
            <span className="sm:hidden">Line</span>
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="top-bar__link"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">@mahidolstartup_official</span>
            <span className="sm:hidden">IG</span>
          </a>
          <Link to="/about" className="top-bar__link top-bar__link--cta">
            ติดต่อเรา
          </Link>
        </div>
      </div>
    </div>
  )
}
