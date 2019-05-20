import { Manager, ManagerFactory, Middleware } from '@stardust-ui/state'
import * as React from 'react'

import { getDefinedAutoControlledProps, getInitialAutoControlledState } from './stateUtils'

const useStateManager = <S, A, P extends Partial<S>, C extends keyof S & string>(
  component: React.FunctionComponent<P>,
  createStateManager: ManagerFactory<S, A>,
  autoControlledProps: C[],
  props: P,
): Manager<S, A> => {
  const definedAutoControlledProps = getDefinedAutoControlledProps(autoControlledProps, props)
  const autoControlledValues = autoControlledProps.reduce(
    (values: any[], propName: C) => [...values, props[propName]],
    [],
  )

  const overrideAutoControlledProps: Middleware<S, A> = (_prevState: S, nextState: S) => ({
    ...nextState,
    ...definedAutoControlledProps,
  })

  // Heads up! setState() is used only for triggering rerenders stateManager is SSOT()
  const [, setState] = React.useState()
  const syncState = React.useCallback(({ state }) => setState(state), [])

  const latestManager = React.useRef<Manager<S, A> | null>(null)
  const manager = React.useMemo(() => {
    console.log('Manager', latestManager)
    const initialState = latestManager.current
      ? { ...latestManager.current, ...definedAutoControlledProps }
      : getInitialAutoControlledState(
          component,
          /* TODO: fix types */
          // @ts-ignore
          autoControlledProps,
          props,
        )

    // @ts-ignore
    return createStateManager({
      debug: true,
      // TODO: defaultOpen prop
      state: initialState,
      middleware: [overrideAutoControlledProps],
      sideEffects: [syncState],
    })
  }, autoControlledValues)

  latestManager.current = manager

  return manager
}

export default useStateManager
