import * as React from 'react'
import { TeamsProcessedSvgIconSpec } from '../types'

export default {
  icon: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="8 8 16 16" className={classes.svg}>
      <path d="M22.7 9.3a2.746 2.746 0 0 0-3.88 0l-2.38 2.379a2.745 2.745 0 0 0-.318 3.491l-.951.951a2.744 2.744 0 0 0-3.491.318l-2.38 2.38a2.743 2.743 0 0 0 3.88 3.88l2.38-2.379a2.745 2.745 0 0 0 .318-3.491l.951-.951a2.737 2.737 0 0 0 3.491-.318l2.38-2.379a2.746 2.746 0 0 0 0-3.881zm-7.846 10.313l-2.38 2.379a1.744 1.744 0 1 1-2.466-2.466l2.38-2.379a1.721 1.721 0 0 1 2.054-.3l-.778.779a.5.5 0 1 0 .707.707l.778-.778a1.741 1.741 0 0 1-.295 2.058zm7.139-7.139l-2.38 2.379a1.741 1.741 0 0 1-2.054.3l.778-.779a.5.5 0 0 0-.707-.707l-.778.778a1.741 1.741 0 0 1 .3-2.054l2.38-2.379a1.744 1.744 0 1 1 2.46 2.462z" />
    </svg>
  ),
  styles: {},
  exportedAs: 'files-link',
} as TeamsProcessedSvgIconSpec
