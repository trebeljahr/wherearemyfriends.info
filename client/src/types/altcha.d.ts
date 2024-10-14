declare namespace JSX {
  interface IntrinsicElements {
    "altcha-widget": AltchaAttrs;
  }

  interface AltchaAttrs {
    ref?: React.RefObject<HTMLElement>;
    style?: React.CSSProperties & {
      "--altcha-max-width": string;
    };
    debug?: boolean;
    test?: boolean;
    auto?: string;
    challengeurl?: string;
    floating?: boolean;
    hidelogo?: boolean;
    hidefooter?: boolean;
  }
}
