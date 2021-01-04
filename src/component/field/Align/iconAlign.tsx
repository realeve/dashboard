import React from 'react';
import Icon from '@ant-design/icons';

const LeftSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 1024 1024">
      <path d="M181.312 960H106.688V64h74.624v896zM928 773.312H256V250.688h672v522.624z m-74.688-74.624V325.312H330.688v373.376h522.624z"></path>
    </svg>
  </svg>
);

const CenterSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 1024 1024">
      <path d="M160 250.688h312.832V64h78.272v186.688H864v522.624l-312.896 0.064V960H472.96l-0.064-186.624H160V250.624z m391.104 74.688v373.312h234.688V325.312l-234.688 0.064z m-312.896 0v373.312h234.624V325.376H238.208z"></path>
    </svg>
  </svg>
);

const RightSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 1024 1024">
      <path d="M852.352 64H928v896h-75.648V64zM96 250.688h680.704v522.624H96V250.688z m75.648 74.624v373.376h529.472V325.312H171.648z"></path>
    </svg>
  </svg>
);

export const AlignLeftIcon = (props) => <Icon component={LeftSvg} {...props} />;
export const AlignCenterIcon = (props) => <Icon component={CenterSvg} {...props} />;
export const AlignRightIcon = (props) => <Icon component={RightSvg} {...props} />;
