import { Button, Dialog } from '@stardust-ui/react'
import * as React from 'react'

const DialogExample = () => {
  const [open, setOpen] = React.useState(false)
  ;(window as any).setOpen = setOpen

  return (
    <Dialog
      open={open}
      cancelButton="Cancel"
      confirmButton="Confirm"
      header="Action confirmation"
      trigger={<Button content="Open a dialog" />}
    />
  )
}

export default DialogExample
