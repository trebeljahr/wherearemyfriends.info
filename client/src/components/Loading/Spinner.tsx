import "./Loading.css";

export const LoadingSpinner = () => {
  return (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
};

export const FullscreenLoader = () => {
  return (
    <div className="wrapper">
      <LoadingSpinner />
    </div>
  );
};
