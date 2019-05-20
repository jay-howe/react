import * as React from 'react'

export const getDefaultPropName = (propName: string) =>
  `default${propName[0].toUpperCase() + propName.slice(1)}`

export const getDefinedAutoControlledProps = <P extends Record<string, any>, N extends keyof P>(
  autoControlledProps: N[],
  props: P,
) => {
  const definedProps: Partial<P> = {}

  autoControlledProps.forEach(k => {
    if (props[k] !== undefined) {
      definedProps[k] = props[k]
    }
  })

  return definedProps
}

/**
 * Return the auto controlled state value for a give prop. The initial value is chosen in this order:
 *  - regular props
 *  - then, default props
 *  - then, initial state
 *  - then, `checked` defaults to false
 *  - then, `value` defaults to '' or [] if props.multiple
 *  - else, undefined
 *
 *  @param {string} propName A prop name
 *  @param {object} [props] A props object
 */
export const getAutoControlledStateValue = <P extends Record<string, any>, N extends keyof P>(
  propName: N,
  props: P,
) => {
  // regular props
  const propValue = props[propName]
  if (propValue !== undefined) return propValue

  // defaultProps
  const defaultProp = props[getDefaultPropName(propName as string)]
  if (defaultProp !== undefined) return defaultProp

  // React doesn't allow changing from uncontrolled to controlled components,
  // default checked/value if they were not present.
  if (propName === 'checked') return false
  if (propName === 'value') return props.multiple ? [] : ''

  // otherwise, undefined
}

export const getInitialAutoControlledState = <
  P extends Record<string, any>,
  N extends keyof P & string
>(
  component: React.FunctionComponent<P>,
  autoControlledProps: N[],
  props: P,
): Partial<P> => {
  if (process.env.NODE_ENV !== 'production') {
    // require propTypes
    autoControlledProps.forEach(propName => {
      const defaultPropName = getDefaultPropName(propName)

      // Consumes may use TypeScript and keep `propTypes` undefined
      if (component.propTypes) {
        // regular prop
        if (!component.propTypes[defaultPropName]) {
          console.error(
            `${
              component.name
            } is missing "${defaultPropName}" propTypes validation for auto controlled prop "${propName}".`,
          )
        }

        // its default prop
        if (!component.propTypes[propName]) {
          console.error(
            `${
              component.name
            } is missing propTypes validation for auto controlled prop "${propName}".`,
          )
        }
      }
    })

    // prevent autoControlledProps in defaultProps
    //
    // When setting state, auto controlled props values always win (so the parent can manage them).
    // It is not reasonable to decipher the difference between props from the parent and defaultProps.
    // Allowing defaultProps results in trySetState always deferring to the defaultProp value.
    // Auto controlled props also listed in defaultProps can never be updated.
    //
    // To set defaults for an AutoControlled prop, you can set the initial state in the
    // constructor or by using an ES7 property initializer:
    // https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers
    if (component.defaultProps) {
      const illegalDefaults = Object.keys(component.defaultProps).filter(
        (propName: N) => autoControlledProps.indexOf(propName) !== -1,
      )

      if (illegalDefaults.length > 0) {
        console.error(
          [
            'Do not set defaultProps for autoControlledProps. You can set defaults by',
            'setting state in the constructor or using an ES7 property initializer',
            '(https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers)',
            `See ${component.name} props: "${illegalDefaults}".`,
          ].join(' '),
        )
      }
    }

    // prevent listing defaultProps in autoControlledProps
    //
    // Default props are automatically handled.
    // Listing defaults in autoControlledProps would result in allowing defaultDefaultValue props.
    const illegalAutoControlled = autoControlledProps.filter(propName =>
      propName.startsWith('default'),
    )

    if (illegalAutoControlled.length > 0) {
      console.error(
        [
          'Do not add default props to autoControlledProps.',
          'Default props are automatically handled.',
          `See ${component.name} autoControlledProps: "${illegalAutoControlled}".`,
        ].join(' '),
      )
    }
  }

  // Auto controlled props are copied to state.
  // Set initial state by copying auto controlled props to state.
  // Also look for the default prop for any auto controlled props (foo => defaultFoo)
  // so we can set initial values from defaults.
  return autoControlledProps.reduce(
    (acc, propName) => {
      acc[propName] = getAutoControlledStateValue(propName, props)

      if (process.env.NODE_ENV !== 'production') {
        const defaultPropName = getDefaultPropName(propName)

        // prevent defaultFoo={} along side foo={}
        if (props[defaultPropName] !== undefined && props[propName] !== undefined) {
          console.error(
            `${
              component.name
            } prop "${propName}" is auto controlled. Specify either ${defaultPropName} or ${propName}, but not both.`,
          )
        }
      }

      return acc
    },
    {} as Partial<P>,
  )
}
