import React from 'react';
import { parse, parseSimple } from 'mfm-js';
import { useMemo } from 'react';

import { MfmNodeView } from './MfmNodeView';


export type MfmProp = {
    children: string;
    plain?: boolean;
}

export const MfmView = (p: MfmProp) => {
  const forest = useMemo(() => p.plain ? parseSimple(p.children) : parse(p.children), [p.children, p.plain]);

  return forest.map((node, i) => <MfmNodeView key={i} node={node} />);
};
