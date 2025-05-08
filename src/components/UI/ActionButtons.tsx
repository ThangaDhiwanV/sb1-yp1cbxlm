import React from 'react';

interface ActionButtonsProps {
  onDocClick: () => void;
  onHalClick: () => void;
  onApiClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDocClick,
  onHalClick,
  onApiClick
}) => {
  return (
    <div className="flex space-x-2 mt-4">
      <button
        onClick={onDocClick}
        className="action-button"
      >
        Doc
      </button>
      <button
        onClick={onHalClick}
        className="action-button"
      >
        HAL
      </button>
      <button
        onClick={onApiClick}
        className="action-button"
      >
        API
      </button>
    </div>
  );
};

export default ActionButtons;