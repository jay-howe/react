import { Accessibility } from '../../types'
import * as keyboardKey from 'keyboard-key'
import { IS_FOCUSABLE_ATTRIBUTE } from '../../FocusZone/focusUtilities'

/**
 * @specification
 * Adds attribute 'aria-expanded=true' based on the property 'open' if the component has 'hasSubtree' property.
 * Triggers 'performClick' action with 'Enter' or 'Spacebar' on 'root'.
 * Triggers 'expand' action with 'ArrowRight' on 'root'.
 * Triggers 'collapse' action with 'ArrowLeft' on 'root'.
 */
const treeTitleBehavior: Accessibility<TreeTitleBehavior> = props => ({
  attributes: {
    root: {
      ...(props.hasSubtree && { 'aria-expanded': props.open ? 'true' : 'false' }),
      tabIndex: 0,
      [IS_FOCUSABLE_ATTRIBUTE]: true,
    },
  },

  keyActions: {
    root: {
      performClick: {
        keyCombinations: [{ keyCode: keyboardKey.Enter }, { keyCode: keyboardKey.Spacebar }],
      },
      expand: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowRight }],
      },
      collapse: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowLeft }],
      },
    },
  },
})

export default treeTitleBehavior

type TreeTitleBehavior = {
  /** Indicated if tree title has a subtree */
  hasSubtree?: boolean
  /** If subtree is opened. */
  open?: boolean
}
