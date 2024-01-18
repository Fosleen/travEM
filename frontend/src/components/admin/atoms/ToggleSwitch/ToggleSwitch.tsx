import "./ToggleSwitch.scss";

const ToggleSwitch = ({ name, description, value, setter }) => {
  const handleToggle = () => {
    setter(!value);
  };

  return (
    <div className="toggle-switch-container">
      <div className="toggle-switch">
        <input
          type="checkbox"
          className="toggle-switch-checkbox"
          name={name}
          id={name}
          checked={value}
          onChange={handleToggle}
        />
        <label className="toggle-switch-label" htmlFor={name}>
          <span className="toggle-switch-inner" />
          <span className="toggle-switch-switch" />
        </label>
      </div>
      <p>{description}</p>
    </div>
  );
};

export default ToggleSwitch;
