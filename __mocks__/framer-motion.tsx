import React from 'react';

// Framer Motion の完全なモック
const createMockComponent = (Component: string) => 
  React.forwardRef<any, any>(({ children, whileHover, whileTap, whileFocus, whileDrag, animate, initial, exit, transition, variants, layout, layoutId, ...props }, ref) => 
    React.createElement(Component, { ...props, ref }, children)
  );

export const motion = {
  div: createMockComponent('div'),
  button: createMockComponent('button'),
  header: createMockComponent('header'),
  section: createMockComponent('section'),
  article: createMockComponent('article'),
  aside: createMockComponent('aside'),
  nav: createMockComponent('nav'),
  ul: createMockComponent('ul'),
  li: createMockComponent('li'),
  span: createMockComponent('span'),
  p: createMockComponent('p'),
  h1: createMockComponent('h1'),
  h2: createMockComponent('h2'),
  h3: createMockComponent('h3'),
  h4: createMockComponent('h4'),
  h5: createMockComponent('h5'),
  h6: createMockComponent('h6'),
  a: createMockComponent('a'),
  img: createMockComponent('img'),
  form: createMockComponent('form'),
  input: createMockComponent('input'),
  textarea: createMockComponent('textarea'),
  select: createMockComponent('select'),
  option: createMockComponent('option'),
  label: createMockComponent('label'),
};

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const useAnimation = () => ({
  start: jest.fn(() => Promise.resolve()),
  stop: jest.fn(),
  set: jest.fn(),
  mount: jest.fn(),
  unmount: jest.fn(),
});

export const useMotionValue = (initial: any) => ({
  current: initial,
  get: () => initial,
  set: jest.fn(),
  on: jest.fn(),
  onChange: jest.fn(),
  destroy: jest.fn(),
  updateAndNotify: jest.fn(),
  hasAnimated: false,
});

export const useTransform = () => useMotionValue(0);
export const useSpring = (value: any) => useMotionValue(value);

export const useScroll = () => ({
  scrollX: useMotionValue(0),
  scrollY: useMotionValue(0),
  scrollXProgress: useMotionValue(0),
  scrollYProgress: useMotionValue(0),
});

export const useViewportScroll = useScroll;

export const useCycle = (...args: any[]) => {
  const [state, setState] = React.useState(0);
  const cycle = React.useCallback(() => {
    setState((s) => (s + 1) % args.length);
  }, [args.length]);
  return [args[state], cycle];
};

export const usePresence = () => [true, jest.fn()];
export const useIsPresent = () => true;
export const useReducedMotion = () => false;
export const useReducedMotionConfig = () => ({ reducedMotion: 'never' as const });

export const LayoutGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const LazyMotion: React.FC<{ children: React.ReactNode; features: any }> = ({ children }) => <>{children}</>;
export const MotionConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const domAnimation = {};
export const domMax = {};
export const m = motion;

// Animation controls
export const animationControls = {
  start: jest.fn(() => Promise.resolve()),
  stop: jest.fn(),
  set: jest.fn(),
  mount: jest.fn(),
  unmount: jest.fn(),
};

export const useAnimationControls = () => animationControls;

// Drag controls
export const useDragControls = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  isDragging: false,
});

// Focus controls
export const useFocusWithin = () => ({
  isFocusWithin: false,
});

// Hover controls
export const useHover = () => ({
  isHovered: false,
});

// Tap controls
export const useTap = () => ({
  isTapped: false,
});

// In view
export const useInView = () => ({
  ref: React.useRef(null),
  inView: true,
});

// Variants
export const useVariants = () => ({});

// Export all as default too
export default {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useViewportScroll,
  useCycle,
  usePresence,
  useIsPresent,
  useReducedMotion,
  useReducedMotionConfig,
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domAnimation,
  domMax,
  m,
  animationControls,
  useAnimationControls,
  useDragControls,
  useFocusWithin,
  useHover,
  useTap,
  useInView,
  useVariants,
};