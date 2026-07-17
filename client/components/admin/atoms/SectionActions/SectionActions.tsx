"use client";

import "./SectionActions.scss";
import Button from "@/components/atoms/Button";

type Props = {
  index: number;
  total: number;
  onInsertBelow: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

const SectionActions = ({
  index,
  total,
  onInsertBelow,
  onMoveUp,
  onMoveDown,
}: Props) => {
  return (
    <div className="add-article-section-actions">
      <Button type="button" primary onClick={onInsertBelow}>
        + odlomak ispod
      </Button>

      <Button type="button" white onClick={onMoveUp} disabled={index === 0}>
        gore
      </Button>

      <Button
        type="button"
        white
        onClick={onMoveDown}
        disabled={index === total - 1}
      >
        dolje
      </Button>
    </div>
  );
};

export default SectionActions;
