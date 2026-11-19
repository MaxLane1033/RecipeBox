import { useEffect, useRef, useState } from 'react';

export function useClampedText(text: string) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: remeasure the DOM after changed text has committed, even if its box size stays equal.
  useEffect(() => {
    const element = ref.current;
    if (!element || expanded) return;
    let disposed = false;
    const measure = () => {
      if (!disposed) setOverflowing(element.scrollHeight > element.clientHeight + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [text, expanded]);
  return {
    ref,
    expanded,
    canExpand: expanded || overflowing,
    toggle: () => setExpanded((value) => !value),
  };
}
