import { HTMLAttributes } from 'react';
import PopperProps from 'zarm/lib/popper/PropsType';

export type Trigger = 'click' | 'hover' | 'contextMenu';

export interface PropsType extends PopperProps, HTMLAttributes<HTMLDivElement> {
  prefixCls: string;
  disabled: boolean;
  shape: 'radius' | 'rect';
  triggerProps?: HTMLAttributes<HTMLSpanElement>;
  onVisibleChange: (visible: boolean) => void;
}

export interface StateType {
  visible?: boolean;
  positionInfo: {
    left: number;
    top: number;
  };
  animationState: string | null;
}
