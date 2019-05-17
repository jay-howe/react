import createManager from '../createManager'
import { Action, ManagerConfig } from '../types'

export type DialogState = {
  open: boolean
}

export type DialogActions = {
  open: Action<DialogState, DialogActions>
  close: Action<DialogState, DialogActions>
}

export const createDialogManager = (
  config: Partial<ManagerConfig<DialogState, DialogActions>> = {},
) =>
  createManager<DialogState, DialogActions>({
    ...config,
    state: {
      open: false,
      ...config.state,
    },

    actions: {
      close: () => () => ({ open: false }),
      open: () => () => ({ open: true }),

      ...config.actions,
    },
  })
