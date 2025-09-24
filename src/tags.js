// Central tag metadata: key, label (CZ), icon path
import bag from "/icons/bag.svg";
import bikini from "/icons/bikini.svg";
import bonfire from "/icons/bonfire.svg";
import cafe from "/icons/cafe.svg";
import family from "/icons/family.svg";
import stroller from "/icons/stroller.svg";
import tent from "/icons/tent.svg";
import glutenfree from "/icons/gluten-free.svg";

export const TAGS = [
  {
    key: "bag",
    label: "Svačinu s sebou",
    tooltip: "Vlastní svačina – na místě není občerstvení",
    icon: bag,
  },
  { key: "bikini", label: "Koupání", tooltip: "Možnost koupání", icon: bikini },
  { key: "bonfire", label: "Ohniště", tooltip: "Ohniště / možnost opékání", icon: bonfire },
  { key: "cafe", label: "Občerstvení", tooltip: "Stánek, bufet nebo kavárna poblíž", icon: cafe },
  { key: "family", label: "Pro rodiny", tooltip: "Vhodné pro děti", icon: family },
  { key: "stroller", label: "S kočárkem", tooltip: "Dostupné s kočárkem", icon: stroller },
  { key: "tent", label: "Kempování", tooltip: "Možnost stanování / přespání v kempu", icon: tent },
  {
    key: "glutenfree",
    label: "Bez lepku",
    tooltip: "Bezlepková nabídka v občerstvení",
    icon: glutenfree,
  },
];

export const TAG_BY_KEY = Object.fromEntries(TAGS.map((tag) => [tag.key, tag]));
export const KEY_BY_ICON = Object.fromEntries(TAGS.map((tag) => [tag.icon, tag.key]));

export const resolveTagKey = (value) => {
  if (typeof value !== 'string') return null;
  if (TAG_BY_KEY[value]) return value;
  return KEY_BY_ICON[value] ?? null;
};

export const normalizeTagList = (values = []) => {
  const keys = values
    .map((value) => resolveTagKey(value))
    .filter(Boolean);
  return Array.from(new Set(keys));
};
