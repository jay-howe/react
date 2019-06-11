import * as React from 'react'

import defaultComponents from './defaultComponents'
import KnobsContext, { KnobContextValue } from './KnobContext'
import { KnobComponents, KnobDefinition, KnobName, KnobSet } from './types'

type KnobProviderProps = {
  components?: Partial<KnobComponents>
  unstable_skipRegister?: boolean
}

const KnobProvider: React.FunctionComponent<KnobProviderProps> = props => {
  const { children, components, unstable_skipRegister } = props
  const [knobs, setKnobs] = React.useState<KnobSet>({})

  const prev = React.useContext(KnobsContext)

  const registerKnob = (knob: KnobDefinition) => {
    if (unstable_skipRegister) return

    setKnobs(prevKnobs => {
      if (process.env.NODE_ENV !== 'production') {
        if (prevKnobs[knob.name]) {
          throw new Error(`Knob with name "${knob.name}" has been already registered`)
        }
      }
      return { ...prevKnobs, [knob.name]: knob }
    })
  }
  const setKnobValue = (knobName: KnobName, knobValue: any) => {
    setKnobs(prevKnob => ({
      ...prevKnob,
      [knobName]: { ...prevKnob[knobName], value: knobValue },
    }))
  }
  const unregisterKnob = (knobName: KnobName) => {
    if (unstable_skipRegister) return

    setKnobs(prevKnobs => {
      const newKnobs = { ...prevKnobs }
      delete newKnobs[knobName]

      return newKnobs
    })
  }

  const value: KnobContextValue = React.useMemo(
    () => ({
      components: { ...defaultComponents, ...props.components },
      knobs,
      registerKnob,
      setKnobValue,
      unregisterKnob,
    }),
    [knobs, components],
  )

  if (unstable_skipRegister) {
    const newVar = {
      ...prev,
      registerKnob: () => {},
      unregisterKnob: () => {},
    }
    return <KnobsContext.Provider value={newVar}>{children}</KnobsContext.Provider>
  }

  return <KnobsContext.Provider value={value}>{children}</KnobsContext.Provider>
}

KnobProvider.defaultProps = {
  components: {},
}

export default KnobProvider
