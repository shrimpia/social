import * as React from "react";

function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg viewBox="0 0 512 512" width="1em" height="1em" {...props}>
      <path d="M64 32C28.7 32 0 60.7 0 96s28.7 64 64 64h1c3.7 88.9 77 160 167 160h56V128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h400c8.8 0 16-7.2 16-16s-7.2-16-16-16H64zm160 424c0 13.3 10.7 24 24 24h72v-72.2l-64.1-22.4c-12.5-4.4-26.2 2.2-30.6 14.7s2.2 26.2 14.7 30.6l4.5 1.6C233 433.9 224 443.9 224 456zm128 23.3c36.4-3.3 69.5-17.6 96.1-39.6l-86.5-34.6c-3 1.8-6.2 3.2-9.6 4.3v69.9zM472.6 415c24.6-30.3 39.4-68.9 39.4-111 0-12.3-1.3-24.3-3.7-35.9l-125.5 87c.8 3.4 1.2 7 1.2 10.6 0 4.6-.7 9-1.9 13.1l90.5 36.2zM336 128h-16v192h18.3c9.9 0 19.1 3.2 26.6 8.5l133.5-92.4C471.8 172.6 409.1 128 336 128zm-168 64a24 24 0 1148 0 24 24 0 11-48 0z" />
    </svg>
  );
}

const ShrimpSolid = React.memo(Icon);
export default ShrimpSolid;
