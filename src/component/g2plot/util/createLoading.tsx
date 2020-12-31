import ContentLoader from 'react-content-loader';

type Props = {
  type?: string;
  loadingTemplate?: React.ReactElement;
}

const ChartLoading = ({ type, loadingTemplate }: Props) => {
  const renderLoading = () => {
    if (loadingTemplate) {
      return loadingTemplate;
    }
    let loadingElement: React.ReactNode;
    switch (type) {
      case 'bar':
      case 'column':
      case 'pie':
      default:
        loadingElement = (
          <ContentLoader
            viewBox="0 0 400 180"
            // backgroundColor="rgba(0,0,0,0.2)"
            width={200}
            height={90}
            speed={1}
          >
            <rect fill="#dddddd" x="20" y="5" rx="0" ry="0" width="1" height="170" />
            <rect fill="#dddddd" x="20" y="175" rx="0" ry="0" width="360" height="1" />
            <rect fill="#dddddd" x="40" y="75" rx="0" ry="0" width="35" height="100" />
            <rect fill="#dddddd" x="80" y="125" rx="0" ry="0" width="35" height="50" />
            <rect fill="#dddddd" x="120" y="105" rx="0" ry="0" width="35" height="70" />
            <rect fill="#dddddd" x="160" y="35" rx="0" ry="0" width="35" height="140" />
            <rect fill="#dddddd" x="200" y="55" rx="0" ry="0" width="35" height="120" />
            <rect fill="#dddddd" x="240" y="15" rx="0" ry="0" width="35" height="160" />
            <rect fill="#dddddd" x="280" y="135" rx="0" ry="0" width="35" height="40" />
            <rect fill="#dddddd" x="320" y="85" rx="0" ry="0" width="35" height="90" />
          </ContentLoader>
        );
    }
    return loadingElement;
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        top: 0,
        zIndex: 99,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
      }}
    >
      {renderLoading()}
    </div>
  );
};

export default ChartLoading;
