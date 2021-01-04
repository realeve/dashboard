import React from 'react';
import Icon from '@ant-design/icons';

const TopSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 1024 1024">
      <path d="M896 213.312V960H128V213.312h768zM819.2 288H204.8v597.312h614.4V288z m-114.368 195.072l48.448 57.856-199.616 158.016-109.76-85.632L305.92 723.2l-48.64-57.792L443.392 517.12l109.952 85.76 151.488-119.872zM665.6 64v74.688H358.4V64h307.2z"></path>
    </svg>
  </svg>
);

const LeftSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 1024 1024">
      <path d="M960 128v768H213.312V128H960z m-74.688 76.8H288v614.4h597.312V204.8zM139.712 362.688v298.624h-76.8V362.688h76.8z m634.368 42.752l47.168 59.52L627.2 627.52 520.448 539.392l-134.144 113.024-47.296-59.456 180.992-152.384 106.88 88.192 147.2-123.328z"></path>
    </svg>
  </svg>
);

const BottomSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 1024 1024">
      <path d="M665.6 885.312V960H358.4v-74.688h307.2zM896 64v746.688H128V64h768z m-76.8 74.688H204.8V736h614.4V138.688z m-114.368 195.008l48.448 57.92-199.616 158.016L443.904 464 305.92 573.824l-48.64-57.728 186.112-148.224 109.952 85.76 151.488-119.936z"></path>
    </svg>
  </svg>
);

const RightSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 1024 1024">
      <path d="M810.688 128v768H64V128h746.688zM736 204.8H138.688v614.4H736V204.8z m225.088 157.888v298.624h-76.8V362.688h76.8z m-336.32 42.752l47.168 59.52-194.112 162.56L371.2 539.392l-134.144 113.024-47.36-59.456 180.992-152.384 106.88 88.192 147.264-123.328z"></path>
    </svg>
  </svg>
);

export const TopIcon = (props) => <Icon component={TopSvg} {...props} />;

export const LeftIcon = (props) => <Icon component={LeftSvg} {...props} />;
export const BottomIcon = (props) => <Icon component={BottomSvg} {...props} />;
export const RightIcon = (props) => <Icon component={RightSvg} {...props} />;
