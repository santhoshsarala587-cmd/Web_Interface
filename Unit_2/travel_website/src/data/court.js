// Parts of the Kabaddi court that can be selected on the interactive illustration.
// `hit` is the highlighted rectangle in the SVG's own coordinates (court is 600 x 780).
export const courtParts = [
  {
    id: 'raider',
    label: 'The raider',
    title: 'One player, alone in enemy territory',
    text: 'The raider crosses into the other half and tries to touch defenders and get back home. The whole raid is held in a single breath, which is why the chant of “kabaddi” is part of the game.',
    shape: { type: 'circle', cx: 300, cy: 480, r: 44 },
  },
  {
    id: 'chain',
    label: 'The defenders’ chain',
    title: 'Seven defenders, one unit',
    text: 'Defenders can link hands to form a chain and hold the raider off together. They win the raid by stopping the raider before they reach home, so a chain only works if everyone trusts the person beside them.',
    shape: { type: 'rect', x: 70, y: 122, width: 460, height: 120 },
  },
  {
    id: 'baulk',
    label: 'Baulk line',
    title: 'The line that makes a raid count',
    text: 'The raider has to get past this line on the defenders’ side for the raid to count. Stopping short earns nothing, so every raid is a decision about how far to go.',
    shape: { type: 'rect', x: 0, y: 150, width: 600, height: 30 },
  },
  {
    id: 'bonus',
    label: 'Bonus line',
    title: 'A chance at an extra point',
    text: 'Crossing this line can earn the raider a bonus point when enough defenders are on the court. It rewards a raider who is willing to take the bolder route.',
    shape: { type: 'rect', x: 0, y: 90, width: 600, height: 30 },
  },
  {
    id: 'midline',
    label: 'Midline',
    title: 'The line between two halves',
    text: 'It splits the court into two halves, one for each team. A raid only scores if the raider gets safely back across it.',
    shape: { type: 'rect', x: 0, y: 372, width: 600, height: 36 },
  },
  {
    id: 'lobby',
    label: 'Lobby',
    title: 'The side strips',
    text: 'The strips along each side only become part of the court once a raider and a defender have touched. Until then they are out of play.',
    shape: { type: 'rect', x: 0, y: 0, width: 60, height: 780 },
    shapeB: { type: 'rect', x: 540, y: 0, width: 60, height: 780 },
  },
];

export default courtParts;
