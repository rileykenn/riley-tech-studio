// Hole facts for the Sussex Inlet Golf Club course, trimmed from the
// client project (sigolfclub) for the read-only homepage embed.

export type HoleData = {
  number: number;
  par: number;
  strokeIndex: number;
  metresMen: number;
  metresWomen: number;
  description: string;
  tip: string;
};

export const holes: HoleData[] = [
  {
    number: 1,
    par: 4,
    strokeIndex: 2,
    metresMen: 287,
    metresWomen: 305,
    description: 'A challenging opening hole with a tree-lined fairway. Accuracy off the tee matters here. Find the centre of the fairway for a clear approach to an elevated green.',
    tip: 'Favour the right side off the tee to avoid the trees on the left.',
  },
  {
    number: 2,
    par: 4,
    strokeIndex: 5,
    metresMen: 341,
    metresWomen: 125,
    description: 'The fairway runs straight between the gums and narrows as you near the green. The putting surface slopes from back to front, so staying below the hole makes life easier.',
    tip: 'Keep your approach under the hole. Downhill putts here get away quickly.',
  },
  {
    number: 3,
    par: 4,
    strokeIndex: 6,
    metresMen: 288,
    metresWomen: 330,
    description: 'A dogleg right through native bushland. Wallabies are often spotted grazing along the left side.',
    tip: 'A draw off the tee will cut the corner and leave a shorter approach.',
  },
  {
    number: 4,
    par: 4,
    strokeIndex: 10,
    metresMen: 225,
    metresWomen: 270,
    description: 'A shorter hole that rewards a well-placed tee shot. The fairway narrows through the trees before opening up to a generous green.',
    tip: 'Leave the driver in the bag. A 3-wood or hybrid to the widest part of the fairway is the smart play.',
  },
  {
    number: 5,
    par: 4,
    strokeIndex: 18,
    metresMen: 100,
    metresWomen: 300,
    description: 'A picturesque hole with kangaroos often lounging near the green. Straight hitting is essential with out-of-bounds on the right.',
    tip: 'Aim left-centre off the tee. The green has a subtle left-to-right break.',
  },
  {
    number: 6,
    par: 3,
    strokeIndex: 7,
    metresMen: 150,
    metresWomen: 110,
    description: 'Short on the card, but the green is well guarded, with bunkers front-left demanding a precise shot.',
    tip: 'The safest miss is right of the green, away from the bunkers.',
  },
  {
    number: 7,
    par: 3,
    strokeIndex: 11,
    metresMen: 230,
    metresWomen: 400,
    description: 'A sweeping hole through tall eucalypts, often played into the breeze. The green is generous and accepts a running shot.',
    tip: 'Take enough club and swing smoothly. The breeze is stronger than it feels on the tee.',
  },
  {
    number: 8,
    par: 4,
    strokeIndex: 15,
    metresMen: 165,
    metresWomen: 135,
    description: 'An elevated tee gives you a panoramic view of the surrounding bushland. The green is tiered, so being on the right level is crucial for a birdie putt.',
    tip: 'Check the pin position. Front pin plays a full club shorter than back pin.',
  },
  {
    number: 9,
    par: 3,
    strokeIndex: 16,
    metresMen: 133,
    metresWomen: 285,
    description: 'A fitting finish that brings you back toward the clubhouse. The green is receptive and putts run true, a fair chance to close out the round before a cold drink at the bar.',
    tip: 'Aim for the flag. The green accepts shots well and putting is true.',
  },
];
