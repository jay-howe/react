import * as customPropTypes from '@stardust-ui/react-proptypes'
import * as PropTypes from 'prop-types'
import * as React from 'react'

import {
  createShorthandFactory,
  UIComponentProps,
  commonPropTypes,
  ColorComponentProps,
  SizeValue,
} from '../../lib'
import { loaderBehavior } from '../../lib/accessibility'
import { Accessibility } from '../../lib/accessibility/types'
import { ShorthandValue, withSafeTypeForAs } from '../../types'
import Box from '../Box/Box'
import createComponent from 'src/lib/createComponent'

export type LoaderPosition = 'above' | 'below' | 'start' | 'end'

export interface LoaderSlotClassNames {
  indicator: string
  label: string
  svg: string
}

export interface LoaderProps extends UIComponentProps, ColorComponentProps {
  /**
   * Accessibility behavior if overridden by the user.
   * @default loaderBehavior
   */
  accessibility?: Accessibility

  /** Time in milliseconds after component mount before spinner is visible. */
  delay?: number

  /** A loader can contain an indicator. */
  indicator?: ShorthandValue

  /** Loaders can appear inline with content. */
  inline?: boolean

  /** A loader can contain a label. */
  label?: ShorthandValue

  /** A label in the loader can have different positions. */
  labelPosition?: LoaderPosition

  /** A size of the loader. */
  size?: SizeValue

  /** A loader can contain a custom svg element. */
  svg?: ShorthandValue
}

const slotClassNames: LoaderSlotClassNames = {
  indicator: `ui-loader__indicator`,
  label: `ui-loader__label`,
  svg: `ui-loader__svg`,
}

const Loader = createComponent<LoaderProps>({
  className: 'ui-loader',
  displayName: 'Loader',
  propTypes: {
    ...commonPropTypes.createCommon({
      children: false,
      content: false,
      color: true,
    }),
    delay: PropTypes.number,
    indicator: customPropTypes.itemShorthand,
    inline: PropTypes.bool,
    label: customPropTypes.itemShorthand,
    labelPosition: PropTypes.oneOf(['above', 'below', 'start', 'end']),
    size: customPropTypes.size,
    svg: customPropTypes.itemShorthand,
  } as any,
  defaultProps: {
    accessibility: loaderBehavior,
    delay: 0,
    indicator: {},
    labelPosition: 'below',
    svg: '',
    size: 'medium',
  },
  render: ({ ElementType, classes, accessibility, variables, styles, unhandledProps }, props) => {
    const { delay, indicator, label, svg } = props

    const delayTimer = React.useRef<number>()
    const [visible, setVisible] = React.useState<boolean>(delay === 0)

    React.useEffect(() => {
      if (delay > 0) {
        delayTimer.current = window.setTimeout(() => {
          setVisible(true)
        }, delay)
      }

      return () => clearTimeout(delayTimer.current)
    }, [])

    const svgElement = Box.create(svg, {
      defaultProps: { className: slotClassNames.svg, styles: styles.svg },
    })

    return (
      visible && (
        <ElementType
          className={classes.root}
          {...accessibility.attributes.root}
          {...unhandledProps}
        >
          {Box.create(indicator, {
            defaultProps: {
              children: svgElement,
              className: slotClassNames.indicator,
              styles: styles.indicator,
            },
          })}
          {Box.create(label, {
            defaultProps: { className: slotClassNames.label, styles: styles.label },
          })}
        </ElementType>
      )
    )
  },
})

Loader.create = createShorthandFactory({ Component: Loader })
;(Loader as any).slotClassNames = slotClassNames

/**
 * A Loader indicates a possible user action.
 */
export default withSafeTypeForAs<typeof Loader, LoaderProps>(Loader)
