import * as _ from 'lodash'

import { pxToRem } from '../../../../lib'
import { ComponentSlotStylesInput, ICSSInJSStyle } from '../../../types'
import { LabelProps } from '../../../../components/Label/Label'
import { LabelVariables } from './labelVariables'
import { getColorSchemeKey } from '../../colors'

const labelStyles: ComponentSlotStylesInput<LabelProps, LabelVariables> = {
  root: ({ props: p, variables: v }): ICSSInJSStyle => {
    const colors = v.colorScheme[getColorSchemeKey(p.color)]

    return {
      display: 'inline-flex',
      alignItems: 'center',
      overflow: 'hidden',
      height: v.height,
      lineHeight: v.height,
      color: colors.backgroundDefault,
      backgroundColor: colors.foregroundDefault,
      fontSize: pxToRem(14),
      borderRadius: pxToRem(3),
      padding: v.padding,
      ...(p.image &&
        (p.imagePosition === 'start'
          ? { paddingLeft: v.startPaddingLeft }
          : { paddingRight: v.endPaddingRight })),
      ...(p.circular && {
        borderRadius: v.circularRadius,
      }),
    }
  },

  image: ({ variables: v }): ICSSInJSStyle => ({
    height: v.height,
    width: v.height,
  }),

  icon: ({ props: p }): ICSSInJSStyle =>
    p.icon &&
    typeof p.icon === 'object' &&
    (p.icon as any).onClick && {
      cursor: 'pointer',
    },
}

export default labelStyles
