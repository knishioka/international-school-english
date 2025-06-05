// Framer Motion の完全なモック
const mockMotion = {
  div: ({ children, ...props }) => <div {...props}>{children}</div>,
  button: ({ children, ...props }) => <button {...props}>{children}</button>,
  header: ({ children, ...props }) => <header {...props}>{children}</header>,
  section: ({ children, ...props }) => <section {...props}>{children}</section>,
  article: ({ children, ...props }) => <article {...props}>{children}</article>,
  aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
  nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
  li: ({ children, ...props }) => <li {...props}>{children}</li>,
  span: ({ children, ...props }) => <span {...props}>{children}</span>,
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
  h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
  h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
};

const mockAnimatePresence = ({ children }) => children;

const mockUseAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
});

const mockUseMotionValue = (initial) => ({
  current: initial,
  get: () => initial,
  set: jest.fn(),
  on: jest.fn(),
  destroy: jest.fn(),
});

const mockUseTransform = () => mockUseMotionValue(0);

const mockUseSpring = (value) => mockUseMotionValue(value);

module.exports = {
  motion: mockMotion,
  AnimatePresence: mockAnimatePresence,
  useAnimation: mockUseAnimation,
  useMotionValue: mockUseMotionValue,
  useTransform: mockUseTransform,
  useSpring: mockUseSpring,
  useScroll: () => ({
    scrollX: mockUseMotionValue(0),
    scrollY: mockUseMotionValue(0),
    scrollXProgress: mockUseMotionValue(0),
    scrollYProgress: mockUseMotionValue(0),
  }),
  useViewportScroll: () => ({
    scrollX: mockUseMotionValue(0),
    scrollY: mockUseMotionValue(0),
    scrollXProgress: mockUseMotionValue(0),
    scrollYProgress: mockUseMotionValue(0),
  }),
  useCycle: () => [0, jest.fn()],
  usePresence: () => [true, jest.fn()],
  useIsPresent: () => true,
  LayoutGroup: ({ children }) => children,
  LazyMotion: ({ children }) => children,
  domAnimation: {},
  domMax: {},
  m: mockMotion,
};