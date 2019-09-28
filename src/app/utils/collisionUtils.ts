import { IGlyph } from "../render-engine/glyph/IGlyph";

export function collide(
  g1: IGlyph,
  g2: IGlyph,
  speed: { top?: number; bottom?: number; left?: number; right?: number },
) {
  const leftTopCornerA = g1.getPosition();
  const leftTopCornerB = g2.getPosition();
  const rightBottomCornerA = {
    x: g1.getPosition().x + g1.getWidth(),
    y: g1.getPosition().y + g1.getHeight(),
  };
  const rightBottomCornerB = {
    x: g2.getPosition().x + g2.getWidth(),
    y: g2.getPosition().y + g2.getHeight(),
  };

  return !(
    rightBottomCornerA.x + (speed.right || 0) < leftTopCornerB.x ||
    rightBottomCornerB.x < leftTopCornerA.x - (speed.left || 0) ||
    rightBottomCornerA.y + (speed.bottom || 0) < leftTopCornerB.y ||
    rightBottomCornerB.y < leftTopCornerA.y - (speed.top || 0)
  );
}
