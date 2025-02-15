import { Accessibility } from '../../types'
import * as keyboardKey from 'keyboard-key'

/**
 * @description
 * Adds accessibility attributed to implement the Accordion design pattern.
 * Adds 'aria-disabled' to the 'content' component's part with a value based on active and canBeCollapsed props.
 * Adds role='heading' and aria-level='3' if the element type is not a header.
 *
 * @specification
 * Adds attribute 'role=button' to 'content' component's part.
 * Adds attribute 'tabIndex=0' to 'content' component's part.
 * Adds attribute 'aria-expanded=true' based on the property 'active' to 'content' component's part.
 * Adds attribute 'aria-controls=content-id' based on the property 'accordionContentId' to 'content' component's part.
 * Triggers 'performClick' action with 'Enter' or 'Spacebar' on 'content'.
 */
const accordionTitleBehavior: Accessibility<AccordionTitleBehaviorProps> = props => {
  const isHeading = /(h\d{1})$/.test(props.as)
  return {
    attributes: {
      root: {
        role: isHeading ? undefined : 'heading',
        'aria-level': isHeading ? undefined : 3,
      },
      content: {
        'aria-expanded': !!props.active,
        'aria-disabled': !!(props.active && !props.canBeCollapsed),
        'aria-controls': props.accordionContentId,
        role: 'button',
        tabIndex: 0,
      },
    },
    keyActions: {
      content: {
        performClick: {
          keyCombinations: [{ keyCode: keyboardKey.Enter }, { keyCode: keyboardKey.Spacebar }],
        },
      },
    },
  }
}

export default accordionTitleBehavior

type AccordionTitleBehaviorProps = {
  /** Element type. */
  as: string
  /** Whether or not the title is in the open state. */
  active?: boolean
  /** If at least one panel needs to stay active and this title does not correspond to the last active one. */
  canBeCollapsed?: boolean
  /** Id of the content it owns. */
  accordionContentId?: string
}
