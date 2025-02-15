import { Accessibility, FocusZoneMode } from '../../types'
import { FocusZoneDirection } from '../../FocusZone'
import tabBehavior from './tabBehavior'

/**
 * @description
 * Implements ARIA Tabs design pattern.
 * Child item components need to have tabBehavior assigned.
 * @specification
 * Adds role 'tablist' to 'root' component's part.
 * Embeds component into FocusZone.
 * Provides arrow key navigation in bidirectional direction.
 * When component's container element receives focus, focus will be set to the default focusable child element of the component.
 */
const tabListBehavior: Accessibility = () => ({
  attributes: {
    root: {
      role: 'tablist',
    },
  },
  focusZone: {
    mode: FocusZoneMode.Embed,
    props: {
      shouldFocusInnerElementWhenReceivedFocus: true,
      direction: FocusZoneDirection.bidirectional,
    },
  },
  childBehaviors: {
    item: tabBehavior,
  },
})

export default tabListBehavior
