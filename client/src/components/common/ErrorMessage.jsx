const Error = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-sm text-red-400/95 leading-snug" role="alert">
      {message}
    </p>
  );
};

export default Error;
