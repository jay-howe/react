import { Ref } from '@stardust-ui/react-component-ref'
import * as customPropTypes from '@stardust-ui/react-proptypes'
import { useStateManager } from '@stardust-ui/react-state'
import { createDialogManager } from '@stardust-ui/state'
import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import * as React from 'react'

import {
  UIComponentProps,
  commonPropTypes,
  ColorComponentProps,
  ContentComponentProps,
  doesNodeContainClick,
  applyAccessibilityKeyHandlers,
} from '../../lib'
import { dialogBehavior } from '../../lib/accessibility'
import { FocusTrapZoneProps } from '../../lib/accessibility/FocusZone'
import { Accessibility } from '../../lib/accessibility/types'
import { ComponentEventHandler, ShorthandValue } from '../../types'
import Button, { ButtonProps } from '../Button/Button'
import Box, { BoxProps } from '../Box/Box'
import Header from '../Header/Header'
import Portal from '../Portal/Portal'
import Flex from '../Flex/Flex'
import createComponent from 'src/lib/createComponent'

export interface DialogSlotClassNames {
  header: string
  content: string
}

export interface DialogProps
  extends UIComponentProps,
    ContentComponentProps<ShorthandValue>,
    ColorComponentProps {
  /**
   * Accessibility behavior if overridden by the user.
   * @default dialogBehavior
   */
  accessibility?: Accessibility

  /** A dialog can contain actions. */
  actions?: ShorthandValue

  /** A dialog can contain a cancel button. */
  cancelButton?: ShorthandValue

  /** A dialog can contain a confirm button. */
  confirmButton?: ShorthandValue

  /** Initial value for 'open'. */
  defaultOpen?: boolean

  /** A dialog can contain a header. */
  header?: ShorthandValue

  /**
   * Called after user's click a cancel button.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onCancel?: ComponentEventHandler<DialogProps>

  /**
   * Called after user's click a confirm button.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onConfirm?: ComponentEventHandler<DialogProps>

  /**
   * Called after user's opened a dialog.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onOpen?: ComponentEventHandler<DialogProps>

  /** Defines whether a dialog is displayed. */
  open?: boolean

  /** A dialog can contain a overlay. */
  overlay?: ShorthandValue

  /** Controls whether or not focus trap should be applied, using boolean or FocusTrapZoneProps type value. */
  trapFocus?: true | FocusTrapZoneProps

  /** Element to be rendered in-place where the dialog is defined. */
  trigger?: JSX.Element
}

const slotClassNames: DialogSlotClassNames = {
  header: `ui-dialog__header`,
  content: `'ui-dialog__content`,
}

const Dialog = createComponent<DialogProps>({
  actionHandlers: {
    closeAndFocusTrigger: e => {
      this.handleDialogCancel(e)
      e.stopPropagation()

      _.invoke(this.triggerRef, 'current.focus')
    },
    close: e => this.handleDialogCancel(e), // What we can do?
  },
  displayName: 'Dialog',
  className: 'ui-dialog',
  propTypes: {
    ...commonPropTypes.createCommon({
      children: false,
      content: 'shorthand',
      color: true,
    }),
    actions: customPropTypes.itemShorthand,
    cancelButton: customPropTypes.itemShorthand,
    confirmButton: customPropTypes.itemShorthand,
    defaultOpen: PropTypes.bool,
    header: customPropTypes.itemShorthand,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool,
    overlay: customPropTypes.itemShorthand,
    trapFocus: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    trigger: PropTypes.any,
  } as any,
  defaultProps: {
    accessibility: dialogBehavior,
    actions: {},
    overlay: {},
    trapFocus: true,
  },
  render: ({ accessibility, classes, ElementType, styles, unhandledProps }, props) => {
    const {
      actions,
      confirmButton,
      cancelButton,
      content,
      header,
      overlay,
      trapFocus,
      trigger,
    } = props

    console.log('render:', props.open)
    const manager = useStateManager(createDialogManager, { open: props.open })
    console.log('manager.state', manager.state.open)
    const contentRef = React.useRef<HTMLElement>()
    const triggerRef = React.useRef<HTMLElement>()

    const handleDialogCancel = (e: Event | React.SyntheticEvent) => {
      _.invoke(props, 'onCancel', e, { ...props, open: false })
      manager.actions.close()
    }

    const handleDialogConfirm = (e: React.SyntheticEvent) => {
      _.invoke(props, 'onConfirm', e, { ...props, open: false })
      manager.actions.close()
    }

    const handleDialogOpen = (e: React.SyntheticEvent) => {
      _.invoke(props, 'onOpen', e, { ...props, open: true })
      manager.actions.open()
    }

    const handleCancelButtonOverrides = (predefinedProps: ButtonProps) => ({
      onClick: (e: React.SyntheticEvent, buttonProps: ButtonProps) => {
        _.invoke(predefinedProps, 'onClick', e, buttonProps)
        handleDialogCancel(e)
      },
    })

    const handleConfirmButtonOverrides = (predefinedProps: ButtonProps) => ({
      onClick: (e: React.SyntheticEvent, buttonProps: ButtonProps) => {
        _.invoke(predefinedProps, 'onClick', e, buttonProps)
        handleDialogConfirm(e)
      },
    })

    const handleOverlayOverrides = (content: JSX.Element) => (predefinedProps: BoxProps) => ({
      content,
      onClick: (e: React.SyntheticEvent, overlayProps: BoxProps) => {
        _.invoke(predefinedProps, 'onClick', e, overlayProps)

        if (!doesNodeContainClick(contentRef.current, e)) {
          handleDialogCancel(e)
        }
      },
    })

    const dialogContent = (
      <Ref innerRef={contentRef}>
        <ElementType
          className={classes.root}
          {...accessibility.attributes.popup}
          {...unhandledProps}
          {...applyAccessibilityKeyHandlers(accessibility.keyHandlers.popup, unhandledProps)}
        >
          {Header.create(header, {
            defaultProps: {
              as: 'h2',
              className: slotClassNames.header,
              styles: styles.header,
              ...accessibility.attributes.header,
            },
          })}
          {Box.create(content, {
            defaultProps: {
              styles: styles.content,
              className: slotClassNames.content,
              ...accessibility.attributes.content,
            },
          })}

          {Box.create(actions, {
            defaultProps: {
              styles: styles.actions,
            },
            overrideProps: {
              content: (
                <Flex gap="gap.smaller" hAlign="end">
                  {Button.create(cancelButton, { overrideProps: handleCancelButtonOverrides })}
                  {Button.create(confirmButton, {
                    defaultProps: {
                      primary: true,
                    },
                    overrideProps: handleConfirmButtonOverrides,
                  })}
                </Flex>
              ),
            },
          })}
        </ElementType>
      </Ref>
    )
    const triggerAccessibility = {
      attributes: accessibility.attributes.trigger,
      keyHandlers: accessibility.keyHandlers.trigger,
    }

    return (
      <Portal
        onTriggerClick={handleDialogOpen}
        open={manager.state.open}
        trapFocus={trapFocus}
        trigger={trigger}
        triggerAccessibility={triggerAccessibility}
        triggerRef={triggerRef}
      >
        {Box.create(overlay, {
          defaultProps: {
            styles: styles.overlay,
          },
          overrideProps: handleOverlayOverrides(dialogContent),
        })}
      </Portal>
    )
  },
})

/**
 * A Dialog indicates a possible user action.
 */
export default Dialog
