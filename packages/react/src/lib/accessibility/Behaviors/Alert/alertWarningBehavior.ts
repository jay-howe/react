import { Accessibility } from '../../types'

/**
 * @specification
 * Adds role 'alert' to 'content' component's part.
 * Adds attribute 'aria-live=polite' to 'content' component's part.
 */

const alertWarningBehavior: Accessibility = () => ({
  attributes: {
    content: {
      role: 'alert',
      'aria-live': 'polite',
    },
  },
})

export default alertWarningBehavior
