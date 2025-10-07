import { Tag, TagCategory, TagFilterGroup } from "@/models/tag.model";
import { computed } from "vue";

export default function useTags(tags: Tag[]) {
  const uncategorized = new TagCategory({
    id: 'uncategorised',
    name: 'Тэги',
  })
  const groupped = computed(() => {
    return tags.reduce((acc, item) => {
      const category = item?.category ?? uncategorized;
      const group = getOrAddMapItem(acc, category.id, { category: category, list: [] });
      const tag = { ...item, category: undefined };
      group.list.push(tag);
      return acc;
    }, new Map<string, TagFilterGroup>());
  })

  function getOrAddMapItem<T>(map: Map<string, T>, key: string, initialValue: T): T {
    const item = map.get(key);
    if (item) return item;
    else {
      const newValue = { ...initialValue };
      map.set(key, newValue);
      return newValue;
    }
  }

  return { tags, groupped };
}