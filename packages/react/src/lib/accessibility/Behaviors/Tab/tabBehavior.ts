import { Accessibility, AccessibilityAttributes } from '../../types'
import * as keyboardKey from 'keyboard-key'
import { IS_FOCUSABLE_ATTRIBUTE } from '../../FocusZone/focusUtilities'

/**
 * @specification
 * Adds role 'presentation' to 'wrapper' component's part.
 * Adds role 'tab' to 'root' component's part.
 * Adds attribute 'tabIndex=0' to 'root' component's part.
 * Adds attribute 'data-is-focusable=false' to 'root' component's part if 'disabled' property is true. Sets the attribute to 'true' otherwise.
 * Adds attribute 'aria-selected=true' to 'root' component's part based on the property 'active'. This can be overriden by providing 'aria-selected' property directly to the component.
 * Adds attribute 'aria-label' based on the property 'aria-label' to 'root' component's part.
 * Adds attribute 'aria-labelledby' based on the property 'aria-labelledby' to 'root' component's part.
 * Adds attribute 'aria-describedby' based on the property 'aria-describedby' to 'root' component's part.
 * Adds attribute 'aria-controls' based on the property 'aria-controls' to 'root' component's part.
 * Adds attribute 'aria-disabled=true' to 'root' component's part based on the property 'disabled'. This can be overriden by providing 'aria-disabled' property directly to the component.
 * Triggers 'performClick' action with 'Enter' or 'Spacebar' on 'wrapper'.
 */
const tabBehavior: Accessibility<TabBehaviorProps> = props => ({
  attributes: {
    wrapper: {
      role: 'presentation',
    },
    root: {
      role: 'tab',
      tabIndex: 0,
      'aria-selected': !!props.active,
      'aria-label': props['aria-label'],
      'aria-labelledby': props['aria-labelledby'],
      'aria-describedby': props['aria-describedby'],
      'aria-controls': props['aria-controls'],
      'aria-disabled': props['disabled'],
      [IS_FOCUSABLE_ATTRIBUTE]: !props.disabled,
    },
  },

  keyActions: {
    wrapper: {
      performClick: {
        keyCombinations: [{ keyCode: keyboardKey.Enter }, { keyCode: keyboardKey.Spacebar }],
      },
    },
  },
})

export default tabBehavior

type TabBehaviorProps = {
  /** Indicates if tab is selected. */
  active?: boolean
  /** Indicates if tab is disabled. */
  disabled?: boolean
} & Pick<
  AccessibilityAttributes,
  'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'aria-controls'
>
