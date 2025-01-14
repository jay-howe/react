import { Accessibility } from '../../types'
import * as keyboardKey from 'keyboard-key'

/**
 * @specification
 * Adds attribute 'role=presentation' to 'root' component's part.
 * Triggers 'moveNext' action with 'ArrowDown' on 'root'.
 * Triggers 'movePrevious' action with 'ArrowUp' on 'root'.
 * Triggers 'moveFirst' action with 'Home' on 'root'.
 * Triggers 'moveLast' action with 'End' on 'root'.
 */
const accordionBehavior: Accessibility = () => ({
  attributes: {
    root: {
      role: 'presentation',
    },
  },
  keyActions: {
    root: {
      moveNext: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowDown }],
      },
      movePrevious: {
        keyCombinations: [{ keyCode: keyboardKey.ArrowUp }],
      },
      moveFirst: {
        keyCombinations: [{ keyCode: keyboardKey.Home }],
      },
      moveLast: {
        keyCombinations: [{ keyCode: keyboardKey.End }],
      },
    },
  },
})

export default accordionBehavior
