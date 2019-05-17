import { ManagerFactory } from '@stardust-ui/state'
import * as React from 'react'

const onlyDefinedProps = <S extends Record<string, any>>(props: S) => {
  const definedProps: Partial<S> = {}

  Object.keys(props).forEach(k => {
    if (props[k] !== undefined) {
      definedProps[k] = props[k]
    }
  })

  return definedProps
}

const useStateManager = <S, A>(
  createStateManager: ManagerFactory<S, A>,
  controlledProps: Partial<S>,
) => {
  // Heads up! setState() is used only for triggering rerenders stateManager is SSOT()
  const [, setState] = React.useState()
  const syncState = React.useCallback(({ state }) => setState(state), [])

  const manager = React.useRef(
    // TODO: fix types
    // @ts-ignore
    createStateManager({
      debug: true,
      // TODO: defaultOpen prop
      state: onlyDefinedProps(controlledProps),
      sideEffects: [syncState],
    }),
  )

  manager.current.__EVIL__HYDRATE_STATE(onlyDefinedProps(controlledProps))

  return manager.current
}

export default useStateManager
