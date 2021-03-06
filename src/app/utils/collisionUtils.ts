import { IGlyph } from "../render-engine/glyph/IGlyph";
import { IRenderEngine } from "../render-engine/IRenderEngine";

export function collide(
  g1: IGlyph,
  g2: IGlyph,
  speed: { top?: number; bottom?: number; left?: number; right?: number },
  margins?: { top?: number; bottom?: number; left?: number; right?: number },
) {
  const leftTopCornerA = g1.getAbsolutePosition();
  const leftTopCornerB = g2.getAbsolutePosition();
  const rightBottomCornerA = {
    x: leftTopCornerA.x + g1.getWidth(),
    y: leftTopCornerA.y + g1.getHeight(),
  };
  const rightBottomCornerB = {
    x: leftTopCornerB.x + g2.getWidth(),
    y: leftTopCornerB.y + g2.getHeight(),
  };

  const mTop = (margins || {}).top || 0;
  const mBottom = (margins || {}).bottom || 0;
  const mLeft = (margins || {}).left || 0;
  const mRight = (margins || {}).right || 0;

  return !(
    rightBottomCornerA.x - mRight + (speed.right || 0) <
      leftTopCornerB.x + mLeft ||
    rightBottomCornerB.x - mRight <
      leftTopCornerA.x + mLeft - (speed.left || 0) ||
    rightBottomCornerA.y + mBottom + (speed.bottom || 0) <
      leftTopCornerB.y - mTop ||
    rightBottomCornerB.y + mBottom < leftTopCornerA.y - mTop - (speed.top || 0)
  );
}

export function outOfScreen(
  g: IGlyph,
  renderEngine: IRenderEngine,
  speed: { top?: number; bottom?: number; left?: number; right?: number },
  margins?: { top?: number; bottom?: number; left?: number; right?: number },
) {
  const leftTopCornerA = g.getAbsolutePosition();
  const rightBottomCornerA = {
    x: leftTopCornerA.x + g.getWidth(),
    y: leftTopCornerA.y + g.getHeight(),
  };

  const mTop = (margins || {}).top || 0;
  const mBottom = (margins || {}).bottom || 0;
  const mLeft = (margins || {}).left || 0;
  const mRight = (margins || {}).right || 0;

  return (
    leftTopCornerA.x + mLeft - (speed.left || 0) < 0 ||
    leftTopCornerA.y + mTop - (speed.top || 0) < 0 ||
    rightBottomCornerA.x - mRight + (speed.right || 0) >
      renderEngine.getScreenWidth() ||
    rightBottomCornerA.y - mBottom + (speed.bottom || 0) >
      renderEngine.getScreenHeight()
  );
}
