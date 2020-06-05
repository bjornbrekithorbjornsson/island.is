import {
  createElement,
  forwardRef,
  AllHTMLAttributes,
  ElementType,
} from 'react'
import { useBoxStyles, UseBoxStylesProps } from './useBoxStyles'

export interface BoxProps
  extends Omit<UseBoxStylesProps, 'component'>,
    Omit<AllHTMLAttributes<HTMLElement>, 'width' | 'height' | 'className'> {
  component?: ElementType
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      component = 'div',
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      display,
      flexDirection,
      flexWrap,
      flexShrink,
      flexGrow,
      alignItems,
      justifyContent,
      textAlign,
      border,
      borderRadius,
      background,
      boxShadow,
      transition,
      transform,
      height,
      width,
      position,
      cursor,
      pointerEvents,
      overflow,
      minWidth,
      top,
      bottom,
      right,
      left,
      userSelect,
      outline,
      opacity,
      className,
      ...restProps
    },
    ref,
  ) => {
    const boxStyles = useBoxStyles({
      component,
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      display,
      flexDirection,
      flexWrap,
      flexShrink,
      flexGrow,
      alignItems,
      justifyContent,
      textAlign,
      border,
      borderRadius,
      background,
      boxShadow,
      transition,
      transform,
      height,
      width,
      position,
      cursor,
      pointerEvents,
      overflow,
      minWidth,
      top,
      bottom,
      right,
      left,
      userSelect,
      outline,
      opacity,
      className,
    })

    return createElement(component, {
      className: boxStyles,
      ...restProps,
      ref,
    })
  },
)
